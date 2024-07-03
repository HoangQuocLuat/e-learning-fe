import { media_break_points } from '@themes/styled/globalStyle'
import { Button, Form, Input } from 'antd'
import { styled } from 'styled-components'

export const HomeStyled = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 2rem;
`

export const Title = styled.p`
  text-align: center;
  ${media_break_points.md} {
    font-size: 3.6rem;
  }

  font-size: 2.4rem;
  font-weight: bold;
  color: #3f98f9;
`
export const SubTitle = styled.p`
  ${media_break_points.xs} {
    font-size: 1.6rem;
  }
  ${media_break_points.xs} {
    font-size: 1.2rem;
  }
  font-weight: bold;
  margin-top: unset;
  color: #3f98f9;
`

export const FormStyled = styled(Form)`
  padding: 2.4rem;
  border-radius: 1rem;
  ${media_break_points.md} {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
`

export const FormItemStyled = styled(Form.Item)`
  width: 380px;
  font-weight: bold;
`

export const InputStyled = styled(Input)`
  width: 380px;
  height: 36px;
`

export const InputPasswordStyled = styled(Input.Password)`
  width: 380px;
  height: 36px;
`

export const ButtonStyled = styled(Button)`
  width: 380px;
  height: 36px;
`

export const Label = styled.span``

export const Helper = styled.span``
