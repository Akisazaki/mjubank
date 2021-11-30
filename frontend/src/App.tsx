import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { MyPage } from './pages/MyPage'
import { SignInPage } from './pages/SignInPage'

function App() {
  return (
    <div className="wrapper">
      <h1>MJU Bank</h1>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home />} />
          <Route
            path="/my"
            element={<MyPage />} />
          <Route
            path='/login'
            element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
