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
        <div className='aspect-[256/360]'>
          <img
            className='aspect-[256/360] h-72 laptopp:h-80'
            src={`/games/cah/black-cards/${black}`}
            alt='black-card'
          />
        </div>
      )}
      <div className='flex flex-row overflow-auto gap-6 mt-3'>
        {whites &&
          whites.map((card) => {
            return (
              <img
                onClick={() => choseWhiteCard(card)}
                className={`aspect-[256/360] h-64 laptop:h-72 ${
                  choseCard === card ? 'border-8 border-blue-500' : ''
                }`}
                src={`/games/cah/white-cards/${card}`}
                alt='black-card'
                key={card}
              />
            )
          })}
      </div>
    </>
  )
}

export default WhiteBlackCards
