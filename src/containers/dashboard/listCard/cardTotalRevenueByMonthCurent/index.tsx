import React from 'react';
import {useState} from 'react';
import { Card, Col } from 'antd';
import { useMounted } from '@hooks/lifecycle';
import { revenueByMonthCurent } from '@graphql/query/admin/total-revenue-by-month-curent';
const CardTotalRevenueByMonthCurent: React.FC = () => {
  const currentMonth = (new Date().getMonth() + 1).toString(); 
  const [data, setData] = useState<number | null>(null)
  const fetch = () => {
    revenueByMonthCurent()
      .then((response) => {
        if (response.success) {
            setData(response?.data);
        } else {
          throw new Error('Failed to fetch schedules');
        }
      })
      .catch(() => {
      })
      .finally(() => {
      });
    }
useMounted(() => fetch())
    return (
        <Col span={6}>
          <Card title={`Doanh thu tháng ${currentMonth}`}  bordered={false} >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize:'20px' }}>
            {data !== null ? data.toLocaleString('vi-VN') : 'Đang tải...'} Vnđ
            </div>
          </Card>
        </Col>  
    );
}

export default CardTotalRevenueByMonthCurent