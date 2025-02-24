import { Input } from 'antd'
import styled from 'styled-components'

export const BoxSearch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`
export const BoxInput = styled.div`
  display: flex;
  gap: 9.8rem;
`
export const Inputs = styled(Input)`
  border: 1px solid #3154a0;
  border-radius: 0.4rem;
  &::placeholder {
    font-weight: bold;
  }
`
