import React, { Dispatch, SetStateAction } from 'react'

import { Box, Button, Modal, Typography } from '@mui/material'

import { ILDRoom, LDPlayerDiscard } from '../services/lucky-dog'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
}

type DiscardModalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  roomData: ILDRoom
}

const DiscardModal: React.FC<DiscardModalProps> = ({ open, setOpen, roomData }) => {
  const [chose, setChose] = React.useState<string>()

  const handleClose = () => setOpen(false)

  const discardCard = () => {
    if (chose) {
      LDPlayerDiscard(roomData, chose)
      setOpen(false)
    }
  }

  return (
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
        <Typography variant='h5' align='center'>
          Choose a card to discard!
        </Typography>
        <div className='grid grid-cols-5 gap-4'>
          {roomData &&
            roomData.deck &&
            roomData.deck.map((card) => {
              return (
                <img
                  alt='card'
                  key={card}
                  className={`${chose === card ? 'border-8 border-blue-500' : ''}`}
                  src={`/games/ld/cards/${card}`}
                  onClick={() => setChose(card)}
                />
              )
            })}
        </div>
        <div className='flex justify-center'>
          {chose && <Button onClick={() => discardCard()}>Discard</Button>}
        </div>
      </Box>
    </Modal>
  )
}

export default DiscardModal
