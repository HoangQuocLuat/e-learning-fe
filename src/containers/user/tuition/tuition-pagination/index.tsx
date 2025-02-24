import React, { useCallback, useRef, useState } from 'react'
import { TableProps, notification, Button, Space, } from 'antd'
import { WalletOutlined } from '@ant-design/icons'
import { TableBox, TableData, } from '../../../accountList/style'
import { Tuition } from '@models/tuition'
import { tuitionPaginationByUserID } from '@graphql/query/user/tuition-pagination-by-user-id'
import { Pagination } from '@models/pagination'
import { useMounted } from '@hooks/lifecycle'
import { usePushShallowRoute } from '@hooks/router'
import { useParams } from 'react-router-dom'
import axios from 'axios';

type FetchParams = {
  page?: number
  limit?: number
  search?: Record<string, any>
}

export type InputSearch = {
  name: string
  phone: string
}

const TuitionPaginationByID: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [tuitionData, setTuitionData] = useState<Tuition[]>([])
  const [transID, setTransID] = useState("")
  const [page, setPage] = useState<Pagination>(Pagination.default)
  const onPushShallow = usePushShallowRoute()
  //@ts-ignore
  const params = useParams(['page', 'limit'])
  const paramsRef = useRef(params)

  const fetch = useCallback(({ page, limit, search }: FetchParams) => {
    setLoading(true)
    tuitionPaginationByUserID({ page, limit, search })
      .then(r => {
        if (r.success) {
          setLoading(false)
          setTuitionData(r.data ?? [])
          setPage(r.paging!)
        }
      })
      .catch(() => {
        setLoading(false)
        notification.error({ message: 'Có lỗi xảy ra!' })
      })
  }, [])

  useMounted(() => fetch({ page: 1, limit: page?.limit }))

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
      title: 'Học kỳ',
      dataIndex: 'month',
      key: 'month',
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
      ),
    },
  ]  

  return (
          //@ts-ignore
    <TableBox>
          <TableData
            // @ts-ignore
            columns={columns}
            loading={loading}
            rowKey={record => record?.id ?? ''}
            dataSource={tuitionData}
            scroll={{ x: 600 }}
            title={() => 'Tiền học qua các tháng'}
            pagination={{
              pageSize: page.limit ?? 12,
              current: page.current > 0 ? page.current : 1,
              total: page.total,
              onChange: (newPage, pageSize) => {
                onPushShallow({
                  ...paramsRef.current,
                  page: newPage,
                  limit: pageSize,
                })
                fetch({
                  page: newPage,
                  limit: pageSize,
                })
              },
            }}
          />
    </TableBox>
        
  )
}

export default TuitionPaginationByID
