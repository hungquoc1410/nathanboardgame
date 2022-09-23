import React from 'react'

import { TextField } from '@mui/material'

export default function NameInput() {
  const [name, setName] = React.useState('')
  const changeName = (event: { target: { value: React.SetStateAction<string> } }) => {
    setName(event.target.value)
  }

  return (
    <div className='flex justify-center items-center w-full h-full'>
      <TextField
        fullWidth
        onChange={changeName}
        value={name}
        size='small'
        label='Name'
        variant='outlined'
      />
    </div>
  )
}