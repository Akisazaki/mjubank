import axios from "axios"
import { createContext, ReactNode, useState } from "react"
import { Navigate } from 'react-router'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Customer } from "../model/entity/customer"
import { SignInPage } from "../pages/SignInPage"
import { SignUpPage } from "../pages/SignUpPage"

export interface AuthState {
  user?: Customer
  onUpdate: (user: Customer) => void
  signOut: () => void
}


interface AuthProviderProps {
  children?: ReactNode | undefined
}


export const AuthContext = createContext<AuthState>({
  user: undefined,
  onUpdate: () => { },
  signOut: () => { }
})

export const AuthProvider = AuthContext.Provider
export const AuthConsumer = AuthContext.Consumer

export const AuthWrapper = (props: AuthProviderProps) => {
  const [user, setUser] = useState<Customer | undefined>(undefined)

  const onSignIn = (user: Customer) => {
    axios.defaults.headers.common['x-access-token'] = user.accessToken
    setUser(user)
  }

  const onSignOut = () => {
    delete axios.defaults.headers.common['x-access-token']
    setUser(undefined)
  }

  if (user) {
    return (
      <AuthContext.Provider value={
        {
          user: user,
          onUpdate: setUser,
          signOut: onSignOut
        }
      }>
        { props.children}
      </AuthContext.Provider >
    )
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path='/sign-in'
            element={<SignInPage onSignIn={onSignIn} />} />
          <Route
            path='/sign-up'
            element={<SignUpPage onSignUp={onSignIn} />} />
          <Route
            path="*"
            element={<Navigate replace to="/sign-in" />}
          />
        </Routes>
      </BrowserRouter>
    )
  }
}
