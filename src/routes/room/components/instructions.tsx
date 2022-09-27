import React from 'react'

import { Box, Button, Modal } from '@mui/material'

import { getInfo } from '../../../services/localforage'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
}

const Instructions: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const [file, setFile] = React.useState<string>()
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  React.useEffect(() => {
    getInfo().then((value) => {
      if (value && value.gameId) {
        setFile(`./games/${value.gameId}/instructions.png`)
      }
    })
  }, [])

  return (
    <>
      <Button onClick={handleOpen}>Instructions</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style} className='overflow-y-auto w-11/12 laptop:w-4/5 max-h-screen'>
          {file && <img src={file} alt='instructions' />}
        </Box>
      </Modal>
    </>
  )
}

export default Instructions
