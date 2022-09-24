import React from 'react'

import { Paper } from '@mui/material'

const PlayArea: React.FC = () => {
  return (
    <div className='p-1 flex-1 bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl'>
      <Paper elevation={3} sx={{ height: 500, borderRadius: 6 }}>
        Play Area
      </Paper>
    </div>
  )
}

export default PlayArea
