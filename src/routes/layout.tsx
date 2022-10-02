import React from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { onDisconnect, onValue } from 'firebase/database'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import { AppBar, Backdrop, Box, CircularProgress, Toolbar } from '@mui/material'

import DesktopHeader from '../components/desktop-header'
import MobileHeader from '../components/mobile-header'
import NameColorModal from '../components/name-color-modal'
import { Auth, checkRoom, connectedRef, setPlayerRef } from '../services/firebase'
import { getInfo, setInfo } from '../services/localforage'

signInAnonymously(Auth)

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'linear',
  duration: 0.5,
}

const Layout: React.FC = () => {
  const [openModal, setOpenModal] = React.useState(false)
  const [openBackdrop, setOpenBackdrop] = React.useState(true)
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
      const { roomId, playerId, playerName, playerColor } = info
      if (roomId && playerId) {
        setRoomId(roomId)
        setPlayerId(playerId)
      }
      if (!playerName || !playerColor) {
        setOpenModal(true)
      }
    }

    setUp()

    onAuthStateChanged(Auth, async (user) => {
      if (user) {
        await setInfo({ playerId: user.uid })
      }
    })

    return onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        setOpenBackdrop(false)
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
      <motion.div
        key={location.pathname}
        initial='initial'
        animate='in'
        variants={pageVariants}
        transition={pageTransition}
      >
        <Outlet />
      </motion.div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <NameColorModal open={openModal} setOpen={setOpenModal} />
    </>
  )
}

export default Layout
