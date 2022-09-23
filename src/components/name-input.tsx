import React from 'react'

import { TextField } from '@mui/material'

import { getInfo, setInfo } from '../services/localforage'

const NameInput: React.FC = () => {
  const [name, setName] = React.useState('')

  const changeName = (event: { target: { value: React.SetStateAction<string> } }) => {
    setName(event.target.value)
  }

  React.useEffect(() => {
    const setUp = async () => {
      const info = await getInfo()
      if (info?.playerName !== undefined) {
        setName(info.playerName)
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
          setInfo({ playerName: name })
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
