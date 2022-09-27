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
  Typography,
  useTheme,
} from '@mui/material'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { IBSPlayer } from '../services/blank-slate'
import { BSProps } from '..'

const sortAnswer = (obj: IBSPlayer[]) => {
  return obj.sort((a, b) => (a.points > b.points ? 1 : b.points > a.points ? -1 : 0))
}

const BSRoomTheEnd: React.FC<BSProps> = ({ roomData }) => {
  const theme = useTheme()
  const [data, setData] = React.useState<IBSPlayer[]>()

  React.useEffect(() => {
    const result = createArrayFromObject(roomData.players)
    setData(result)
  }, [roomData])
  
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <Typography variant='h4' align='center'>
        The End
      </Typography>
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
    </div>
  )
}

export default BSRoomTheEnd
