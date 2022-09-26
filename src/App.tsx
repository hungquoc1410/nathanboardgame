import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from './routes/layout'
import RoomIndex from './routes/room'
import BLIndex from './routes/room/blank-slate'
import BLLayout from './routes/room/blank-slate/layout'
import CAHIndex from './routes/room/cards-against-humanity'
import CAHLayout from './routes/room/cards-against-humanity/layout'
import RoomLayout from './routes/room/layout'
import Index from './routes'

import './App.css'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Index />} />
        <Route path=':roomId' element={<RoomLayout />}>
          <Route index element={<RoomIndex />} />
          <Route path='bs' element={<BLLayout />}>
            <Route index element={<BLIndex />} />
          </Route>
          <Route path='cah' element={<CAHLayout />}>
            <Route index element={<CAHIndex />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
