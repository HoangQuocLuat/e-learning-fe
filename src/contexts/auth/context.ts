import { Account } from '@models/account'
import React, { useContext } from 'react'

export type AuthContextType = {
  login: boolean
  setLogin: (v: boolean) => void
  user: Account
  setUser: (v: Account) => void
  // currentScopes: ScopeType[]
}

export const AuthContext = React.createContext<AuthContextType>({
  login: false,
  setLogin: () => {},
  user: {} as Account,
  setUser: () => {},
  // currentScopes: [],
})

export const useAuthContext = () => useContext(AuthContext)

export const useCurrentUser = () => {
  const { user } = useContext(AuthContext)

  return user
}
