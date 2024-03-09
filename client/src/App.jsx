import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { About, Home, Profile, SignIn, SignUp } from './pages';
import './App.css'
import Header from './components/Header';

function App() {

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/profile' element={<Profile />}/>
      </Routes>
    </Router>
  )
}

export default App
