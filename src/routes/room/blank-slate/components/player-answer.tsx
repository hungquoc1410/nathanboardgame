import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material'

import { setRoomKeyRef, updatePlayer } from '../../../../services/firebase'
import { getInfo, IInfo } from '../../../../services/localforage'

const BSPlayerAnswer: React.FC = () => {
  const params = useParams()
  const [info, setInfo] = React.useState<IInfo>()
  const [word, setWord] = React.useState<string>()
  const [answer, setAnswer] = React.useState<string>('')
  const [submit, setSubmit] = React.useState(false)

  let roomWordRef: Query
  if (params.roomId) {
    roomWordRef = setRoomKeyRef(params.roomId, 'current')
  }

  getInfo().then((value) => {
    if (value && value !== info) {
      setInfo(value)
    }
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value)
  }

  React.useEffect(() => {
    if (info && info.playerId && submit && params.roomId) {
      updatePlayer(params.roomId, info.playerId, { answer: answer.toUpperCase(), phase: 'submit' })
    }
  }, [submit])

  React.useEffect(() => {
    return onValue(roomWordRef, (snap) => {
      if (snap.exists()) {
        setWord(snap.val())
      }
    })
  }, [])

  return (
    <Paper className='w-full' elevation={6}>
      {submit ? (
        <div className='w-full p-10'>
          <Typography variant='h6' align='center'>
            Waiting for other players...
          </Typography>
        </div>
      ) : (
        <Stack spacing={4} direction='column' className='mb-4 pt-4'>
          <Divider component='div' variant='middle' role='presentation'>
            <Typography variant='h6' align='center'>
              Choose Your Answer!
            </Typography>
          </Divider>
          <Typography variant='h2' align='center'>
            {word && word}
          </Typography>
          <Stack spacing={2} className='w-1/3 self-center'>
            <TextField label='One Word Only' value={answer} onChange={handleChange} />
            <Button onClick={() => setSubmit(true)}>Sumbit</Button>
          </Stack>
        </Stack>
      )}
    </Paper>
  )
}

export default BSPlayerAnswer
