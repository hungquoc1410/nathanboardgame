import React from 'react'

import { Typography } from '@mui/material'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { updatePlayer } from '../../../../services/firebase'
import { getInfo } from '../../../../services/localforage'
import { ICAHPlayer } from '../services/cah'
import { CAHProps } from '..'

const WhiteCards: React.FC<CAHProps> = ({ roomData }) => {
  const [data, setData] = React.useState<ICAHPlayer>()
  const [chose, setChose] = React.useState<string>()

  const displayCards = () => {
    if (data) {
      const { drawer, phase, currentWhites } = data
      switch (drawer) {
        case true:
          return (
            <Typography variant='h6' align='center'>
              Waiting for other players...
            </Typography>
          )
        default:
          switch (phase) {
            case 'receive':
              return (
                <div className='flex flex-row overflow-auto gap-6 mt-3'>
                  {currentWhites.map((card) => {
                    return (
                      <img
                        onClick={() => setChose(card)}
                        className={`aspect-[256/360] h-64 laptop:h-72 ${
                          chose === card ? 'border-8 border-blue-500' : ''
                        }`}
                        src={`/games/cah/white-cards/${card}`}
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
    getInfo().then((value) => {
      if (value && value.playerId) {
        const playersData: ICAHPlayer[] = createArrayFromObject(roomData.players)
        setData(playersData.filter((player) => player.id === value.playerId)[0])
      }
    })
  }, [roomData])

  React.useEffect(() => {
    if (chose) {
      getInfo().then((value) => {
        if (value && value.roomId && value.playerId) {
          updatePlayer(value.roomId, value.playerId, { choseCard: chose })
        }
      })
    }
  }, [chose])

  return <>{data && displayCards()}</>
}

export default WhiteCards
