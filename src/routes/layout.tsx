import * as React from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { onDisconnect, onValue } from 'firebase/database'
import { Outlet } from 'react-router-dom'

import { AppBar, Backdrop, Box, CircularProgress, Toolbar } from '@mui/material'

import DesktopHeader from '../components/desktop-header'
import MobileHeader from '../components/mobile-header'
import { Auth, connectedRef, setPlayerRef } from '../services/firebase'
import { getInfo, setInfo } from '../services/localforage'

const Layout: React.FC = () => {
  const [open, setOpen] = React.useState(true)

  React.useEffect(() => {
    signInAnonymously(Auth)

    onAuthStateChanged(Auth, async (user) => {
      if (user) {
        setInfo({ playerId: user.uid })
        const info = await getInfo()
        const { roomId, playerId } = info
        if (roomId && playerId) {
          const playerRef = setPlayerRef(roomId, playerId)
          onDisconnect(playerRef).remove()
        }
      }
    })

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        setOpen(false)
      }
    })
  }, [])

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
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default Layout
