import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Box,
  Button,
  Chip,
  Paper,
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
  setRoomPhaseRef,
  setRoomPlayersRef,
  updatePlayer,
  updateRoom,
} from '../../services/firebase'
import { getInfo } from '../../services/localforage'

const RoomIndex: React.FC = () => {
  const theme = useTheme()
  const params = useParams()
  const navigate = useNavigate()
  const [data, setData] = React.useState<IRoomPlayers>()
  const [id, setId] = React.useState<string>()
  const [ready, setReady] = React.useState(false)

  let you
  if (data) {
    you = data.filter((player) => player.id === id)[0]
  }

  let roomPlayersRef: Query
  let roomPhaseRef: Query
  if (params.roomId) {
    roomPlayersRef = setRoomPlayersRef(params.roomId)
    roomPhaseRef = setRoomPhaseRef(params.roomId)
  }

  const startGame = async () => {
    if (params.roomId) {
      updateRoom(params.roomId, { phase: 'playing' })
    }
  }

  React.useEffect(() => {
    if (params.roomId && id) {
      if (ready) {
        updatePlayer(params.roomId, id, { phase: 'ready' })
      } else {
        updatePlayer(params.roomId, id, { phase: 'waiting' })
      }
    }
  }, [ready])

  React.useEffect(() => {
    const setUp = async () => {
      const info = await getInfo()
      const { playerId } = info
      if (id !== playerId) {
        setId(playerId)
      }
    }

    setUp()

    onValue(roomPlayersRef, (snap) => {
      if (snap.exists() && params.roomId) {
        const players: IRoomPlayers = createArrayFromObject(snap.val())
        setData(players)
        updateRoom(params.roomId, { numOfPlayers: players.length })
        checkMaster(params.roomId, snap.val())
      }
    })

    onValue(roomPhaseRef, async (snap) => {
      if (snap.exists()) {
        const phase = snap.val()
        if (phase === 'playing' && params.roomId) {
          const game = await getRoomInfo(params.roomId, 'game')
          navigate(game)
        }
      }
    })
  }, [])

  return (
    <Box className='w-full flex justify-center gap-10'>
      <Box className='w-1/3 mt-10'>
        <TableContainer component={Paper}>
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
                            sx={{ border: `2px solid ${theme.palette.getContrastText(row.color)}` }}
                          />
                        ) : row.phase === 'ready' ? (
                          <Chip
                            label='Ready'
                            color='success'
                            sx={{ border: `2px solid ${theme.palette.getContrastText(row.color)}` }}
                          />
                        ) : (
                          <Chip
                            label='Not Ready'
                            color='error'
                            sx={{ border: `2px solid ${theme.palette.getContrastText(row.color)}` }}
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
      <Box className='w-1/6 mt-10'>
        <TableContainer component={Paper}>
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
                    <Button onClick={() => startGame()}>Start Game</Button>
                  ) : (
                    <Button onClick={() => setReady(!ready)}>Ready</Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default RoomIndex
