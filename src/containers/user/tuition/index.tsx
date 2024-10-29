import { Wrap, TableData, TableBox } from '../../accountList/style';
import { Button, Space, TableProps} from 'antd'
import { Tuition } from '@models/tuition'
import { WalletOutlined } from '@ant-design/icons'
import { useState, useEffect} from 'react';
import axios from 'axios';
import { getTuition } from '@graphql/query/user/tuition';
import { useMounted } from '@hooks/lifecycle';
import TuitionPagination from './tuition-pagination'

const TuitionContainer: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [tuitionData, setTuitionData] = useState<Tuition[]>([])
    const currentMonth = (new Date().getMonth() + 1).toString();
    const [transID, setTransID] = useState("")
    const [tuitionID, setTuitionID] = useState("")
    const fetchGpl = () => {
        setLoading(true);
        getTuition()
          .then((response) => {
            if (response.success) {
                const data = Array.isArray(response.data)
        ? response.data
        : response.data ? [response.data] : [];
      setTuitionData(data);
            } else {
              throw new Error('Failed to fetch schedules');
            }
          })
          .catch(() => {
          })
          .finally(() => {
            setLoading(false);
          });
    }
    useMounted(() => fetchGpl())
const handlePayment = async (app_user: string) => {
    try {
        const response = await axios.post('http://127.0.0.1:8989/api/v1/payment/order', {
            app_user: app_user,
        });
        console.log(response.data)
        if (response.data.Status === 'PaymentCompleted') {
            alert(response.data.Message);
        }else if(response.data.Data?.result?.return_code === 1) {
            setTransID(response.data.Data?.result?.trans_id)
            window.open(response.data.Data?.result?.order_url, '_blank'); 
        } else {
            throw new Error('Không có URL chuyển hướng');
        }
    } catch (error) {
        console.error('Lỗi thanh toán:', error);
        alert('Thanh toán thất bại. Vui lòng thử lại.');
    }
};

    const columns: TableProps<Tuition>['columns'] = [
        {
          title: 'Tổng tiền',
          dataIndex: 'total_fee',
          key: 'total_fee',
        },
        {
          title: 'Số tiền cần thanh toán',
          dataIndex: 'discount',
          key: 'discount',
        },
        {
          title: 'Số tiền đã thanh toán',
          dataIndex: 'paid_amount',
          key: 'paid_amount',
        },
        {
          title: 'Số tiền còn lại',
          dataIndex: 'remaining_fee',
          key: 'remaining_fee'
        },
        {
          title: 'Hành động',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button
                icon={<WalletOutlined />}
                onClick={() =>{
                    console.log("re", record)
                    console.log("use", record.user)
                    if (record.user?.id) {
                        handlePayment(record.user?.id)
                    }
                    else {
                        alert('Không tìm thấy học sinh này.')
                        }
                    }
                }
                style={{ border: 'none' }}
              />
            </Space>
          ),
        },
      ]

      const columns2 = [
        {
            title: 'Tháng',
            dataIndex: 'total_fee',
            key: 'total_fee',
          },
        {
          title: 'Tổng tiền',
          dataIndex: 'total_fee',
          key: 'total_fee',
        },
        {
          title: 'Số tiền cần thanh toán',
          dataIndex: 'discount',
          key: 'discount',
        },
        {
          title: 'Số tiền đã thanh toán',
          dataIndex: 'remaining_fee',
          key: 'remaining_fee',
        },
        {
          title: 'Số tiền còn lại',
          dataIndex: 'paid_amount',
          key: 'paid_amount',
        },
        {
          title: 'Hành động',
          key: 'action',
          render: () => (
            <Space size="middle">
              <Button
                icon={<WalletOutlined />}
                onClick={() => {console.log(), alert("Bạn muốn thanh toán ??",)}}
                style={{ border: 'none' }}
              />
            </Space>
          ),
        },
      ]
    return (
        <Wrap>
            {/* 2 phần chính 
            1. bảng thanh toán học phí
            2. bảng tổng hợp học phi */}

            {/* 1. bảng thanh toán học phí */}
            <TableBox>
                {
                    //@ts-ignore
                    <TableData
                        // @ts-ignore
                        columns={columns}
                        loading={loading}
                        rowKey={record => record?.id ?? ''}
                        dataSource={tuitionData}
                        scroll={{ x: 600 }}
                        pagination= {false}
                        title={() => `Thanh toán học phí tháng ${currentMonth}`}
                    />
                }
            </TableBox>
            <TuitionPagination></TuitionPagination>
        </Wrap>
    )
}

export default TuitionContainer