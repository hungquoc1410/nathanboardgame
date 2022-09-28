import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Paper } from '@mui/material'

import {
  DIXITRoomDivide,
  DIXITRoomEnd,
  DIXITRoomPoint,
  DIXITRoomSubmit,
  DIXITRoomVote,
} from '../services/dixit'
import { DIXITProps } from '..'

import PlayersSubmit from './players-submit'
import PlayersVote from './players-vote'
import TellerPrompt from './teller-prompt'
import VoteResults from './vote-results'

const DIXITPlayArea: React.FC<DIXITProps> = ({ roomData }) => {
  const navigate = useNavigate()

  React.useEffect(() => {
    switch (roomData.phase) {
      case 'wait':
        navigate(`/${roomData.id}`)
        break
      case 'divide':
        DIXITRoomDivide(roomData)
        break
      case 'submit':
        DIXITRoomSubmit(roomData)
        break
      case 'vote':
        DIXITRoomVote(roomData)
        break
      case 'point':
        DIXITRoomPoint(roomData)
        break
      case 'end':
        DIXITRoomEnd(roomData)
        break
    }
  }, [roomData])

  return (
    <div className='p-1 flex-1 w-full bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl mb-8'>
      <Paper elevation={3} sx={{ borderRadius: 6 }}>
        <div className='flex w-full h-full py-4 laptop:py-10 px-4 laptop:px-20 justify-center items-center'>
          {roomData.phase === 'prompt' && <TellerPrompt roomData={roomData} />}
          {roomData.phase === 'submit' && <PlayersSubmit roomData={roomData} />}
          {roomData.phase === 'vote' && <PlayersVote roomData={roomData} />}
          {roomData.phase === 'end' && <VoteResults roomData={roomData} />}
        </div>
      </Paper>
    </div>
  )
}

export default DIXITPlayArea
