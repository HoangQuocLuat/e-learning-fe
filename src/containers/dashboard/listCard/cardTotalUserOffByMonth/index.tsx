import React from 'react';
import {useState} from 'react';
import { Card, Col } from 'antd';
import { useMounted } from '@hooks/lifecycle';
import { userOffByMonth } from '@graphql/query/admin/total-user-off-by-month';
const CardTotalUserOffByMonth: React.FC = () => {
  const currentMonth = (new Date().getMonth() + 1).toString(); 
  const [data, setData] = useState<number | null>(null)
  const fetch = () => {
    userOffByMonth()
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
          <Card title={`Tổng số học sinh nghỉ trong tháng ${currentMonth}`}  bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize:'20px' }}>
            {data}
            </div>
          </Card>
        </Col>  
    );
}

export default CardTotalUserOffByMonth