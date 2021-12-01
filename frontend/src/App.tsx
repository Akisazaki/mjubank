import React from 'react'
import { Navigate } from 'react-router'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AccountDetailPage } from './pages/AccountDetailPage'
import { AccountPage } from './pages/AccountPage'
import { CardListPage } from './pages/CardListPage'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { AuthWrapper } from './utils/authProvider'


function App() {

  return (
    <div className="wrapper">
      <AuthWrapper>
        <h1>MJU Bank</h1>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Home />} />
            <Route
              path="/profile"
              element={<Profile />} />
            <Route
              path="/accounts/:id"
              element={<AccountDetailPage />} />
            <Route
              path="/accounts"
              element={<AccountPage />} />
            <Route
              path="/cards"
              element={<CardListPage />} />
            <Route
              path="*"
              element={<Navigate replace to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthWrapper>
    </div>
  )
}

export default App;
