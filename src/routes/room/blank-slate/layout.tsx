import React from 'react'
import { Outlet } from 'react-router-dom'

import { Paper, Typography } from '@mui/material'

const BLLayout: React.FC = () => {
  return (
    <>
      <div className='w-full flex justify-center my-4'>
        <div className='p-1 bg-gradient-to-br from-blue-500 to-pink-500'>
          <Paper elevation={3} sx={{ px: 2, py: 1 }}>
            <Typography variant='h5'>Blank Slate</Typography>
          </Paper>
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default BLLayout
