import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './pages/Home.jsx'
import SignUpPage from './pages/SignUp.jsx'
import SignInPage from './pages/SignIn.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Search from './pages/Search.jsx'
import Settings from './pages/Settings.jsx'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
