import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Wrap, Header, TableBox, TableData } from '../accountList/style';
import { Collapse, Button, Spin, notification, TableProps, Input, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Tuition } from '@models/tuition';
import { tuitionPaginationByMonth } from '@graphql/query/admin/tuition-pagination';
import DrawersListTuition, { DrawerTuitionMethods } from './drawerListTuition';
import { Pagination } from '@models/pagination';

type FetchParams = {
  month: string;
  year: string;
  search?: string;
};

export const TuitionContainer: React.FC = () => {
  const drawerRef = useRef<DrawerTuitionMethods>(null);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [tuitionData, setTuitionData] = useState<{ [key: string]: Tuition[] }>({});
  const [openedMonth, setOpenedMonth] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const handleChangeMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);  // Cập nhật năm học khi người dùng chọn
  };

  const fetchTuition = useCallback(({ month, year, search }: FetchParams) => {
    const formattedMonth = month.padStart(2, '0');
    setLoading(true);
    tuitionPaginationByMonth({
      month: formattedMonth,
      year,
      page: 1,
      limit: 5,
      search: search ? { remaining_fee: search } : undefined,
    })
      .then((rTuition) => {
        if (rTuition.success) {
          setTuitionData((prevData) => ({
            ...prevData,
            [`${formattedMonth}`]: rTuition.data ?? [],
          }));
        }
      })
      .catch(() => {
        notification.error({ message: 'Có lỗi xảy ra!' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columns: TableProps<Record<string, any>>['columns'] = [
    {
      title: 'Học sinh',
      dataIndex: ['user', 'name'],
      key: 'name',
    },
    {
      title: 'Tổng học phí',
      dataIndex: 'total_fee',
      key: 'total_fee',
    },
    {
      title: 'Số tiền sau khi giảm',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Số tiền đã trả',
      dataIndex: 'paid_amount',
      key: 'paid_amount',
    },
    {
      title: 'Dư nợ',
      dataIndex: 'remaining_fee',
      key: 'remaining_fee',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => drawerRef.current?.open(record)}
          style={{ border: 'none' }}
        />
      ),
    },
  ];

  const handleCollapseChange = (activeKey: string | string[]) => {
    const month = activeKey.toString().padStart(2, '0');
    const year = selectedYear;
    setOpenedMonth(month);
    fetchTuition({ month, year, search });
  };

  const onSearch = (value: string) => {
    setSearch(value);  // Update the search state
  };

  useEffect(() => {
    if (openedMonth) {
      fetchTuition({ month: openedMonth, year: selectedYear, search });  // Trigger fetch when year or search changes
    }
  }, [selectedYear, search, openedMonth, fetchTuition]);

  const items = months.map((month) => ({
    key: month.padStart(2, '0'),
    label: `Tháng ${month.padStart(2, '0')}`,
    children: (
      <TableData
        columns={columns}
        rowKey={(record) => record?.id ?? `${month.padStart(2, '0')}-${Math.random()}`}
        dataSource={tuitionData[month.padStart(2, '0')] || []}
        pagination={{
          pageSize: 5,
          onChange: (page) => {
            fetchTuition({ month, year: selectedYear, search });
          },
        }}
      />
    ),
  }));

  return (
    <Wrap>
      <h2>Quản lý học phí năm {selectedYear}</h2>
      <Header>
        <Space>
          <label>Lọc năm: </label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={handleChangeMonth}
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              color: '#333',
              width: '150px',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <label>Lọc học phí: </label>
          <select
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Trigger search change
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              color: '#333',
              width: '200px',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <option value=""></option>
            <option value="1">Thiếu học phí</option>
          </select>
        </Space>
      </Header>
      <TableBox>
        <Collapse
          activeKey={openedMonth}
          onChange={handleCollapseChange}
          accordion
        >
          {items.map((item) => (
            <Collapse.Panel key={item.key} header={item.label}>
              {item.children}
            </Collapse.Panel>
          ))}
        </Collapse>
      </TableBox>
      <DrawersListTuition
        ref={drawerRef}
        onTuitionUpdateSucces={() => fetchTuition({ month: openedMonth, year: selectedYear, search })}
      />
    </Wrap>
  );
};

export default TuitionContainer;
