import React from 'react'

import { Paper } from '@mui/material'

const CAHPlayArea: React.FC = () => {
  return (
    <div className='p-1 flex-1 bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl'>
      <Paper elevation={3} sx={{ borderRadius: 6 }}>
        <div className='flex w-full h-full py-10 px-20 justify-center items-center'></div>
      </Paper>
    </div>
  )
}

export default CAHPlayArea
