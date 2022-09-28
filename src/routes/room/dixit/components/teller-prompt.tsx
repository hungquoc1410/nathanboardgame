import React from 'react'

import { createArrayFromObject } from '../../../../services/create-array-from-object'
import { getInfo } from '../../../../services/localforage'
import { IDIXITPlayer } from '../services/dixit'
import { DIXITProps } from '..'

const TellerPrompt: React.FC<DIXITProps> = ({ roomData }) => {
  const [data, setData] = React.useState<IDIXITPlayer>()

  React.useEffect(() => {
    getInfo().then((value) => {
      if (value && value.playerId) {
        const players: IDIXITPlayer[] = createArrayFromObject(roomData.players)
        setData(players.filter((player) => player.id === value.playerId)[0])
      }
    })
  }, [roomData])

  return <>{data && data.teller && <div>Teller</div>}</>
}

export default TellerPrompt
