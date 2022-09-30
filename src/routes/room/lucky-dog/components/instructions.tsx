import React from 'react'

import { Stack, Typography } from '@mui/material'

const LDInstructions: React.FC = () => {
  return (
    <Stack spacing={2}>
      <Typography variant='h5' className='text-pink-500'>
        Cách Chơi Lucky Dog
      </Typography>
      <Stack spacing={1}>
        <Typography variant='body1'>Đầu lượt, lắc 5 viên xúc sắc.</Typography>
        <Typography variant='body1'>
          Sau và chỉ sau lượt lắc đầu tiên, bạn được bỏ 1 trong 5 lá bài trên bàn chơi để thay lá
          mới.
        </Typography>
        <Typography variant='body1'>
          Bạn có thể lắc lại (tối đa 2 lần) và bạn có thể lắc bao nhiêu viên xúc sắc đều được.
        </Typography>
        <Typography variant='body1'>
          Nhìn vào 5 lá bài trên bàn chơi và xem bạn có đạt điều kiện để lấy lá bài nào không.
        </Typography>
        <Typography variant='body1'>
          Bất cứ lá bài nào bạn đủ điều kiện thì bạn có thể lấy.
        </Typography>
        <Typography variant='body1'>
          VD: Bạn lắc được 2-3-4-5-5 và trên bàn chơi có 2 lá 3-in-a-row thì bạn có thể lấy cả 2 lá
          đó.
        </Typography>
        <Typography variant='body1'>
          Người đầu tiên đạt được 20 điểm sẽ là người chiến thắng.
        </Typography>
        <Typography variant='body1'>Điểm được tính ở góc phải trên của lá bài.</Typography>
      </Stack>
    </Stack>
  )
}

export default LDInstructions
