import React from 'react'

import { Avatar, Badge, Tooltip, useTheme } from '@mui/material'

import { IPlayer } from '../../../services/firebase'

type PlayerAvatarProps = {
  data: IPlayer
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ data }) => {
  const theme = useTheme()

  return (
    <div className='flex flex-1 justify-center items-center'>
      <Tooltip title={data.name} placement='top'>
        <Badge badgeContent={data.points} color='primary'>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: data.color,
              color: theme.palette.getContrastText(data.color),
            }}
          >
            {data.name[0]}
          </Avatar>
        </Badge>
      </Tooltip>
    </div>
  )
}

export default PlayerAvatar
