import React, { useState, useRef } from 'react';
import { Wrap, Header, TableBox, TableData } from '../accountList/style';
import { Collapse, Button, Spin, notification, TableProps } from 'antd';
import { EditOutlined} from '@ant-design/icons'
import { Tuition } from '@models/tuition';
import { tuitionList } from '@graphql/query/admin/tuition-list';
import DrawersListTuition, { DrawerTuitionMethods } from './drawerListTuition'

type FetchParams = {
    month: string;
    year: string;
};


const TuitionContainer: React.FC = () => {
    const drawerRef = useRef<DrawerTuitionMethods>(null)
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string>('2024');
    const [tuitionData, setTuitionData] = useState<{ [key: string]: Tuition[] }>({});
    
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = (new Date().getMonth() + 1).toString(); // Lấy tháng hiện tại (tháng từ 0-11)
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

    const fetchTuition =({ month, year }: FetchParams) => {
        console.log(month)
        setLoading(true);
        tuitionList({ month, year })
            .then((rTuition) => {
                if (rTuition.success) {
                    setTuitionData((prevData) => ({
                        ...prevData,
                        [`${month}`]: rTuition.data ?? [],
                    }));
                }
            })
            .catch(() => {
                notification.error({ message: 'Có lỗi xảy ra!' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

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

    // Mặc định sẽ load theo tháng hiện tại
    // useMounted(() => fetchTuition({ month: currentMonth, year: currentYear }));
    const handleCollapseChange = (activeKey: string | string[]) => {
            const month = activeKey.toString().padStart(2, '0');
            const year = selectedYear
            tuitionList({ month, year})
            .then((rTuition) => {
                if (rTuition.success) {
                    setTuitionData((prevData) => ({
                        ...prevData,
                        [`${month}`]: rTuition.data ?? [],
                    }));
                }
            })
            .catch(() => {
                notification.error({ message: 'Có lỗi xảy ra!' });
            })
            .finally(() => {
                setLoading(false);
            });
    };
    
    // Tạo danh sách các Panel cho Collapse
    const items = months.map((month) => ({
        key: month,
        label: `Tháng ${month}`,
        children: (
            <TableData
                columns={columns}
                rowKey={(record) => record?.id ?? `${month}-${Math.random()}`} // Dùng id hoặc fallback
                dataSource={tuitionData[month.padStart(2, '0')] || []} // Dữ liệu của tháng hiện tại
                pagination={false} // Không phân trang nếu không cần
            />
        ),
    }));
    

    const handleChangeMonth = (e: any) => {
        setSelectedYear(e.target.value)
        fetchTuition({
            month: currentMonth,
            year: selectedYear,
        });
    }    

    return (
        <Wrap>
            <Header>
                <h2>Quản lý học phí năm {selectedYear}</h2>
                <select
                    id="yearSelect"
                    value={selectedYear}
                    onChange={handleChangeMonth}
                >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
            </Header>
            <TableBox>
                {loading ? (
                    <Spin />
                ) : (
                    <Collapse accordion  onChange={handleCollapseChange} >
                        {items.map(item => (
                            <Collapse.Panel key={item.key} header={item.label}>
                                {item.children}
                            </Collapse.Panel>
                        ))}
                    </Collapse>
                )}
                <DrawersListTuition
                 ref={drawerRef}
                 onTuitionUpdateSucces={() =>
                    fetchTuition({
                      month:currentMonth,
                      year:currentYear,
                    })
                  }
                />
            </TableBox>
        </Wrap>
    );
};

export default TuitionContainer;
