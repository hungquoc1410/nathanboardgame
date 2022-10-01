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

import { createArrayFromObject } from '../services/create-array-from-object'
import { Database, IRoom } from '../services/firebase'

import RoomTableRow from './room-table-row'

const RoomTable: React.FC = () => {
  const [data, setData] = React.useState<IRoom[]>()

  React.useEffect(() => {
    return onValue(ref(Database, 'rooms'), (snap) => {
      if (snap.exists()) {
        setData(createArrayFromObject(snap.val()))
      } else {
        setData([])
      }
    })
  }, [])

  return (
    <div className='w-full flex justify-center'>
      <div className='w-full laptop:w-1/2 p-1 bg-gradient-to-br from-blue-500 to-pink-500'>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Master</TableCell>
                <TableCell>Players</TableCell>
                <TableCell>Game</TableCell>
                <TableCell>Join</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((room) => {
                  return <RoomTableRow key={room.id} roomData={room} />
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

export default RoomTable
