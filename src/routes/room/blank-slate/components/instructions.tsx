import React from 'react'

import { Grow, Stack, Typography } from '@mui/material'

const BSInstructions: React.FC = () => {
  return (
    <Grow in={true}>
      <Stack spacing={2}>
        <Typography variant='h5' className='text-pink-500'>
          Cách Chơi Black Slate
        </Typography>
        <Stack spacing={1}>
          <Typography variant='h6' className='text-blue-500'>
            1. Mục tiêu
          </Typography>
          <Typography variant='body1'>
            Cố gắng trùng đáp án với một người chơi khác để kiếm điểm qua các thẻ gợi ý:
          </Typography>
          <Typography variant='body1' className='!ml-6'>
            - Nếu 2 người trùng đáp án, mỗi người được 3 điểm.
          </Typography>
          <Typography variant='body1' className='!ml-6'>
            - Nếu trên 2 người trùng đáp án, mỗi người được 1 điểm.
          </Typography>
          <Typography variant='body1' className='!ml-6'>
            - Nếu không trùng đáp án với ai thì sẽ không được điểm.
          </Typography>
          <Typography variant='body1'>Người đầu tiên đạt 25 điểm là người chiến thắng.</Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant='h6' className='text-blue-500'>
            2. Cách chơi
          </Typography>
          <Typography variant='body1'>Mỗi vòng sẽ có 1 thẻ gợi ý. VD: ____ HOUSE</Typography>
          <Typography variant='body1'>
            Mỗi người sẽ nhập đáp án mà họ nghĩ sẽ trùng với người khác.
          </Typography>
          <Typography variant='body1'>Tính điểm dựa trên quy tắc trên.</Typography>
          <Typography variant='body1'>
            Bắt đầu vòng mới cho đến khi có người đạt 25 điểm.
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant='h6' className='text-blue-500'>
            3. Cách điền từ vào thẻ gợi ý
          </Typography>
          <Typography variant='body1'>
            Chỉ có thể điền duy nhất một từ. VD: ____ MOUSE&nbsp;&rarr;&nbsp;
            <i>
              <b>MICKEY</b>
            </i>{' '}
            MOUSE
          </Typography>
          <Typography variant='body1'>
            Không được điền một ký tự. VD: SEA ____&nbsp;&rarr;&nbsp;SEA
            <i>
              <b>T</b>
            </i>
          </Typography>
          <Typography variant='body1'>
            Có thể điền để tạo thành 1 từ ghép hoặc 1 từ đơn mới. VD: DAY ____&nbsp;&rarr;&nbsp;DAY
            <i>
              <b>LIGHT</b>
            </i>{' '}
            &nbsp;hoặc&nbsp; DAY{' '}
            <i>
              <b>TRIP</b>
            </i>
          </Typography>
        </Stack>
        <Typography variant='body1'>
          Luật trên là để tham khảo. Hãy tạo luật mà nhóm bạn thấy phù hợp với nhóm nhất và tận
          hưởng trò chơi nhé!
        </Typography>
      </Stack>
    </Grow>
  )
}

export default BSInstructions
