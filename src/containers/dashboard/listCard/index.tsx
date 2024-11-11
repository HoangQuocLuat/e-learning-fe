import React from 'react';
import { Row } from 'antd';
import CardTotalUser from './cardTotalUser'
import CardTotalUserOn from './cardTotalUserOn'
import CardTotalUserOffByMonth from './cardTotalUserOffByMonth'
import CardTotalRevenueByMonthCurent from './cardTotalRevenueByMonthCurent'
const ListCard: React.FC = () => {
    return (
        <Row gutter={18}>
          <CardTotalUser/>
          <CardTotalUserOn/>
          <CardTotalUserOffByMonth />
          <CardTotalRevenueByMonthCurent />
      </Row>
    );
}

export default ListCard