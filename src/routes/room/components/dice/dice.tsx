import React from 'react'

import './dice.css'

type DiceProps = {
  die: {
    fixed: boolean
    value: number
  }
  index: number
}

const Dice: React.FC<DiceProps> = ({ die, index }) => {
  const { value } = die

  React.useEffect(() => {
    const dice = document.getElementById(`die_${index}`)
    if (dice) {
      dice.dataset.side = value.toString()
      dice.classList.toggle('reRoll')
    }
  }, [die])

  return (
    <>
      {value === 0 ? (
        <img alt='die' src='/games/materials/dice/0.svg' />
      ) : (
        <div
          id={`die_${index}`}
          data-side={value}
          className='dice w-12 h-12 laptop:w-24 laptop:h-24'
        >
          <div className='sides side-1'>
            <span className='dot dot-1'></span>
          </div>
          <div className='sides side-2'>
            <span className='dot dot-1'></span>
            <span className='dot dot-2'></span>
          </div>
          <div className='sides side-3'>
            <span className='dot dot-1'></span>
            <span className='dot dot-2'></span>
            <span className='dot dot-3'></span>
          </div>
          <div className='sides side-4'>
            <span className='dot dot-1'></span>
            <span className='dot dot-2'></span>
            <span className='dot dot-3'></span>
            <span className='dot dot-4'></span>
          </div>
          <div className='sides side-5'>
            <span className='dot dot-1'></span>
            <span className='dot dot-2'></span>
            <span className='dot dot-3'></span>
            <span className='dot dot-4'></span>
            <span className='dot dot-5'></span>
          </div>
          <div className='sides side-6'>
            <span className='dot dot-1'></span>
            <span className='dot dot-2'></span>
            <span className='dot dot-3'></span>
            <span className='dot dot-4'></span>
            <span className='dot dot-5'></span>
            <span className='dot dot-6'></span>
          </div>
        </div>
      )}
    </>
  )
}

export default Dice
