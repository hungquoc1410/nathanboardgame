import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { createArrayFromObject } from '../../../services/create-array-from-object'
import { checkMaster, setRoomKeyRef } from '../../../services/firebase'

import PlayArea from './components/play-area'
import PlayerActions from './components/player-actions'
import PlayerAvatar from './components/player-avatar'
import { IBLPlayer } from './services/blank-slate'

const BLIndex: React.FC = () => {
  const params = useParams()
  const [data, setData] = React.useState<IBLPlayer[]>()

  let roomPlayersRef: Query
  if (params.roomId) {
    roomPlayersRef = setRoomKeyRef(params.roomId, 'players')
  }

  const PlayerComponent: React.FC<{ index: number }> = ({ index }) => {
    return (
      <div className='col-span-1 row-span-1 flex'>
        {data && data.length >= index && <PlayerAvatar data={data[index - 1]} />}
      </div>
    )
  }

  React.useEffect(() => {
    return onValue(roomPlayersRef, (snap) => {
      if (snap.exists() && params.roomId) {
        const result = createArrayFromObject(snap.val())
        setData(result)
        checkMaster(params.roomId, snap.val())
      }
    })
  }, [])

  return (
    <div className='w-full h-96 px-20'>
      <div className='grid grid-cols-11 grid-rows-7 gap-2'>
        <div className='col-span-1 row-span-1 flex' />
        <div className='col-span-1 row-span-1 flex' />
        <PlayerComponent index={1} />
        <div className='col-span-1 row-span-1 flex' />
        <PlayerComponent index={5} />
        <div className='col-span-1 row-span-1 flex' />
        <PlayerComponent index={3} />
        <div className='col-span-1 row-span-1 flex' />
        <div className='col-span-1 row-span-1 flex' />
        <div className='col-start-10 col-end-12 row-start-1 row-end-5 flex'>
          <PlayerActions />
        </div>
        <div className='col-span-1 row-span-1 flex' />
        <div className='col-start-2 col-end-9 row-start-2 row-end-5 flex'>
          <PlayArea />
        </div>
        <div className='col-span-1 row-span-1 flex' />
        <PlayerComponent index={7} />
        <PlayerComponent index={8} />
        <div className='col-span-1 row-span-1 flex' />
        <div className='col-span-1 row-span-1 flex' />
        <div className='col-span-1 row-span-1 flex' />
        <div className='col-span-1 row-span-1 flex' />
        <PlayerComponent index={2} />
        <div className='col-span-1 row-span-1 flex' />
        <PlayerComponent index={6} />
        <div className='col-span-1 row-span-1 flex' />
        <PlayerComponent index={4} />
        <div className='col-span-1 row-span-1 flex' />
        <div className='col-span-1 row-span-1 flex' />
        <div className='col-start-1 col-end-12 row-start-6 row-end-7 flex'>Information</div>
      </div>
    </div>
  )
}

export default BLIndex
