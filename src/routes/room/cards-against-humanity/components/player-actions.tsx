import React from 'react'

import { Button, Paper } from '@mui/material'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { updateRoom } from '../../../../services/firebase'
import { getInfo } from '../../../../services/localforage'
import {
  CAHPlayerConfirmWhite,
  CAHPlayerDraw,
  CAHRoomConfirmWhite,
  CAHStart,
  ICAHPlayer,
} from '../services/cah'
import { CAHProps } from '..'

const CAHPlayerActions: React.FC<CAHProps> = ({ roomData }) => {
  const [data, setData] = React.useState<ICAHPlayer>()

  const startRound = () => {
    CAHStart(roomData)
  }

  const backToWait = () => {
    updateRoom(roomData.id, { phase: 'wait' })
  }

  const drawCard = () => {
    CAHPlayerDraw(roomData)
  }

  const confirmRoomBlackCard = () => {
    if (roomData.currentBlack) {
      updateRoom(roomData.id, { phase: 'white' })
    }
  }

  const confirmWhiteCard = () => {
    if (data && data.choseCard) {
      CAHPlayerConfirmWhite(roomData.id, data)
    }
  }

  const confirmRoomWhiteCard = () => {
    if (roomData.choseCard) {
      CAHRoomConfirmWhite(roomData)
    }
  }

  const actions = () => {
    if (data) {
      const { phase, master, drawer } = data
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
            default:
              break
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
                  <Button onClick={() => drawCard()}>Draw a card</Button>
                  <Button
                    onClick={() => confirmRoomBlackCard()}
                    color='secondary'
                    variant='outlined'
                  >
                    Confirm
                  </Button>
                </>
              )
            case 'submit':
              if (roomData.phase === 'choose') {
                return (
                  <>
                    {roomData.currentWhites && (
                      <Button onClick={() => confirmRoomWhiteCard()}>Confirm</Button>
                    )}
                  </>
                )
              }
              break
            default:
              break
          }
          break
        default:
          switch (phase) {
            case 'receive':
              return <Button onClick={() => confirmWhiteCard()}>Confirm</Button>
            default:
              break
          }
          break
      }
    }
  }

  React.useEffect(() => {
    getInfo().then((value) => {
      if (value) {
        const info = value
        const playersData: ICAHPlayer[] = createArrayFromObject(roomData.players)
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

export default CAHPlayerActions
