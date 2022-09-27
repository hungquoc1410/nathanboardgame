import React from 'react'

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
import { IBSPlayer } from '../services/blank-slate'
import { BSProps } from '..'

const sortAnswer = (obj: IBSPlayer[]) => {
  return obj.sort((a, b) => (a.answer > b.answer ? 1 : b.answer > a.answer ? -1 : 0))
}

const BSPlayerTable: React.FC<BSProps> = ({ roomData }) => {
  const theme = useTheme()
  const [data, setData] = React.useState<IBSPlayer[]>()

  React.useEffect(() => {
    const result = createArrayFromObject(roomData.players)
    setData(result)
  }, [roomData])

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
