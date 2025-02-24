import { Wrap, TableData, TableBox } from '../../accountList/style';
import { Button, Space, TableProps} from 'antd'
import { Tuition } from '@models/tuition'
import { WalletOutlined } from '@ant-design/icons'
import { useState} from 'react';
import axios from 'axios';
import { getTuition } from '@graphql/query/user/tuition';
import { useMounted } from '@hooks/lifecycle';
import TuitionPaginationByID from './tuition-pagination'

const TuitionContainer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tuitionData, setTuitionData] = useState<Tuition[]>([])
  const currentMonth = (new Date().getMonth()).toString();
  const [transID, setTransID] = useState("")
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
const handlePayment = async (app_user: string, tuition_id: string | undefined) => {
    try {
        const response = await axios.post('http://127.0.0.1:8989/api/v1/payment/order', {
            app_user: app_user,
            tuition_id: tuition_id
        });
        if (response.data.Message === 'Hoc phi da thanh toan') {
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
          render: (_, record) =>
            <Space size="middle">
              <Button
                icon={<WalletOutlined />}
                onClick={() =>{
                  console.log("aaa", record)
                    if (record.user?.id) {
                        handlePayment(record.user?.id, record.id)
                    }
                    else {
                        alert('Không tìm thấy học sinh này.')
                        }
                    }
                }
                style={{ border: 'none' }}
              />
            </Space>
        },
      ]
    return (
        <Wrap>
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
                        title={() => `Thanh toán học phí tháng ${currentMonth }`}
                    />
                }
            </TableBox>
            <TuitionPaginationByID></TuitionPaginationByID>
        </Wrap>
    )
}

export default TuitionContainer