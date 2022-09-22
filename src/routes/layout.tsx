import * as React from 'react'
import { Outlet } from 'react-router-dom'

import { AppBar, Box, Container, Toolbar } from '@mui/material'

import DesktopHeader from './components/desktop-header'
import MobileHeader from './components/mobile-header'

export default function Layout() {
  return (
    <>
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Box sx={{ display: { xs: 'none', md: 'block' } }} className='w-full'>
              <DesktopHeader />
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }} className='w-full'>
              <MobileHeader />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  )
}
