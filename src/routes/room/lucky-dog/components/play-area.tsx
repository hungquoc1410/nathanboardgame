import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Paper } from '@mui/material'

import { LDRoomEnd, LDRoomPlay } from '../services/lucky-dog'
import { LDProps } from '..'

import PhasePlayer from './phase-player'

const LDPlayArea: React.FC<LDProps> = ({ roomData }) => {
  const navigate = useNavigate()

  React.useEffect(() => {
    switch (roomData.phase) {
      case 'wait':
        navigate(`/${roomData.id}`)
        break
      case 'start':
        LDRoomPlay(roomData)
        break
      case 'end':
        LDRoomEnd(roomData)
        break
    }
  }, [roomData])

  return (
    <div className='p-1 flex-1 w-full bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl mb-8'>
      <Paper elevation={3} sx={{ borderRadius: 6 }}>
        <div className='flex w-full h-full py-4 laptop:py-10 px-4 laptop:px-20 justify-center items-center'>
          {roomData.phase === 'player' && <PhasePlayer roomData={roomData} />}
        </div>
      </Paper>
    </div>
  )
}

export default LDPlayArea
