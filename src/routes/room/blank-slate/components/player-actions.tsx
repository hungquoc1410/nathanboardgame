import React from 'react'

import { Button, Paper } from '@mui/material'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { updateRoom } from '../../../../services/firebase'
import { getInfo } from '../../../../services/localforage'
import { BSReset, BSRoomStart, IBSPlayer } from '../services/blank-slate'
import { BSProps } from '..'

const BSPlayerActions: React.FC<BSProps> = ({ roomData }) => {
  const [data, setData] = React.useState<IBSPlayer>()

  const startRound = () => {
    BSRoomStart(roomData)
  }

  const newGame = () => {
    BSReset(roomData)
  }

  const backToWait = () => {
    BSReset(roomData)
    updateRoom(roomData.id, { phase: 'wait' })
  }

  const actions = () => {
    if (data) {
      const { phase, master } = data
      switch (master) {
        case true:
          switch (phase) {
            case 'ready':
              if (roomData.phase === 'play') {
                return (
                  <>
                    <Button onClick={() => startRound()}>Start Round</Button>
                    <Button onClick={() => backToWait()} color='secondary' variant='outlined'>
                      Back to waiting room
                    </Button>
                  </>
                )
              }
              break
            case 'end':
              return (
                <>
                  <Button onClick={() => newGame()}>Start a new game</Button>
                  <Button onClick={() => backToWait()} color='secondary' variant='outlined'>
                    Back to waiting room
                  </Button>
                </>
              )
          }
          break
        default:
          break
      }
    }
  }

  React.useEffect(() => {
    getInfo().then((value) => {
      if (value) {
        const info = value
        const playersData: IBSPlayer[] = createArrayFromObject(roomData.players)
        setData(playersData.filter((player) => player.id === info.playerId)[0])
      }
    })
  }, [roomData])

  return (
    <div className='w-full flex flex-1 p-1 bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl'>
      <Paper
        className='w-full flex flex-1 p-4 justify-center items-center'
        elevation={3}
        sx={{ borderRadius: 6 }}
      >
        {data && <div className='flex flex-col gap-4'>{actions()}</div>}
      </Paper>
    </div>
  )
}

export default BSPlayerActions
