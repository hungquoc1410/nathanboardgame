import React from 'react'

import { Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material'

const PlayerAnswer: React.FC = () => {
  const [answer, setAnswer] = React.useState<string>('')
  const [submit, setSubmit] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value)
  }

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
            Words
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

export default PlayerAnswer
