import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { setRoomKeyRef } from '../../../../services/firebase'
import { IBSPlayer } from '../services/blank-slate'

const sortAnswer = (obj: IBSPlayer[]) => {
  return obj.sort((a, b) => (a.answer > b.answer ? 1 : b.answer > a.answer ? -1 : 0))
}

const BSPlayerTable: React.FC = () => {
  const params = useParams()
  const theme = useTheme()
  const [data, setData] = React.useState<IBSPlayer[]>()

  let roomPlayersRef: Query
  if (params.roomId) {
    roomPlayersRef = setRoomKeyRef(params.roomId, 'players')
  }

  React.useEffect(() => {
    return onValue(roomPlayersRef, (snap) => {
      if (snap.exists()) {
        const result = createArrayFromObject(snap.val())
        setData(result)
      }
    })
  }, [])

  return (
    <Box className='flex-1'>
      <TableContainer component={Paper} elevation={6}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              sortAnswer(data).map((player) => {
                return (
                  <TableRow
                    key={player.id}
                    sx={{
                      backgroundColor: player.color,
                    }}
                  >
                    <TableCell sx={{ color: theme.palette.getContrastText(player.color) }}>
                      {player.name}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.getContrastText(player.color) }}>
                      {player.answer}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.getContrastText(player.color) }}>
                      {player.points}
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default BSPlayerTable
