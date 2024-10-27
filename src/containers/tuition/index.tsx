import React, { useCallback, useState, useRef } from 'react';
import { Buttons, Wrap, Header, TableBox } from '../accountList/style';
import { Collapse, List, Button, Spin, notification } from 'antd';
import { EditOutlined} from '@ant-design/icons'
import { Tuition } from '@models/tuition';
import { tuitionList } from '@graphql/query/admin/tuition-list';
import DrawersListTuition, { DrawerTuitionMethods } from './drawerListTuition'
import { useMounted } from '@hooks/lifecycle';

type FetchParams = {
    month: string;
    year: string;
};

const TuitionContainer: React.FC = () => {
    const drawerRef = useRef<DrawerTuitionMethods>(null)
    const [loading, setLoading] = useState(false);
    const [tuitionData, setTuitionData] = useState<{ [key: string]: Tuition[] }>({});
    
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = (new Date().getMonth() + 1).toString(); // Lấy tháng hiện tại (tháng từ 0-11)
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

    const fetchTuition =({ month, year }: FetchParams) => {
        setLoading(true);
        tuitionList({ month, year })
            .then((rTuition) => {
                if (rTuition.success) {
                    setTuitionData((prevData) => ({
                        ...prevData,
                        [month]: rTuition.data ?? [],
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
    useMounted(() => fetchTuition({ month: currentMonth, year: currentYear }));

    // Tạo danh sách các Panel cho Collapse
    const items = months.map((month) => ({
        key: month,
        label: `Tháng ${month} - ${currentYear}`,
        children: (
            <List
                dataSource={tuitionData[month] || []}
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

    return (
        <Wrap>
            <Header>
                <h2>Quản lý học phí năm {currentYear}</h2>
            </Header>
            <TableBox>
                {loading ? (
                    <Spin />
                ) : (
                    <Collapse accordion>
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
