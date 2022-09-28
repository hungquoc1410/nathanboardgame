import React from 'react'

import { Alert, Button, Snackbar, Stack, Typography } from '@mui/material'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { getInfo } from '../../../../services/localforage'
import { DIXITPlayerVote, IDIXITPlayer } from '../services/dixit'
import { DIXITProps } from '..'

const PlayersVote: React.FC<DIXITProps> = ({ roomData }) => {
  const [data, setData] = React.useState<IDIXITPlayer>()
  const [chose, setChose] = React.useState<string>()
  const [openNoti, setOpenNoti] = React.useState(false)

  const changeChose = (card: string) => {
    if (data && !data.teller && data.submitCard && card !== data.submitCard) {
      setChose(card)
    }
  }

  const handleNotiClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenNoti(false)
  }

  const confirmVote = () => {
    if (chose && data && data.id) {
      DIXITPlayerVote(roomData, data.id, chose)
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
      <Stack spacing={2} className='w-full'>
        <Typography variant='h5' align='center'>
          Story Teller Prompt
        </Typography>
        <Typography variant='h5' align='center' className='text-pink-500'>
          {roomData.prompt}
        </Typography>
        <Stack spacing={1} className='w-full'>
          {data && data.teller ? (
            <Typography variant='h6' align='center'>
              Wait for others vote...
            </Typography>
          ) : (
            <Typography variant='h6' align='center'>
              Choose Your Vote Card
            </Typography>
          )}
          <div className='flex flex-row gap-6 overflow-scroll laptop:overflow-hidden justify-start laptop:justify-evenly'>
            {roomData.submitCards.map((card) => {
              return (
                <img
                  onClick={() => changeChose(card)}
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
          {data && !data.teller && (
            <div className='self-center'>
              <Button onClick={() => confirmVote()}>Vote</Button>
            </div>
          )}
        </Stack>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openNoti}
        autoHideDuration={3000}
        onClose={handleNotiClose}
      >
        <Alert onClose={handleNotiClose} severity='error' sx={{ maxWidth: 300 }}>
          Please choose your vote card!
        </Alert>
      </Snackbar>
    </>
  )
}

export default PlayersVote
