import React from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { onDisconnect, onValue } from 'firebase/database'
import { Outlet, useLocation } from 'react-router-dom'

import { AppBar, Backdrop, Box, CircularProgress, Toolbar } from '@mui/material'

import DesktopHeader from '../components/desktop-header'
import MobileHeader from '../components/mobile-header'
import { Auth, checkRoom, connectedRef, setPlayerRef } from '../services/firebase'
import { getInfo, setInfo } from '../services/localforage'

signInAnonymously(Auth)

const Layout: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(true)
  const [roomId, setRoomId] = React.useState<string>()
  const [playerId, setPlayerId] = React.useState<string>()
  const location = useLocation()

  if (roomId && playerId) {
    const playerRef = setPlayerRef(roomId, playerId)
    onDisconnect(playerRef).remove()
  }

  if (location.pathname === '/') {
    if (roomId && playerId) {
      checkRoom(roomId, playerId)
    }
  }

  React.useEffect(() => {
    const setUp = async () => {
      const info = await getInfo()
      const { roomId, playerId } = info
      if (roomId && playerId) {
        setRoomId(roomId)
        setPlayerId(playerId)
      }
    }

    setUp()

    onAuthStateChanged(Auth, async (user) => {
      if (user) {
        await setInfo({ playerId: user.uid })
      }
    })

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        setOpen(false)
      }
    })
  }, [location])

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
