import React, { useState } from 'react';
import { Card, Col } from 'antd';
import { useMounted } from '@hooks/lifecycle';
import { revenueByMonth } from '@graphql/query/admin/total-revenue-by-month';

const CardTotalRevenueByMonthCurent: React.FC = () => {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Tháng hiện tại (định dạng 2 chữ số)
  const currentYear = currentDate.getFullYear().toString(); // Năm hiện tại

  const [data, setData] = useState<number | null>(null);

  const fetch = () => {
    revenueByMonth({ month: currentMonth, year: currentYear })
      .then((response) => {
        if (response.success) {
          setData(response.data);
        } else {
          throw new Error('Failed to fetch revenue');
        }
      })
      .catch(() => {
        console.error('Error fetching revenue data');
      });
  };

  useMounted(() => fetch());

  return (
    <Col span={6}>
      <Card title={`Doanh thu tháng ${currentMonth}`} bordered={false}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20px',
          }}
        >
          {data !== null ? data.toLocaleString('vi-VN') : 'Đang tải...'} VND
        </div>
      </Card>
    </Col>
  );
};

export default CardTotalRevenueByMonthCurent;
