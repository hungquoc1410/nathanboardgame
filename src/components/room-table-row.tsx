import React from 'react'
import { onValue } from 'firebase/database'

import { Chip, TableCell, TableRow, useTheme } from '@mui/material'

import { createArrayFromObject } from '../services/create-array-from-object'
import { getRoomInfo, setRoomPlayersRef } from '../services/firebase'

const RoomTableRow: React.FC<{ roomId: string }> = ({ roomId }) => {
  const theme = useTheme()
  const [players, setPlayers] = React.useState<number>()
  const [roomInfo, setRoomInfo] = React.useState<{
    maxPlayer: string
    title: string
    color: string
  }>()

  React.useEffect(() => {
    const setUp = async () => {
      if (!roomInfo) {
        const roomMaxPlayer = await getRoomInfo(roomId, 'maxPlayer')
        const roomTitle = await getRoomInfo(roomId, 'title')
        const roomColor = await getRoomInfo(roomId, 'color')
        setRoomInfo({ maxPlayer: roomMaxPlayer, title: roomTitle, color: roomColor })
      }
    }

    setUp()

    const roomPlayersRef = setRoomPlayersRef(roomId)
    onValue(roomPlayersRef, (snap) => {
      if (snap.exists()) {
        const num = createArrayFromObject(snap.val()).length
        setPlayers(num)
      }
    })
  }, [])

  return (
    <>
      {players && roomInfo && (
        <TableRow>
          <TableCell>{roomId}</TableCell>
          <TableCell>{`${players}/${roomInfo.maxPlayer}`}</TableCell>
          <TableCell>
            <Chip
              label={roomInfo.title}
              sx={{
                backgroundColor: roomInfo.color,
                color: theme.palette.getContrastText(roomInfo.color),
              }}
            ></Chip>
          </TableCell>
          <TableCell>Join</TableCell>
        </TableRow>
      )}
    </>
  )
}

export default RoomTableRow
