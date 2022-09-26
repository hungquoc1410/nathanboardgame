import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import {
  getPlayerInfo,
  getRoomInfo,
  setRoomKeyRef,
  updateRoom,
} from '../../../../services/firebase'
import { getInfo, IInfo } from '../../../../services/localforage'

const WhiteBlackCards: React.FC = () => {
  const params = useParams()
  const [black, setBlack] = React.useState<string>()
  const [whites, setWhites] = React.useState<string[]>()
  const [chose, setChose] = React.useState<string>()
  const [info, setInfo] = React.useState<IInfo>()
  const [drawer, setDrawer] = React.useState(false)

  if (params.roomId) {
    getRoomInfo(params.roomId, 'currentBlack').then((value) => {
      if (value && value !== black) {
        setBlack(value)
      }
    })
  }

  let roomWhiteCardsRef: Query
  if (params.roomId) {
    roomWhiteCardsRef = setRoomKeyRef(params.roomId, 'currentWhites')
  }

  getInfo().then((value) => {
    if (value && value !== info) {
      setInfo(value)
    }
  })

  if (info && info.playerId && info.roomId) {
    getPlayerInfo(info.roomId, info.playerId, 'drawer').then((value) => {
      if (value && value !== drawer) {
        setDrawer(value)
      }
    })
  }

  const choseWhiteCard = (card: string) => {
    if (drawer) {
      setChose(card)
    }
  }

  React.useEffect(() => {
    if (roomWhiteCardsRef && black) {
      return onValue(roomWhiteCardsRef, (snap) => {
        if (snap.exists()) {
          setWhites(snap.val())
        }
      })
    }
  }, [black])

  React.useEffect(() => {
    if (chose && params.roomId) {
      updateRoom(params.roomId, { choseCard: chose })
    }
  }, [chose])

  return (
    <>
      {black && (
        <div className='max-h-72 aspect-[492/683]'>
          <img
            className='aspect-[492/683]'
            src={`/games/cards-against-humanity/black-cards/${black}`}
            alt='black-card'
          />
        </div>
      )}
      {whites &&
        whites.map((card) => {
          return (
            <img
              onClick={() => choseWhiteCard(card)}
              className={`aspect-[492/683] w-1/4 ${
                chose === card ? 'border-8 border-blue-500' : ''
              }`}
              src={`/games/cards-against-humanity/white-cards/${card}`}
              alt='black-card'
              key={card}
            />
          )
        })}
    </>
  )
}

export default WhiteBlackCards
