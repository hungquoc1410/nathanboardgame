import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { Button, Paper } from '@mui/material'

import { setPlayerRef, updateRoom } from '../../../../services/firebase'
import { getInfo, IInfo } from '../../../../services/localforage'
import { BSPlayerPhase, BSReset, BSRoomStart, IBSPlayer } from '../services/blank-slate'

const PlayerActions: React.FC = () => {
  const params = useParams()
  const [data, setData] = React.useState<IBSPlayer>()
  const [info, setInfo] = React.useState<IInfo>()

  getInfo().then((value) => {
    if (value && value !== info) {
      setInfo(value)
    }
  })

  let playerRef: Query
  if (info && info.playerId && params.roomId) {
    playerRef = setPlayerRef(params.roomId, info.playerId)
  }

  const startRound = () => {
    if (params.roomId) {
      BSRoomStart(params.roomId)
    }
  }

  const newGame = () => {
    if (params.roomId) {
      BSReset(params.roomId)
    }
  }

  const backToWait = () => {
    if (params.roomId) {
      BSReset(params.roomId)
      updateRoom(params.roomId, { phase: 'wait' })
    }
  }

  const actions = () => {
    if (data) {
      const { phase, master } = data
      switch (master) {
        case true:
          switch (phase) {
            case 'ready':
              return (
                <div className='flex flex-col gap-4'>
                  <Button onClick={() => startRound()}>Start Round</Button>
                  <Button onClick={() => backToWait()}>Back to waiting room</Button>
                </div>
              )
            case 'end':
              return (
                <div className='flex flex-col gap-4'>
                  <Button onClick={() => newGame()}>Start a new round</Button>
                  <Button onClick={() => backToWait()}>Back to waiting room</Button>
                </div>
              )
          }
          break
        default:
          break
      }
    }
  }

  React.useEffect(() => {
    if (info) {
      return onValue(playerRef, (snap) => {
        if (snap.exists() && params.roomId) {
          setData(snap.val())
          switch (snap.val().phase) {
            case 'submit':
              BSPlayerPhase(params.roomId, 'submit', 'point')
              break
            case 'point':
              BSPlayerPhase(params.roomId, 'point', 'end')
              break
          }
        }
      })
    }
  }, [info])

  return (
    <div className='w-full flex flex-1 p-1 bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl'>
      <Paper
        className='w-full flex flex-1 justify-center items-center'
        elevation={3}
        sx={{ borderRadius: 6 }}
      >
        {data && actions()}
      </Paper>
    </div>
  )
}

export default PlayerActions
