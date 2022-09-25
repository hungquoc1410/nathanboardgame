import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { setPlayerRef } from '../../../../services/firebase'
import { getInfo, IInfo } from '../../../../services/localforage'
import { IBLPlayer } from '../services/blank-slate'

const PlayerActions: React.FC = () => {
  const params = useParams()
  const [data, setData] = React.useState<IBLPlayer>()
  const [info, setInfo] = React.useState<IInfo>()

  let playerRef: Query

  getInfo().then((value) => {
    if (value && value !== info) {
      setInfo(value)
    }
  })

  if (info && info.playerId && params.roomId) {
    playerRef = setPlayerRef(params.roomId, info.playerId)
  }

  React.useEffect(() => {
    if (info) {
      return onValue(playerRef, (snap) => {
        if (snap.exists()) {
          setData(snap.val())
        }
      })
    }
  }, [info])

  return <>{data && <div>{data.name}</div>}</>
}

export default PlayerActions
