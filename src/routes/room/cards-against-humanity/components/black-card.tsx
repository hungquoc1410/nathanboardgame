import React from 'react'
import { onValue, Query } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { setRoomKeyRef } from '../../../../services/firebase'

const BlackCard: React.FC = () => {
  const params = useParams()
  const [black, setBlack] = React.useState<string>()

  let roomCardRef: Query
  if (params.roomId) {
    roomCardRef = setRoomKeyRef(params.roomId, 'currentBlack')
  }

  React.useEffect(() => {
    return onValue(roomCardRef, (snap) => {
      if (snap.exists()) {
        setBlack(snap.val())
      }
    })
  }, [])

  return (
    <>
      {black && (
        <div className='max-h-72 aspect-[492/683]'>
          <img
            className='aspect-[492/683]'
            src={`/games/cards-against-humanity/black-cards/${black}`}
            alt='black-card'
          />
        </div>
      )}
    </>
  )
}

export default BlackCard
