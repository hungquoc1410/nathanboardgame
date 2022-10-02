import React from 'react'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { getInfo } from '../../../../services/localforage'
import Dice from '../../components/dice/dice'
import { ILDPlayer, ILDRoom, LDCheckRule, LDToggleFixedDice } from '../services/lucky-dog'
import { LDProps } from '..'

import TurnPlayer from './turn-player'

const PhasePlayer: React.FC<LDProps> = ({ roomData }) => {
  const [data, setData] = React.useState<ILDRoom>()
  const [turn, setTurn] = React.useState(false)

  const lockDice = (index: number, value: number) => {
    if (turn && value !== 0) {
      LDToggleFixedDice(roomData, index)
    }
  }

  React.useEffect(() => {
    setData(roomData)
  }, [roomData])

  React.useEffect(() => {
    getInfo().then((value) => {
      if (value && value.playerId) {
        const players: ILDPlayer[] = createArrayFromObject(roomData.players)
        const player = players.filter((player) => player.id === value.playerId)[0]
        const index = players.indexOf(player)
        setTurn(index + 1 === roomData.turn)
      }
    })
  }, [roomData])

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='grid laptop:grid-cols-5 grid-cols-2 gap-4'>
        {data &&
          data.deck &&
          data.deck.map((card) => {
            return (
              <img
                alt='card'
                className={LDCheckRule(card.split('_')[0], roomData) ? '' : 'opacity-50'}
                key={card}
                src={`/games/ld/cards/${card}`}
              />
            )
          })}
      </div>
      <br />
      <div className='grid laptop:grid-cols-2 gap-4 w-full'>
        <div className='grid grid-cols-5 gap-8 w-full'>
          {data &&
            data.dice &&
            data.dice.map((die, index) => {
              return (
                <div
                  key={`die_${index}`}
                  onClick={() => lockDice(index, die.value)}
                  className={`aspect-square ${die.fixed && 'outline outline-8 outline-blue-500'}`}
                >
                  <Dice die={die} index={index} />
                </div>
              )
            })}
        </div>
        <div className='flex justify-start items-center'>
          {turn && <TurnPlayer roomData={roomData} />}
        </div>
      </div>
    </div>
  )
}

export default PhasePlayer
