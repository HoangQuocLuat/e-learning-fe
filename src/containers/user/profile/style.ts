import { Button, Table } from 'antd'
import styled from 'styled-components'
import { media_break_points } from '@themes/styled/globalStyle'

export const Wrap = styled.div`
  margin: 2rem;
  padding: 2rem;
`
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${media_break_points.tablet_portrait_only} {
    flex-wrap: wrap;
    gap: 2rem;
  }
  ${media_break_points.phone_only} {
    flex-wrap: wrap;
    gap: 2rem;
  }
`
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`

export const TableBox = styled.div`
  margin-top: 2rem;
`
export const TableData = styled(Table)`
  .ant-table-thead > tr > th {
    color: #3154a0; /* Màu chữ của tiêu đề cột */
    border-radius: unset !important;
    text-align: center;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: bold;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #3154a0; /* Viền của ô */
    text-align: center;
  }
`

export const Buttons = styled(Button)`
  padding: 0.5rem 2rem;
  color: #3154a0;
  border: 1px solid #3154a0;
`
export const BoxAction = styled.div`
  display: flex;
  gap: 9.2rem;
  ${media_break_points.phone_only} {
    gap: 3rem;
  }
`

export const FormInfor = styled.div`
  display: flex
  
`
