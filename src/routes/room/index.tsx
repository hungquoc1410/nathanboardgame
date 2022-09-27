import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'

import { createArrayFromObject } from '../../services/create-array-from-object'
import {
  checkMaster,
  getRoomInfo,
  IPlayer,
  IRoomPlayers,
  setRoomKeyRef,
  updatePlayer,
  updateRoom,
} from '../../services/firebase'
import { getInfo } from '../../services/localforage'

import { BSNewGame } from './blank-slate/services/blank-slate'
import { CAHNewGame } from './cards-against-humanity/services/cah'
import Instructions from './components/instructions'

const RoomIndex: React.FC = () => {
  const theme = useTheme()
  const params = useParams()
  const navigate = useNavigate()
  const [data, setData] = React.useState<IRoomPlayers>()
  const [id, setId] = React.useState<string>()
  const [ready, setReady] = React.useState(false)
  const [openNoti, setOpenNoti] = React.useState(false)
  const [notiMessage, setNotiMessage] = React.useState('')

  let you
  if (data) {
    you = data.filter((player) => player.id === id)[0]
  }

  let roomPlayersRef: Query
  let roomPhaseRef: Query
  if (params.roomId) {
    roomPlayersRef = setRoomKeyRef(params.roomId, 'players')
    roomPhaseRef = setRoomKeyRef(params.roomId, 'phase')
  }

  const handleNotiClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenNoti(false)
  }

  const newGame = async () => {
    if (params.roomId && data) {
      const result = await checkGame()
      if (result) {
        const game = await getRoomInfo(params.roomId, 'game')
        switch (game) {
          case 'cah':
            CAHNewGame(params.roomId, data)
            break
          case 'bs':
            BSNewGame(params.roomId, data)
            break
          default:
            break
        }
        updateRoom(params.roomId, { phase: 'play' })
      }
    }
  }

  const checkGame = async () => {
    if (params.roomId) {
      let result = true
      if (data) {
        const minPlayer = await getRoomInfo(params.roomId, 'minPlayer')
        const numOfPlayers = await getRoomInfo(params.roomId, 'numOfPlayers')
        const allReady = !data.map((player) => player.phase === 'ready').includes(false)
        if (!allReady) {
          setNotiMessage('All players must be ready!')
          setOpenNoti(true)
          result = false
        } else if (numOfPlayers < minPlayer) {
          setNotiMessage('Does not have enough players!')
          setOpenNoti(true)
          result = false
        }
      } else {
        result = false
      }
      return result
    }
  }

  React.useEffect(() => {
    if (params.roomId && id) {
      if (ready) {
        updatePlayer(params.roomId, id, { phase: 'ready' })
      } else {
        updatePlayer(params.roomId, id, { phase: 'wait' })
      }
    }
  }, [ready])

  React.useEffect(() => {
    return onValue(roomPhaseRef, async (snap) => {
      if (snap.exists()) {
        const phase = snap.val()
        if (phase === 'play' && params.roomId) {
          const game = await getRoomInfo(params.roomId, 'game')
          navigate(game)
        }
      }
    })
  }, [])

  React.useEffect(() => {
    const setUp = async () => {
      const info = await getInfo()
      const { playerId } = info
      if (id !== playerId) {
        setId(playerId)
      }
    }
    setUp()

    return onValue(roomPlayersRef, (snap) => {
      if (snap.exists() && params.roomId) {
        const players: IRoomPlayers = createArrayFromObject(snap.val())
        setData(players)
        updateRoom(params.roomId, { numOfPlayers: players.length })
        checkMaster(params.roomId, snap.val())
      }
    })
  }, [])

  return (
    <>
      <Box className='w-full flex-col px-5 laptop:p-0 laptop:flex-row flex justify-center gap-10'>
        <Box className='w-full laptop:w-1/3 mt-10'>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Ready</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((row: IPlayer) => {
                    return (
                      <TableRow key={row.name} sx={{ backgroundColor: row.color }}>
                        <TableCell>
                          <Typography
                            className='h-full'
                            sx={{ color: theme.palette.getContrastText(row.color) }}
                          >
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {row.master ? (
                            <Chip
                              label='Room Master'
                              color='info'
                              sx={{
                                border: `2px solid ${theme.palette.getContrastText(row.color)}`,
                              }}
                            />
                          ) : row.phase === 'ready' ? (
                            <Chip
                              label='Ready'
                              color='success'
                              sx={{
                                border: `2px solid ${theme.palette.getContrastText(row.color)}`,
                              }}
                            />
                          ) : (
                            <Chip
                              label='Not Ready'
                              color='error'
                              sx={{
                                border: `2px solid ${theme.palette.getContrastText(row.color)}`,
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className='w-full laptop:w-1/6 laptop:mt-10'>
          <Stack spacing={2}>
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>{`Room ID: ${params.roomId}`}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align='center'>
                      {you && you.master ? (
                        <div className='flex flex-col gap-4'>
                          <Button onClick={() => newGame()}>New Game</Button>
                          <Button onClick={() => navigate('/')} variant='outlined' color='error'>
                            Leave Room
                          </Button>
                        </div>
                      ) : (
                        <div className='flex flex-col gap-4'>
                          <Button onClick={() => setReady(!ready)}>Ready</Button>
                          <Button onClick={() => navigate('/')} variant='outlined' color='error'>
                            Leave Room
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>How to Play?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align='center'>
                      <Instructions />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openNoti}
        autoHideDuration={3000}
        onClose={handleNotiClose}
      >
        <Alert onClose={handleNotiClose} severity='error' sx={{ maxWidth: 300 }}>
          {notiMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default RoomIndex
