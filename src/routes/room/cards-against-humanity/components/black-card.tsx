import React from 'react'

import { CAHProps } from '..'

const BlackCard: React.FC<CAHProps> = ({ roomData }) => {
  const [black, setBlack] = React.useState<string>()

  React.useEffect(() => {
    setBlack(roomData.currentBlack)
  }, [roomData])

  return (
    <>
      {black && (
        <div className='aspect-[256/360]'>
          <img
            className='aspect-[256/360] h-72 laptopp:h-80'
            src={`/games/cah/black-cards/${black}`}
            alt='black-card'
          />
        </div>
      )}
    </>
  )
}

export default BlackCard
