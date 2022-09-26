import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useNavigate, useParams } from 'react-router-dom'

import { Paper } from '@mui/material'

import { setRoomKeyRef } from '../../../../services/firebase'
import { BSRoomEnd, BSRoomPlay, BSRoomPoint } from '../services/blank-slate'

import BSPlayerAnswer from './player-answer'
import BSPlayerTable from './player-table'

const BSPlayArea: React.FC = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [phase, setPhase] = React.useState<string>()

  let roomPhaseRef: Query
  if (params.roomId) {
    roomPhaseRef = setRoomKeyRef(params.roomId, 'phase')
  }

  React.useEffect(() => {
    return onValue(roomPhaseRef, (snap) => {
      if (snap.exists() && params.roomId) {
        setPhase(snap.val())
        switch (snap.val()) {
          case 'play':
            BSRoomPlay(params.roomId)
            break
          case 'point':
            BSRoomPoint(params.roomId)
            break
          case 'end':
            BSRoomEnd(params.roomId)
            break
          case 'wait':
            navigate(-1)
            break
        }
      }
    })
  }, [])

  return (
    <div className='p-1 flex-1 bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl'>
      <Paper elevation={3} sx={{ borderRadius: 6 }}>
        <div className='flex w-full h-full py-10 px-20 justify-center items-center'>
          {phase && phase === 'play' && <BSPlayerTable />}
          {phase && phase === 'answer' && <BSPlayerAnswer />}
          {phase && phase === 'end' && <div>End</div>}
        </div>
      </Paper>
    </div>
  )
}

export default BSPlayArea
