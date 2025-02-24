import React from 'react';
import {useState} from 'react';
import { Card, Col } from 'antd';
import { useMounted } from '@hooks/lifecycle';
import { totalUserOn } from '@graphql/query/admin/total-user-on';
const CardTotalUserOn: React.FC = () => {
  const [data, setData] = useState<number | null>(null)
  const fetch = () => {
    totalUserOn()
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
          <Card title="Tổng số học sinh còn đi học" bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize:'20px'}}>
            {data}
            </div>
          </Card>
        </Col>  
    );
}

export default CardTotalUserOn