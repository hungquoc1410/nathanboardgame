import * as React from 'react'
import { Outlet } from 'react-router-dom'

import { AppBar, Box, Toolbar } from '@mui/material'

import DesktopHeader from './components/desktop-header'
import MobileHeader from './components/mobile-header'

export default function Layout() {
  return (
    <>
      <AppBar position='static'>
        <Box>
          <Toolbar disableGutters>
            <Box sx={{ display: { mobile: 'none', laptop: 'block' } }} className='w-full px-6'>
              <DesktopHeader />
            </Box>
            <Box sx={{ display: { mobile: 'flex', laptop: 'none' } }} className='w-full px-4'>
              <MobileHeader />
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
      <Outlet />
    </>
  )
}
