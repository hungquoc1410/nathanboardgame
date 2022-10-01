import React from 'react'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { getInfo } from '../../../../services/localforage'
import { ILDPlayer, ILDRoom } from '../services/lucky-dog'
import { LDProps } from '..'

import TurnPlayer from './turn-player'

const PhasePlayer: React.FC<LDProps> = ({ roomData }) => {
  const [data, setData] = React.useState<ILDRoom>()
  const [turn, setTurn] = React.useState(true)

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
  }, [])

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='grid grid-cols-5 gap-4'>
        {data &&
          data.deck &&
          data.deck.map((card) => {
            return <img alt='card' key={card} src={`/games/ld/cards/${card}`} />
          })}
      </div>
      <br />
      <div className='grid grid-cols-2 gap-4'>
        <div className='grid grid-cols-5 gap-4'>
          {data &&
            data.dice &&
            data.dice.map((die, index) => {
              return (
                <img
                  alt='die'
                  className='w-full'
                  key={`die_${index}`}
                  src={`/games/materials/dice/${die.toString()}.svg`}
                />
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
