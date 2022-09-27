import React from 'react'
import { onValue } from 'firebase/database'
import { useNavigate } from 'react-router-dom'

import { Button, Chip, TableCell, TableRow, useTheme } from '@mui/material'

import { createPlayer, IRoom, setRoomRef } from '../services/firebase'
import { getInfo, setInfo } from '../services/localforage'

const RoomTableRow: React.FC<{ roomId: string }> = ({ roomId }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [data, setData] = React.useState<IRoom>()
  const roomRef = setRoomRef(roomId)

  const joinRoom = async () => {
    setInfo({ roomId: roomId })
    const info = await getInfo()
    const { playerId, playerName, playerColor } = info
    if (playerId && playerName && playerColor) {
      const playerData = {
        id: playerId,
        name: playerName,
        color: playerColor,
        master: false,
        phase: 'wait',
        points: 0,
      }
      createPlayer(roomId, playerId, playerData)
    }
    navigate(roomId)
  }

  React.useEffect(() => {
    return onValue(roomRef, (snap) => {
      if (snap.exists()) {
        setData(snap.val())
      }
    })
  }, [roomId])

  return (
    <>
      {data && data.numOfPlayers !== data.maxPlayer && data.phase === 'wait' && (
        <TableRow>
          <TableCell>{roomId}</TableCell>
          <TableCell>{`${data.numOfPlayers}/${data.maxPlayer}`}</TableCell>
          <TableCell>
            <Chip
              label={data.title}
              sx={{
                backgroundColor: data.color,
                color: theme.palette.getContrastText(data.color),
              }}
            ></Chip>
          </TableCell>
          <TableCell>
            <Button
              onClick={() => {
                joinRoom()
              }}
            >
              Join room
            </Button>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default RoomTableRow
