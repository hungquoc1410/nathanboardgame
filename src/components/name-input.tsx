import React from 'react'

import { TextField } from '@mui/material'

import { updatePlayer } from '../services/firebase'
import { getInfo, setInfo } from '../services/localforage'
import { generateName } from '../services/random-name'

const NameInput: React.FC = () => {
  const [name, setName] = React.useState('')

  const changeName = (event: { target: { value: React.SetStateAction<string> } }) => {
    setName(event.target.value)
  }

  const updateBrowser = async () => {
    setInfo({ playerName: name })
    const info = await getInfo()
    const { roomId, playerId } = info
    if (roomId && playerId) {
      updatePlayer(roomId, playerId, { name: name })
    }
  }

  React.useEffect(() => {
    const setUp = async () => {
      const info = await getInfo()
      if (info.playerName) {
        setName(info.playerName)
      } else {
        setName(generateName())
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
