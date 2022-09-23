import React from 'react'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { gameInfo } from '../../services/game-information'

import GameContent from './game-content'

import 'swiper/css/bundle'
import 'swiper/css'
import 'swiper/css/pagination'

const GameCarousel: React.FC = () => {
  return (
    <>
      <div className='mobile:block laptop:hidden'>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          centeredSlides={true}
          loop={true}
          modules={[Navigation]}
        >
          {gameInfo.map((game) => {
            return (
              <SwiperSlide key={game.title} className='flex self-center'>
                <GameContent game={game} />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      <div className='mobile:hidden laptop:block'>
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={30}
          centeredSlides={true}
          navigation={true}
          loop={true}
          modules={[Navigation]}
        >
          {gameInfo.map((game) => {
            return (
              <SwiperSlide key={game.title} className='w-2/3 flex self-center'>
                <GameContent game={game} />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </>
  )
}

export default GameCarousel
