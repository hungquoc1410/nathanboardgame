import React from 'react'

import { Alert, Button, Snackbar, Stack, TextField, Typography } from '@mui/material'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { getInfo } from '../../../../services/localforage'
import { DIXITTellerPrompt, IDIXITPlayer } from '../services/dixit'
import { DIXITProps } from '..'

const TellerPrompt: React.FC<DIXITProps> = ({ roomData }) => {
  const [data, setData] = React.useState<IDIXITPlayer>()
  const [prompt, setPrompt] = React.useState<string>()
  const [chose, setChose] = React.useState<string>()
  const [openNoti, setOpenNoti] = React.useState(false)

  const changePrompt = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value)
  }

  const handleNotiClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenNoti(false)
  }

  const confirmPrompt = () => {
    if (chose && prompt && data && data.id) {
      DIXITTellerPrompt(roomData, data.id, prompt, chose)
    } else {
      setOpenNoti(true)
    }
  }

  React.useEffect(() => {
    getInfo().then((value) => {
      if (value && value.playerId) {
        const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)
        setData(players.filter((player) => player.id === value.playerId)[0])
      }
    })
  }, [roomData])

  return (
    <>
      {data && data.teller && data.cards && (
        <Stack spacing={2} className='w-full flex items-center'>
          <Stack spacing={1} className='w-full laptop:w-1/3'>
            <Typography variant='h6' align='center'>
              Enter Your Prompt
            </Typography>
            <TextField variant='outlined' label='Prompt' value={prompt} onChange={changePrompt} />
          </Stack>
          <Stack spacing={1} className='w-full'>
            <Typography variant='h6' align='center'>
              Choose Your Card
            </Typography>
            <div className='flex flex-row justify-start laptop:justify-evenly gap-6 overflow-x-scroll laptop:overflow-hidden'>
              {data.cards.map((card) => {
                return (
                  <img
                    onClick={() => setChose(card)}
                    className={`aspect-[82/125] h-60 laptop:h-64 ${
                      chose === card ? 'border-8 border-blue-500' : ''
                    }`}
                    src={`/games/dixit/${card}`}
                    alt='dixit-card'
                    key={card}
                  />
                )
              })}
            </div>
          </Stack>
          <Button onClick={() => confirmPrompt()}>Confirm</Button>
        </Stack>
      )}
      {data && !data.teller && (
        <Typography variant='h5'>Wait for the Story Teller...</Typography>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openNoti}
        autoHideDuration={3000}
        onClose={handleNotiClose}
      >
        <Alert onClose={handleNotiClose} severity='error' sx={{ maxWidth: 300 }}>
          Please enter your prompt and choose your card!
        </Alert>
      </Snackbar>
    </>
  )
}

export default TellerPrompt
