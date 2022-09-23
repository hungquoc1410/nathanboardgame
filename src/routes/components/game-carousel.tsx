import React from 'react'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css/bundle'
import 'swiper/css'
import 'swiper/css/pagination'

export default function GameCarousel() {
  return (
    <>
      <div className='mobile:block laptop:hidden'>
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={10}
          centeredSlides={true}
          loop={true}
          modules={[Navigation]}
        >
          <SwiperSlide className='h-96 w-2/3'>Slide 1</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 2</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 3</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 4</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 5</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 6</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 7</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 8</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 9</SwiperSlide>
        </Swiper>
      </div>
      <div className='mobile:hidden laptop:block'>
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          navigation={true}
          modules={[Navigation]}
        >
          <SwiperSlide className='h-96 w-2/3'>Slide 1</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 2</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 3</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 4</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 5</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 6</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 7</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 8</SwiperSlide>
          <SwiperSlide className='h-96 w-2/3'>Slide 9</SwiperSlide>
        </Swiper>
      </div>
    </>
  )
}
