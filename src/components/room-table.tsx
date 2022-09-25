import React from 'react'
import { onValue, ref } from 'firebase/database'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

import { Database } from '../services/firebase'

import RoomTableRow from './room-table-row'

const RoomTable: React.FC = () => {
  const [data, setData] = React.useState<string[]>()

  React.useEffect(() => {
    return onValue(ref(Database, 'allRooms/ids'), (snap) => {
      if (snap.exists()) {
        setData(snap.val())
      } else {
        setData([])
      }
    })
  }, [])

  return (
    <div className='w-full flex justify-center'>
      <div className='w-1/2 p-1 bg-gradient-to-br from-blue-500 to-pink-500'>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Players</TableCell>
                <TableCell>Game</TableCell>
                <TableCell>Join</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((room) => {
                  return <RoomTableRow key={room} roomId={room} />
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

export default RoomTable
