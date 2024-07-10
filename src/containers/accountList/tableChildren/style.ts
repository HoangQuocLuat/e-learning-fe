import styled from 'styled-components'
import { Button, Table } from 'antd'

export const TableChildrenn = styled(Table)`
  .ant-table-thead > tr > th {
    color: #171a1f; /* Màu chữ của tiêu đề cột */
    border-radius: unset !important;
    text-align: center;
    font-size: 1.4rem;
    text-transform: uppercase;
    font-weight: bold;
    border-bottom: 1px solid #bdc1ca;
  }

  .ant-table-tbody > tr > td {
    text-align: center;
    border-bottom: none;
  }
`

export const Buttons = styled(Button)`
  padding: 0.5rem 2rem;
  color: #3154a0;
  border: 1px solid #3154a0;
`

export const ButtonBox = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top: 1rem;
  padding-top: 2rem;
`
