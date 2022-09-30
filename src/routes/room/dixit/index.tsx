import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { createArrayFromObject } from '../../../services/create-array-from-object'
import { checkMaster, setRoomRef } from '../../../services/firebase'
import PlayerAvatar from '../components/player-avatar'

import DIXITPlayArea from './components/play-area'
import DIXITPlayerActions from './components/player-actions'
import { IDIXITRoom } from './services/dixit'

export type DIXITProps = {
  roomData: IDIXITRoom
}

const DIXITIndex: React.FC = () => {
  const params = useParams()
  const [data, setData] = React.useState<IDIXITRoom>()

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
        {playersData && playersData.length >= index && (
          <div className='flex'>
            <PlayerAvatar data={playersData[index - 1]} />
          </div>
        )}
      </>
    )
  }

  React.useEffect(() => {
    return onValue(roomRef, (snap) => {
      if (snap.exists()) {
        const roomData: IDIXITRoom = snap.val()
        setData(roomData)
        checkMaster(roomData.id, roomData.players)
      }
    })
  }, [])
  
  return (
    <>
      <div className='hidden laptop:flex w-full px-20'>
        <div className='w-full flex flex-col gap-4'>
          <div className='flex-1 min-w-0 flex'>
            <div className='basis-3/4 min-w-0 flex-col justify-center items-center flex gap-4'>
              <div className='flex justify-evenly gap-8 min-w-0'>
                <PlayerComponent index={1} />
                <PlayerComponent index={2} />
                <PlayerComponent index={3} />
                <PlayerComponent index={4} />
                <PlayerComponent index={5} />
                <PlayerComponent index={6} />
              </div>
            </div>
            <div className='basis-1/4 min-w-0 flex'>
              {data && <DIXITPlayerActions roomData={data} />}
            </div>
          </div>
          <div className='flex-1 min-w-0 flex'>{data && <DIXITPlayArea roomData={data} />}</div>
        </div>
      </div>
      <div className='flex flex-col laptop:hidden mb-8'>
        <div className='flex flex-col justify-center items-center gap-4'>
          <div className='flex justify-evenly gap-4'>
            <PlayerComponent index={1} />
            <PlayerComponent index={2} />
            <PlayerComponent index={3} />
          </div>
          <div className='flex justify-evenly gap-4'>
            <PlayerComponent index={4} />
            <PlayerComponent index={5} />
            <PlayerComponent index={6} />
          </div>
          {data && <DIXITPlayArea roomData={data} />}
          {data && <DIXITPlayerActions roomData={data} />}
        </div>
      </div>
    </>
  )
}

export default DIXITIndex
