import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { Button, Paper } from '@mui/material'

import { setPlayerRef } from '../../../../services/firebase'
import { getInfo, IInfo } from '../../../../services/localforage'
import { BSAnswer, BSPlay, IBLPlayer } from '../services/blank-slate'

const PlayerActions: React.FC = () => {
  const params = useParams()
  const [data, setData] = React.useState<IBLPlayer>()
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
      BSPlay(params.roomId)
    }
  }

  const actions = () => {
    if (data) {
      const { phase, master } = data
      switch (phase) {
        case 'ready':
          switch (master) {
            case true:
              return <Button onClick={() => startRound()}>Start Round</Button>
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
        if (snap.exists() && params.roomId) {
          setData(snap.val())
          switch (snap.val().phase) {
            case 'submit':
              BSAnswer(params.roomId)
              break

            default:
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
