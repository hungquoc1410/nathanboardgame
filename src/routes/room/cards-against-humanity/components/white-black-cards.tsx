import React from 'react'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { updateRoom } from '../../../../services/firebase'
import { getInfo } from '../../../../services/localforage'
import { ICAHPlayer } from '../services/cah'
import { CAHProps } from '..'

const WhiteBlackCards: React.FC<CAHProps> = ({ roomData }) => {
  const [black, setBlack] = React.useState<string>()
  const [whites, setWhites] = React.useState<string[]>()
  const [chose, setChose] = React.useState<string>()
  const [drawer, setDrawer] = React.useState(false)
  const [choseCard, setChoseCard] = React.useState<string>()

  getInfo().then((value) => {
    if (value && value.playerId) {
      const players: ICAHPlayer[] = createArrayFromObject(roomData.players)
      setDrawer(players.filter((player) => player.id === value.playerId)[0].drawer)
    }
  })

  if (black !== roomData.currentBlack) {
    setBlack(roomData.currentBlack)
  }

  if (whites !== roomData.currentWhites) {
    setWhites(roomData.currentWhites)
  }

  const choseWhiteCard = (card: string) => {
    if (drawer) {
      setChose(card)
    }
  }

  React.useEffect(() => {
    setChoseCard(roomData.choseCard)
  }, [roomData])

  React.useEffect(() => {
    if (chose) {
      updateRoom(roomData.id, { choseCard: chose })
    }
  }, [chose])

  return (
    <>
      {black && (
        <div className='max-h-60 laptop:max-h-72 aspect-[492/683]'>
          <img
            className='aspect-[492/683]'
            src={`/games/cah/black-cards/${black}`}
            alt='black-card'
          />
        </div>
      )}
      {whites &&
        whites.map((card) => {
          return (
            <img
              onClick={() => choseWhiteCard(card)}
              className={`aspect-[492/683] w-1/3 laptop:w-1/4 ${
                choseCard === card ? 'border-8 border-blue-500' : ''
              }`}
              src={`/games/cah/white-cards/${card}`}
              alt='black-card'
              key={card}
            />
          )
        })}
    </>
  )
}

export default WhiteBlackCards
