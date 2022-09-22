import React from 'react'

import { Casino } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'

import ColorInput from './color-input'
import NameInput from './name-input'

export default function DesktopHeader() {
  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <div className='flex justify-start items-center w-full h-full'>
          <Casino fontSize='large' sx={{ display: 'flex' }} />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className='flex justify-start items-center w-full h-full'>
          <Typography
            variant='h5'
            className='flex justify-center w-full'
            noWrap
            component='a'
            href='/'
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NATHAN BOARD GAME ONLINE
          </Typography>
        </div>
      </Grid>
      <Grid item xs>
        <Grid container spacing={2}>
          <Grid item xs>
            <NameInput />
          </Grid>
          <Grid item xs>
            <ColorInput />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
