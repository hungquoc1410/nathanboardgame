import React from 'react'

import { Casino } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'

import ColorInput from './color-input'
import NameInput from './name-input'

export default function DesktopHeader() {
  return (
    <Grid container spacing={2}>
      <Grid item mobile>
        <div className='flex justify-start items-center w-full h-full'>
          <Casino fontSize='large' sx={{ display: 'flex' }} />
        </div>
      </Grid>
      <Grid item mobile={6}>
        <div className='flex justify-start items-center w-full h-full'>
          <Typography
            variant='h5'
            className='w-full'
            align='center'
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
      <Grid item mobile>
        <Grid container spacing={2}>
          <Grid item mobile>
            <NameInput />
          </Grid>
          <Grid item mobile>
            <ColorInput />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
