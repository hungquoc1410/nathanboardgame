import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Index from './routes/index'
import Layout from './routes/layout'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Index />} />
      </Route>
    </Routes>
  )
}

export default App
