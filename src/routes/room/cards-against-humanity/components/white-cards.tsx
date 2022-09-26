import React from 'react'
import { onValue, Query } from 'firebase/database'

import { Typography } from '@mui/material'

import { setPlayerRef, updatePlayer } from '../../../../services/firebase'
import { getInfo, IInfo } from '../../../../services/localforage'
import { ICAHPlayer } from '../services/cah'

const WhiteCards: React.FC = () => {
  const [info, setInfo] = React.useState<IInfo>()
  const [data, setData] = React.useState<ICAHPlayer>()
  const [chose, setChose] = React.useState<string>()

  getInfo().then((value) => {
    if (value && value !== info) {
      setInfo(value)
    }
  })

  let playerRef: Query
  if (info && info.playerId && info.roomId) {
    playerRef = setPlayerRef(info.roomId, info.playerId)
  }

  const displayCards = () => {
    if (data) {
      const { drawer, phase, currentWhites } = data
      switch (drawer) {
        case true:
          break
        default:
          switch (phase) {
            case 'receive':
              return (
                <div className='max-h-72 flex flex-row overflow-x-scroll gap-6'>
                  {currentWhites.map((card) => {
                    return (
                      <img
                        onClick={() => setChose(card)}
                        className={`aspect-[492/683] w-1/4 ${
                          chose === card ? 'border-8 border-blue-500' : ''
                        }`}
                        src={`/games/cards-against-humanity/white-cards/${card}`}
                        alt='black-card'
                        key={card}
                      />
                    )
                  })}
                </div>
              )
            case 'submit':
              return (
                <Typography variant='h6' align='center'>
                  Waiting for other players...
                </Typography>
              )
          }
          break
      }
    }
  }

  React.useEffect(() => {
    if (info) {
      return onValue(playerRef, (snap) => {
        if (snap.exists()) {
          setData(snap.val())
        }
      })
    }
  }, [info])

  React.useEffect(() => {
    if (chose && info && info.roomId && info.playerId) {
      updatePlayer(info.roomId, info.playerId, { choseCard: chose })
    }
  }, [chose])

  return <>{data && displayCards()}</>
}

export default WhiteCards
