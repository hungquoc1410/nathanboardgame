import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { Paper } from '@mui/material'

import { setRoomPhaseRef } from '../../../../services/firebase'

import PlayerAnswer from './player-answer'
import PlayerTable from './player-table'

const PlayArea: React.FC = () => {
  const params = useParams()
  const [phase, setPhase] = React.useState<string>()

  let roomPhaseRef: Query
  if (params.roomId) {
    roomPhaseRef = setRoomPhaseRef(params.roomId)
  }

  React.useEffect(() => {
    return onValue(roomPhaseRef, (snap) => {
      if (snap.exists()) {
        setPhase(snap.val())
      }
    })
  }, [])
  
  return (
    <div className='p-1 flex-1 bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl'>
      <Paper elevation={3} sx={{ borderRadius: 6 }}>
        <div className='flex w-full h-full py-10 px-20 justify-center items-center'>
          {phase && phase === 'playing' && <PlayerTable />}
          {phase && phase === 'answer' && <PlayerAnswer />}
        </div>
      </Paper>
    </div>
  )
}

export default PlayArea
