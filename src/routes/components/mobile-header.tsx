import React from 'react'

import { Casino, Menu } from '@mui/icons-material'
import { Box, Grid, IconButton, SwipeableDrawer, Typography } from '@mui/material'

import ColorInput from './color-input'
import NameInput from './name-input'

export default function MobileHeader() {
  const [anchorDrawer, setAnchorDrawer] = React.useState<boolean>(false)

  const toggleDrawer = (value: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setAnchorDrawer(value)
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='menu-appbar'
          aria-haspopup='true'
          onClick={() => setAnchorDrawer(true)}
          color='inherit'
        >
          <Menu />
        </IconButton>
      </Box>
      <Casino sx={{ display: 'flex', mr: 1, alignSelf: 'center' }} />
      <Typography
        variant='h5'
        noWrap
        component='a'
        href=''
        sx={{
          mr: 2,
          display: 'flex',
          flexGrow: 1,
          alignSelf: 'center',
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        NBGO
      </Typography>
      <SwipeableDrawer
        anchor='left'
        open={anchorDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box sx={{ width: 300 }} p={2}>
          <Typography variant='h6' mb={4} align='center'>
            Your Information
          </Typography>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <NameInput />
            </Grid>
            <Grid item xs={12}>
              <ColorInput />
            </Grid>
          </Grid>
        </Box>
      </SwipeableDrawer>
    </>
  )
}
