import React from 'react'

import { Paper } from '@mui/material'

const CAHPlayerActions: React.FC = () => {
  return (
    <div className='w-full flex flex-1 p-1 bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl'>
      <Paper
        className='w-full flex flex-1 justify-center items-center'
        elevation={3}
        sx={{ borderRadius: 6 }}
      >
        Actions
      </Paper>
    </div>
  )
}

export default CAHPlayerActions
