import React from 'react'

import { Stack, Typography } from '@mui/material'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import PlayerAvatar from '../../components/player-avatar'
import { IDIXITPlayer } from '../services/dixit'
import { DIXITProps } from '..'

const VoteResults: React.FC<DIXITProps> = ({ roomData }) => {
  const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)

  const VoteCard: React.FC<{ card: string }> = ({ card }) => {
    const allPlayers = players.filter((player) => player.voteCard === card)

    return (
      <div className='flex flex-col gap-4 w-48'>
        <img
          className='aspect-[82/125] h-72 self-center'
          src={`/games/dixit/${card}`}
          alt='dixit-card'
          key={card}
        />
        <div className='flex flex-wrap w-full gap-4 justify-center items-center'>
          {allPlayers.map((player) => {
            return (
              <div key={player.id} className='flex'>
                <PlayerAvatar data={player} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Stack spacing={2} className='w-full'>
      <Typography variant='h5' align='center'>
        {`Story Teller Prompt: ${roomData.prompt}`}
      </Typography>
      <Stack spacing={1} className='w-full'>
        <div className='flex justify-center flex-row gap-6'>
          {roomData.submitCards.map((card) => {
            return <VoteCard key={card} card={card} />
          })}
        </div>
      </Stack>
    </Stack>
  )
}

export default VoteResults
