import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { Button, Paper } from '@mui/material'

import { setPlayerRef, updateRoom } from '../../../../services/firebase'
import { getInfo, IInfo } from '../../../../services/localforage'
import { CAHStart, ICAHPlayer } from '../services/cah'

const CAHPlayerActions: React.FC = () => {
  const params = useParams()
  const [data, setData] = React.useState<ICAHPlayer>()
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
      CAHStart(params.roomId)
    }
  }

  const newGame = () => {
    if (params.roomId) {
      console.log(params.roomId)
    }
  }

  const backToWait = () => {
    if (params.roomId) {
      console.log(params.roomId)
      updateRoom(params.roomId, { phase: 'wait' })
    }
  }

  const actions = () => {
    if (data) {
      const { phase, master, drawer } = data
      switch (master) {
        case true:
          switch (phase) {
            case 'ready':
              return (
                <>
                  <Button onClick={() => startRound()}>Start Round</Button>
                  <Button onClick={() => backToWait()} color='secondary'>
                    Back to waiting room
                  </Button>
                </>
              )
            case 'end':
              return (
                <>
                  <Button onClick={() => newGame()}>Start a new game</Button>
                  <Button onClick={() => backToWait()} color='secondary'>
                    Back to waiting room
                  </Button>
                </>
              )
          }
          break
        default:
          break
      }
      switch (drawer) {
        case true:
          switch (phase) {
            case 'draw':
              return (
                <>
                  <Button>Draw a card</Button>
                  <Button color='secondary'>Confirm</Button>
                </>
              )

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
              console.log(params.roomId, 'submit', 'point')
              break
            case 'point':
              console.log(params.roomId, 'point', 'end')
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
        {data && <div className='flex flex-col gap-4'>{actions()}</div>}
      </Paper>
    </div>
  )
}

export default CAHPlayerActions
