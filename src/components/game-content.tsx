import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Button,
  Card,
  CardMedia,
  Chip,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material'

import { BSNewGame } from '../routes/room/blank-slate/services/blank-slate'
import { CAHNewGame } from '../routes/room/cards-against-humanity/services/cah'
import { GameInfo } from '../services/game-information'
import { getInfo, setInfo } from '../services/localforage'

interface GameContentProps {
  game: GameInfo
}

const GameContent: React.FC<GameContentProps> = ({ game }) => {
  const { title, subtitle, image, players, playtime } = game

  const navigate = useNavigate()

  const newRoom = async () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    setInfo({ roomId: id })
    const info = await getInfo()
    const { playerId, playerName, playerColor } = info
    if (playerId && playerName && playerColor) {
      switch (title) {
        case 'Blank Slate':
          BSNewGame(id, playerId, playerName, playerColor)
          break
        case 'Cards Against Humanity':
          CAHNewGame(id, playerId, playerName, playerColor)
          break
      }
    }
    navigate(id)
  }

  return (
    <div className='w-full flex flex-1 p-1 bg-gradient-to-br from-blue-500 to-pink-500'>
      <Card className='p-1 flex flex-1'>
        <Grid container spacing={{ mobile: 1, laptop: 2 }} className='flex flex-1'>
          <Grid
            item
            mobile={12}
            laptop={4}
            className='flex flex-1 aspect-square items-start laptop:aspect-auto laptop:items-center justify-center overflow-hidden'
          >
            <CardMedia component='img' image={image} alt={title} />
          </Grid>
          <Grid item mobile={12} laptop={8} className='flex justify-center laptop:justify-start'>
            <Stack direction='column' spacing={2} className='laptop:my-2'>
              <div className='hidden laptop:block'>
                <Typography variant='h4'>{title}</Typography>
                <Typography variant='subtitle1'>{subtitle}</Typography>
                <List>
                  <ListItem>
                    <Chip label={players} />
                  </ListItem>
                  <ListItem>
                    <Chip label={playtime} />
                  </ListItem>
                </List>
              </div>

              <div className='block laptop:hidden'>
                <Stack direction='row' spacing={2} justifyContent='center'>
                  <Chip label={players} />
                  <Chip label={playtime} />
                </Stack>
              </div>

              <Button
                className='self-center !mb-3'
                onClick={() => {
                  newRoom()
                }}
              >
                Create Room
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default GameContent
