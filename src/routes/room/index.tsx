import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

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
import { IPlayer, IRoomPlayers, setRoomPlayersRef } from '../../services/firebase'
import { getInfo } from '../../services/localforage'

const RoomIndex: React.FC = () => {
  const [data, setData] = React.useState<IRoomPlayers>()
  const [id, setId] = React.useState<string>()
  let you: IPlayer = { id: '', name: '', color: '', master: false, phase: '' }
  if (data !== undefined) {
    you = data.filter((player) => player.id === id)[0]
  }
  const theme = useTheme()

  const params = useParams()

  let roomPlayersRef: Query

  if (params.roomId !== undefined) {
    roomPlayersRef = setRoomPlayersRef(params.roomId)
  }

  React.useEffect(() => {
    const setUp = async () => {
      const info = await getInfo()
      if (info.playerId && info.playerId !== id) {
        setId(info.playerId)
      }
    }

    setUp()

    onValue(roomPlayersRef, (snap) => {
      if (snap.exists()) {
        const players = createArrayFromObject(snap.val())
        setData(players)
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
                          <Chip label='Ready' color='success' />
                        ) : (
                          <Chip label='Not Ready' color='error' />
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
                <TableCell align='center'>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>
                  {you && you.master && <Button>Start Game</Button>}
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
