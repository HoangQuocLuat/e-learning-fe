import React, { useState, useRef } from 'react';
import { Wrap, Header, TableBox } from '../accountList/style';
import { Collapse, List, Button, Spin, notification } from 'antd';
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
            <List
                dataSource={tuitionData[month.padStart(2, '0')] || []}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <p>Học sinh: {item.user?.name}</p>
                        <p>Tổng học phí: {item.total_fee}</p>
                        <p>Số tiền sau khi giảm: {item.discount}</p>
                        <p>Số tiền đã trả: {item.paid_amount}</p>
                        <p>Dư nợ: {item.remaining_fee}</p>  
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => {drawerRef.current?.open(item)}}
                            style={{ border: 'none' }}
                        />
                    </List.Item>
                )}
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
