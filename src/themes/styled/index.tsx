import React from 'react'
import { GlobalStyle } from './global'

type StyledProviderProps = {
  children?: React.ReactNode
}

const StyledProvider: React.FC<StyledProviderProps> = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  )
}

export default StyledProvider
