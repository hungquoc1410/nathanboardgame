import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'

import { colors } from '../services/colors'
import { setInfo } from '../services/localforage'

type NameColorModalProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NameColorModal: React.FC<NameColorModalProps> = ({ open, setOpen }) => {
  const navigate = useNavigate()
  const [name, setName] = React.useState<string>('')
  const [color, setColor] = React.useState<string>(colors[0].value)

  const changeName = (event: { target: { value: React.SetStateAction<string> } }) => {
    setName(event.target.value)
  }

  const changeColor = (event: SelectChangeEvent<string>) => {
    setColor(event.target.value)
  }

  const handleModalClose = async () => {
    if (name && color) {
      setOpen(false)
      await setInfo({ playerName: name, playerColor: color })
      navigate(0)
    }
  }

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={{ bgcolor: 'background.paper' }} className='h-full flex justify-center items-center'>
        <div className='w-1/4 flex flex-col gap-10'>
          <Typography variant='h4' align='center'>
            Enter Your Information
          </Typography>
          <div className='flex justify-center items-center w-full h-full'>
            <TextField
              fullWidth
              onChange={changeName}
              value={name}
              size='small'
              label='Name'
              variant='outlined'
              placeholder='Enter a name'
            />
          </div>
          <div className='flex justify-center items-center w-full h-full'>
            <FormControl className='w-full'>
              <InputLabel id='demo-simple-select-helper-label'>Color</InputLabel>
              <Select
                labelId='demo-simple-select-helper-label'
                size='small'
                label='Color'
                value={color}
                onChange={changeColor}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 300 },
                  },
                }}
              >
                {colors.map((option) => (
                  <MenuItem
                    key={option.name}
                    value={option.value}
                    sx={{ backgroundColor: option.value }}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Button onClick={handleModalClose}>Save</Button>
        </div>
      </Box>
    </Modal>
  )
}

export default NameColorModal
