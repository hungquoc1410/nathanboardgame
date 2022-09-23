import React from 'react'

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

import { colors } from '../../services/colors'

export default function ColorInput() {
  const [color, setColor] = React.useState(colors[0].value)
  const changeColor = (event: SelectChangeEvent<string>) => {
    setColor(event.target.value)
  }

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
          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        >
          {colors.map((option) => (
            <MenuItem
              key={option.name}
              value={option.value}
              sx={{ backgroundColor: option.value, color: 'transparent' }}
            >
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
