import React from 'react'

import { TextField } from '@mui/material'

import { updatePlayer } from '../services/firebase'
import { getInfo, setInfo } from '../services/localforage'

const NameInput: React.FC = () => {
  const [name, setName] = React.useState('')
  const [roomId, setRoomId] = React.useState('')
  const [playerId, setPlayerId] = React.useState('')

  const changeName = (event: { target: { value: React.SetStateAction<string> } }) => {
    setName(event.target.value)
  }

  const updateBrowser = () => {
    setInfo({ playerName: name })
    if (roomId && playerId) {
      updatePlayer(roomId, playerId, { name: name })
    }
  }

  React.useEffect(() => {
    const setUp = async () => {
      const info = await getInfo()
      if (info.playerName !== undefined) {
        setName(info.playerName)
      }
      if (info.roomId) {
        setRoomId(info.roomId)
      }
      if (info.playerId) {
        setPlayerId(info.playerId)
      }
    }
    setUp()
  }, [])

  return (
    <div className='flex justify-center items-center w-full h-full'>
      <TextField
        fullWidth
        onChange={changeName}
        onBlur={() => {
          updateBrowser()
        }}
        value={name}
        size='small'
        label='Name'
        variant='outlined'
      />
    </div>
  )
}

export default NameInput
