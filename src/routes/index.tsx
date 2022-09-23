import React from 'react'

import { Box, Paper, Tab, Tabs } from '@mui/material'

export default function Index() {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box className='w-full flex justify-center'>
      <Box className='w-4/5 mt-10'>
        <Paper elevation={3}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label='Create Room' />
            <Tab label='Join Room' />
          </Tabs>
        </Paper>
      </Box>
    </Box>
  )
}
