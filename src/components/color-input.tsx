import React from 'react'

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

import { colors } from '../services/colors'
import { updatePlayer } from '../services/firebase'
import { getInfo, setInfo } from '../services/localforage'

const ColorInput: React.FC = () => {
  const [color, setColor] = React.useState(colors[0].value)

  const changeColor = (event: SelectChangeEvent<string>) => {
    setColor(event.target.value)
  }

  const updateBrower = async () => {
    setInfo({ playerColor: color })
    const info = await getInfo()
    const { roomId, playerId } = info
    if (roomId && playerId) {
      updatePlayer(roomId, playerId, { color: color })
    }
  }

  React.useEffect(() => {
    const setUp = async () => {
      const info = await getInfo()
      if (info.playerColor) {
        setColor(info.playerColor)
      } else {
        setInfo({ playerColor: colors[0].value })
      }
    }
    setUp()
  }, [])

  return (
    <div className='flex justify-center items-center w-full h-full'>
      <FormControl className='w-full'>
        <InputLabel id='demo-simple-select-helper-label'>Color</InputLabel>
        <Select
          labelId='demo-simple-select-helper-label'
          size='small'
          label='Color'
          value={color}
          onChange={changeColor}
          onBlur={() => {
            updateBrower()
          }}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 300 },
            },
          }}
        >
          {colors.map((option) => (
            <MenuItem key={option.name} value={option.value} sx={{ backgroundColor: option.value }}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default ColorInput
