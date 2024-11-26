import React from 'react'
import { Row } from 'antd'
import CardTotalUser from './cardTotalUser'
import CardTotalUserOn from './cardTotalUserOn'
import CardTotalUserOffByMonth from './cardTotalUserOffByMonth'
import CardTotalRevenueByMonthCurent from './cardTotalRevenueByMonthCurent'
import { Wrap } from '../../accountList/style'
const ListCard: React.FC = () => {
  return (
    <Wrap>
      <Row gutter={18}>
        <CardTotalUser />
        <CardTotalUserOn />
        <CardTotalUserOffByMonth />
        <CardTotalRevenueByMonthCurent />
      </Row>
    </Wrap>
  )
}

export default ListCard
