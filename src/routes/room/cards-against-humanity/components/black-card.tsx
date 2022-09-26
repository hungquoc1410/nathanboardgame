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
