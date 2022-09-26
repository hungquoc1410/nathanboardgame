import React from 'react'

import { Avatar, useTheme } from '@mui/material'

interface PlayerAvatarProps {
  data: { name: string; color: string }
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ data }) => {
  const theme = useTheme()

  return (
    <div className='flex flex-1 justify-center items-center'>
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
    </div>
  )
}

export default PlayerAvatar