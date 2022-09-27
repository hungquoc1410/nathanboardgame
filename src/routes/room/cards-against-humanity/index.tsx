import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { createArrayFromObject } from '../../../services/create-array-from-object'
import { checkMaster, setRoomRef } from '../../../services/firebase'
import PlayerAvatar from '../components/player-avatar'

import CAHPlayArea from './components/play-area'
import CAHPlayerActions from './components/player-actions'
import { ICAHRoom } from './services/cah'

export type CAHProps = {
  roomData: ICAHRoom
}

const CAHIndex: React.FC = () => {
  const params = useParams()
  const [data, setData] = React.useState<ICAHRoom>()

  let roomRef: Query
  if (params.roomId) {
    roomRef = setRoomRef(params.roomId)
  }

  const PlayerComponent: React.FC<{ index: number }> = ({ index }) => {
    let playersData
    if (data) {
      playersData = createArrayFromObject(data.players)
    }

    return (
      <>
        <div className='hidden col-span-1 row-span-1 laptop:flex'>
          {playersData && playersData.length >= index && (
            <PlayerAvatar data={playersData[index - 1]} />
          )}
        </div>
        {playersData && playersData.length >= index && (
          <div className='laptop:hidden col-span-1 row-span-1 flex'>
            <PlayerAvatar data={playersData[index - 1]} />
          </div>
        )}
      </>
    )
  }

  React.useEffect(() => {
    return onValue(roomRef, (snap) => {
      if (snap.exists()) {
        const roomData: ICAHRoom = snap.val()
        setData(roomData)
        checkMaster(roomData.id, roomData.players)
      }
    })
  }, [])

  return (
    <>
      <div className='w-full px-20 hidden laptop:block'>
        <div className='grid grid-cols-11 grid-rows-9 gap-2'>
          <div className='col-span-1 row-span-1 flex' />
          <div className='col-span-1 row-span-1 flex' />
          <PlayerComponent index={1} />
          <div className='col-span-1 row-span-1 flex' />
          <PlayerComponent index={5} />
          <div className='col-span-1 row-span-1 flex' />
          <PlayerComponent index={3} />
          <div className='col-span-1 row-span-1 flex' />
          <div className='col-span-1 row-span-1 flex' />
          <div className='col-start-10 col-end-12 row-start-1 row-end-7 flex'>
            {data && <CAHPlayerActions roomData={data} />}
          </div>
          <div className='col-span-1 row-span-1 flex' />
          <div className='col-start-2 col-end-9 row-start-2 row-end-6 flex'>
            {data && <CAHPlayArea roomData={data} />}
          </div>
          <div className='col-span-1 row-span-1 flex' />
          <PlayerComponent index={7} />
          <PlayerComponent index={8} />
          <div className='col-span-1 row-span-1 flex' />
          <div className='col-span-1 row-span-1 flex' />
          <PlayerComponent index={9} />
          <PlayerComponent index={10} />
          <div className='col-span-1 row-span-1 flex' />
          <div className='col-span-1 row-span-1 flex' />
          <PlayerComponent index={2} />
          <div className='col-span-1 row-span-1 flex' />
          <PlayerComponent index={6} />
          <div className='col-span-1 row-span-1 flex' />
          <PlayerComponent index={4} />
          <div className='col-span-1 row-span-1 flex' />
          <div className='col-span-1 row-span-1 flex' />
          <div id='information' className='col-start-1 col-end-12 row-start-8 row-end-9 flex'></div>
        </div>
      </div>
      <div className='flex flex-col laptop:hidden mb-8'>
        <div className='flex flex-col justify-center items-center gap-4'>
          <div className='flex justify-evenly gap-4'>
            <PlayerComponent index={1} />
            <PlayerComponent index={2} />
            <PlayerComponent index={3} />
            <PlayerComponent index={4} />
            <PlayerComponent index={5} />
          </div>
          <div className='flex justify-evenly'>
            <PlayerComponent index={6} />
            <PlayerComponent index={7} />
            <PlayerComponent index={8} />
            <PlayerComponent index={9} />
            <PlayerComponent index={10} />
          </div>
          {data && <CAHPlayerActions roomData={data} />}
          {data && <CAHPlayArea roomData={data} />}
        </div>
      </div>
    </>
  )
}

export default CAHIndex
