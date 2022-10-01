import React from 'react'

import { Button, Stack, Typography } from '@mui/material'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { getInfo } from '../../../../services/localforage'
import { ILDPlayer, LDPlayerReRollDice, LDPlayerRollDice } from '../services/lucky-dog'
import { LDProps } from '..'

import DiscardModal from './discard-modal'

const TurnPlayer: React.FC<LDProps> = ({ roomData }) => {
  const [data, setData] = React.useState<ILDPlayer>()
  const [reroll, setReroll] = React.useState(2)
  const [openDiscard, setOpenDiscard] = React.useState(false)

  const handleOpen = () => setOpenDiscard(true)

  const rollDice = () => {
    LDPlayerRollDice(roomData)
  }

  const reRollDice = () => {
    if (reroll !== 0) {
      LDPlayerReRollDice(roomData)
      setReroll(reroll - 1)
    }
  }

  React.useEffect(() => {
    getInfo().then((value) => {
      if (value && value.playerId) {
        const players: ILDPlayer[] = createArrayFromObject(roomData.players)
        const player = players.filter((player) => player.id === value.playerId)[0]
        setData(player)
      }
    })
  }, [roomData])

  return (
    <>
      {data && data.phase && data.phase === 'ready' && (
        <Button onClick={() => rollDice()}>Roll Dice</Button>
      )}

      {data && data.phase && data.phase === 'first' && (
        <div className='flex flex-col gap-4 w-full'>
          <Typography variant='h5' align='center' className='w-full'>
            You can
          </Typography>
          <Stack spacing={2} direction='row' justifyContent='center'>
            {reroll !== 0 && (
              <>
                <Button onClick={() => reRollDice()}>Re Roll ({reroll})</Button>
                <Typography variant='overline'>OR</Typography>
              </>
            )}
            <Button onClick={handleOpen}>Discard one card</Button>
            <Typography variant='overline'>OR</Typography>
            <Button>Confirm dice</Button>
          </Stack>
        </div>
      )}
      <DiscardModal open={openDiscard} setOpen={setOpenDiscard} roomData={roomData} />

      {data && data.phase && data.phase === 'second' && (
        <div className='flex flex-col gap-4 w-full'>
          <Typography variant='h5' align='center' className='w-full'>
            You can
          </Typography>
          <Stack spacing={2} direction='row' justifyContent='center'>
            {reroll !== 0 && (
              <>
                <Button onClick={() => reRollDice()}>Re Roll ({reroll})</Button>
                <Typography variant='overline'>OR</Typography>
              </>
            )}
            <Button>Confirm dice</Button>
          </Stack>
        </div>
      )}
    </>
  )
}

export default TurnPlayer
