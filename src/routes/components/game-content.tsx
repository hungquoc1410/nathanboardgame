import React from 'react'

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

import { GameInfo } from '../../services/game-information'

interface GameContentProps {
  game: GameInfo
}

const GameContent: React.FC<GameContentProps> = ({ game }) => {
  const { title, subtitle, image, players, playtime } = game

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8)
    console.log(id)
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
                variant='contained'
                className='self-center !mb-3'
                onClick={() => {
                  createRoom()
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
