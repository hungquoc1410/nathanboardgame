import React from 'react'
import { onValue } from 'firebase/database'
import { useNavigate } from 'react-router-dom'

import { Button, Chip, TableCell, TableRow, useTheme } from '@mui/material'

import { BSPlayer } from '../routes/room/blank-slate/services/blank-slate'
import { createArrayFromObject } from '../services/create-array-from-object'
import { getRoomInfo, setRoomPlayersRef } from '../services/firebase'
import { getInfo, setInfo } from '../services/localforage'

const RoomTableRow: React.FC<{ roomId: string }> = ({ roomId }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [players, setPlayers] = React.useState<number>()
  const [roomInfo, setRoomInfo] = React.useState<{
    maxPlayer: number
    title: string
    color: string
    phase: string
  }>()

  const joinRoom = async () => {
    setInfo({ roomId: roomId })
    const info = await getInfo()
    const { playerId, playerName, playerColor } = info
    if (playerId && playerName && playerColor) {
      BSPlayer(roomId, playerId, playerName, playerColor)
    }
    navigate(roomId)
  }

  React.useEffect(() => {
    const setUp = async () => {
      if (!roomInfo) {
        const roomMaxPlayer = await getRoomInfo(roomId, 'maxPlayer')
        const roomTitle = await getRoomInfo(roomId, 'title')
        const roomColor = await getRoomInfo(roomId, 'color')
        const roomPhase = await getRoomInfo(roomId, 'phase')
        setRoomInfo({
          maxPlayer: roomMaxPlayer,
          title: roomTitle,
          color: roomColor,
          phase: roomPhase,
        })
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
      {players && roomInfo && players !== roomInfo.maxPlayer && roomInfo.phase === 'waiting' && (
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
