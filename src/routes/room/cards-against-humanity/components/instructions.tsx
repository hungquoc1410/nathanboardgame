import React from 'react'

import { Grow, Stack, Typography } from '@mui/material'

const CAHInstructions: React.FC = () => {
  return (
    <Grow in={true}>
      <Stack spacing={2}>
        <Typography variant='h5' className='text-pink-500'>
          Cách Chơi Cards Against Humanity
        </Typography>
        <Stack spacing={1}>
          <Typography variant='body1'>Trò chơi bắt đầu với một người làm giám khảo.</Typography>
          <Typography variant='body1'>
            Giám khảo sẽ chọn 1 lá bài đen có chỗ trống cần điền.
          </Typography>
          <Typography variant='body1'>
            Sau khi đã xác nhận được lá bài thì tất cả người chơi còn lại chọn 1 lá bài từ 10 lá bài
            trắng của mình mà họ nghĩ là phù hợp nhất.
          </Typography>
          <Typography variant='body1'>
            Sau khi tất cả mọi người đã chọn xong. Giám khảo sẽ chọn lá bài trắng mà họ nghĩ là phù
            hợp nhất theo ý của họ.
          </Typography>
          <Typography variant='body1'>Chủ nhân của lá bài trắng đó sẽ nhận được 1 điểm.</Typography>
          <Typography variant='body1'>
            Trò chơi tiếp tục với một người mới làm giám khảo.
          </Typography>
          <Typography variant='body1'>
            Trò chơi kết thúc khi mọi người muốn dừng hoặc một người đạt được một số điểm nào đó
            được nhóm thống nhất trước.
          </Typography>
        </Stack>
      </Stack>
    </Grow>
  )
}

export default CAHInstructions
