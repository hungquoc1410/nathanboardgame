import React from 'react'

import { Box, Button, Modal } from '@mui/material'

import { getInfo } from '../../../services/localforage'
import BSInstructions from '../blank-slate/components/instructions'
import CAHInstructions from '../cards-against-humanity/components/instructions'
import DIXITInstructions from '../dixit/components/instructions'
import LDInstructions from '../lucky-dog/components/instructions'

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
  const [game, setGame] = React.useState<string>()
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const gameInstructions = () => {
    if (game) {
      switch (game) {
        case 'bs':
          return <BSInstructions />
        case 'cah':
          return <CAHInstructions />
        case 'dixit':
          return <DIXITInstructions />
        case 'ld':
          return <LDInstructions />
      }
    }
  }

  React.useEffect(() => {
    getInfo().then((value) => {
      if (value && value.gameId) {
        setGame(value.gameId)
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
        <Box
          sx={style}
          className='overflow-y-auto max-h-screen w-11/12 laptop:w-4/5 flex flex-col p-4 gap-6'
        >
          <div className='flex justify-center items-center'>{game && gameInstructions()}</div>
          <div className='flex justify-center items-center'>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default Instructions
