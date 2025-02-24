import React from 'react';
import {useState} from 'react';
import { Card, Col } from 'antd';
import { useMounted } from '@hooks/lifecycle';
import { totalUser } from '@graphql/query/admin/total-user';
const CardTotalUser: React.FC = () => {
  const [data, setData] = useState<number | null>(null)
  const fetch = () => {
    totalUser()
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
        <Col span={4}>
          <Card title="Tổng số học sinh" bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize:'20px' }}>
            {data}
            </div>
          </Card>
        </Col>  
    );
}

export default CardTotalUser