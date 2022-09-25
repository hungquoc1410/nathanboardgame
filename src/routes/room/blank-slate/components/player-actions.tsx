import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { Button, Paper } from '@mui/material'

import { setPlayerRef, updateRoom } from '../../../../services/firebase'
import { getInfo, IInfo } from '../../../../services/localforage'
import { IBLPlayer } from '../services/blank-slate'

const PlayerActions: React.FC = () => {
  const params = useParams()
  const [data, setData] = React.useState<IBLPlayer>()
  const [info, setInfo] = React.useState<IInfo>()

  let playerRef: Query

  getInfo().then((value) => {
    if (value && value !== info) {
      setInfo(value)
    }
  })

  if (info && info.playerId && params.roomId) {
    playerRef = setPlayerRef(params.roomId, info.playerId)
  }

  const startGame = () => {
    if (params.roomId) {
      updateRoom(params.roomId, { phase: 'answer' })
    }
  }

  const actions = () => {
    if (data) {
      const { phase, master } = data
      switch (phase) {
        case 'ready':
          switch (master) {
            case true:
              return <Button onClick={() => startGame()}>Start Round</Button>
            default:
              break
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
        if (snap.exists()) {
          setData(snap.val())
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
