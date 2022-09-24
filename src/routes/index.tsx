import React from 'react'

import { Box, Paper, Tab, Tabs } from '@mui/material'

import GameCarousel from '../components/game-carousel'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const Index: React.FC = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box className='w-full flex justify-center'>
      <Box className='w-4/5 mt-10'>
        <Paper elevation={3}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label='Create Room' {...a11yProps(0)} />
            <Tab label='Join Room' {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <GameCarousel />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  )
}

export default Index
