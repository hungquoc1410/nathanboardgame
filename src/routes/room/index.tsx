import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import {
  Box,
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
import { PlayerDataType, setRoomPlayersRef } from '../../services/firebase'

const RoomIndex: React.FC = () => {
  const [data, setData] = React.useState([])
  const theme = useTheme()

  const params = useParams()

  let roomPlayersRef: Query

  if (params.roomId !== undefined) {
    roomPlayersRef = setRoomPlayersRef(params.roomId)
  }

  React.useEffect(() => {
    onValue(roomPlayersRef, (snap) => {
      if (snap.exists()) {
        setData(createArrayFromObject(snap.val()))
      }
    })
  }, [])

  return (
    <Box className='w-full flex justify-center'>
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
                data.map((row: PlayerDataType) => {
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
    </Box>
  )
}

export default RoomIndex
