import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Chip, Grow, TableCell, TableRow, useTheme } from '@mui/material'

import { createPlayer, getRoomMaster, IRoom } from '../services/firebase'
import { getInfo, setInfo } from '../services/localforage'

type RoomTableRowProps = {
  roomData: IRoom
}

const RoomTableRow: React.FC<RoomTableRowProps> = ({ roomData }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [data, setData] = React.useState<IRoom>()

  const joinRoom = async () => {
    if (data) {
      setInfo({ roomId: roomData.id, gameId: data.game })
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
        createPlayer(roomData.id, playerId, playerData)
      }
      navigate(roomData.id)
    }
  }

  React.useEffect(() => {
    setData(roomData)
  }, [roomData])

  return (
    <>
      {data && data.numOfPlayers !== data.maxPlayer && data.phase === 'wait' && data.players && (
        <Grow in={true}>
          <TableRow>
            <TableCell>{data && getRoomMaster(data)}</TableCell>
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
        </Grow>
      )}
    </>
  )
}

export default RoomTableRow
