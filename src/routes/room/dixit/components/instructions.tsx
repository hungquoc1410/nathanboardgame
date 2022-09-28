import React from 'react'

import { Stack, Typography } from '@mui/material'

const DIXITInstructions: React.FC = () => {
  return (
    <Stack spacing={2}>
      <Typography variant='h5' className='text-pink-500'>
        Cách Chơi Dixit
      </Typography>
      <Stack spacing={1}>
        <Typography variant='body1'>
          Một người chơi sẽ là người kể chuyện trong một lượt.
        </Typography>
        <Typography variant='body1'>
          Người này sẽ dựa trên 6 thẻ bài trên tay mình, chọn 1 lá và nói ra 1 câu hoặc 1 từ cho tất
          cả người chơi còn lại nghe &#40;không cho họ nhìn thấy lá bài đã chọn&#41;.
        </Typography>
        <Typography variant='body1'>
          Sau đó mỗi người chơi chọn 1 lá bài từ 6 lá của riêng họ mà họ thấy là hợp với câu hoặc từ
          mà người kể chuyện đã nói.
        </Typography>
        <Typography variant='body1'>
          Đưa lá đó cho người kể chuyện &#40;không cho ai xem, ngay cả người kể chuyện cũng không
          được&#41;.
        </Typography>
        <Typography variant='body1'>
          Người kể chuyện xáo bài và lật lên hết tất cả các lá bài.
        </Typography>
        <Typography variant='body1'>
          Tất cả người chơi &#40;trừ người kể chuyện&#41; lần lượt chọn lá bài mà họ nghĩ là của
          người kể chuyện.
        </Typography>
        <Typography variant='body1'>Không được chọn lá của chính mình.</Typography>
        <Typography variant='body1'>
          Nếu không ai &#40;hoặc tất cả mọi người&#41; chọn trúng lá của người kể chuyện.
        </Typography>
        <Typography variant='body1'>
          Người kể chuyện sẽ không có điểm và tất cả người chơi còn lại được 2 điểm mỗi người.
        </Typography>
        <Typography variant='body1'>
          Ngược lại, người kể chuyện và những người tìm được lá bài của người kể chuyện sẽ được 3
          điểm mỗi người.
        </Typography>
        <Typography variant='body1'>
          Ngoài ra, người chơi sẽ được 1 điểm cho từng phiếu bầu của người khác cho lá của họ.
        </Typography>
        <Typography variant='body1'>
          Trò chơi kết thúc khi có người đạt 30 điểm hoặc người nhiều điểm nhất.
        </Typography>
      </Stack>
    </Stack>
  )
}

export default DIXITInstructions
