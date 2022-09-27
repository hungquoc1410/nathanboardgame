import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Paper } from '@mui/material'

import { CAHRoomChoose, CAHRoomWhite } from '../services/cah'
import { CAHProps } from '..'

import BlackCard from './black-card'
import WhiteBlackCards from './white-black-cards'
import WhiteCards from './white-cards'

const CAHPlayArea: React.FC<CAHProps> = ({ roomData }) => {
  const navigate = useNavigate()

  React.useEffect(() => {
    switch (roomData.phase) {
      case 'wait':
        navigate(-1)
        break
      case 'white':
        CAHRoomWhite(roomData)
        break
      case 'choose':
        CAHRoomChoose(roomData)
        break
    }
  }, [roomData])

  return (
    <div className='p-1 flex-1 w-full bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl max-w-full'>
      <Paper elevation={3} sx={{ borderRadius: 6 }}>
        <div className='flex w-full h-full py-4 laptop:py-10 px-4 laptop:px-20 justify-center items-center flex-col gap-4'>
          {(roomData.phase === 'black' || roomData.phase === 'submit') && (
            <BlackCard roomData={roomData} />
          )}
          {roomData.phase === 'submit' && <WhiteCards roomData={roomData} />}
          {roomData.phase === 'choose' && <WhiteBlackCards roomData={roomData} />}
        </div>
      </Paper>
    </div>
  )
}

export default CAHPlayArea
