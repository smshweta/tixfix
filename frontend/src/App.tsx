import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import SignIn from './components/signin/signin'
import SignUp from './components/signup/signup'
import Dashboard from './components/dashboard/dashboard'

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
