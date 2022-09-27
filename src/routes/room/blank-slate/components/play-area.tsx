import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Paper } from '@mui/material'

import { BSRoomEnd, BSRoomPlay, BSRoomPoint } from '../services/blank-slate'
import { BSProps } from '..'

import BSPlayerAnswer from './player-answer'
import BSPlayerTable from './player-table'

const BSPlayArea: React.FC<BSProps> = ({ roomData }) => {
  const navigate = useNavigate()

  React.useEffect(() => {
    switch (roomData.phase) {
      case 'play':
        BSRoomPlay(roomData)
        break
      case 'point':
        BSRoomPoint(roomData)
        break
      case 'end':
        BSRoomEnd(roomData)
        break
      case 'wait':
        navigate(-1)
        break
    }
  }, [roomData])

  return (
    <div className='p-1 flex-1 bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl'>
      <Paper elevation={3} sx={{ borderRadius: 6 }}>
        <div className='flex w-full h-full py-10 px-20 justify-center items-center'>
          {roomData.phase === 'play' && <BSPlayerTable />}
          {roomData.phase === 'answer' && <BSPlayerAnswer />}
          {roomData.phase === 'end' && <div>End</div>}
        </div>
      </Paper>
    </div>
  )
}

export default BSPlayArea
