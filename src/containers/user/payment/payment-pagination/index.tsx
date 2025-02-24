import React, { useCallback, useRef, useState } from 'react'
import { TableProps, notification, Tag } from 'antd'
import { TableBox, TableData, } from '../../../accountList/style'
import { Payment } from '@models/payment'
import { paymentPaginationByID } from '@graphql/query/user/payment-pagination'
import { Pagination } from '@models/pagination'
import { useMounted } from '@hooks/lifecycle'
import { usePushShallowRoute } from '@hooks/router'
import { useParams } from 'react-router-dom'

type FetchParams = {
  page?: number
  limit?: number
  search?: Record<string, any>
}

export type InputSearch = {
  name: string
  phone: string
}

const PaymentPagination: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [paymentData, setPaymentData] = useState<Payment[]>([])
  const [page, setPage] = useState<Pagination>(Pagination.default)
  const onPushShallow = usePushShallowRoute()
  //@ts-ignore
  const params = useParams(['page', 'limit'])
  const paramsRef = useRef(params)

  const fetch = useCallback(({ page, limit, search }: FetchParams) => {
    setLoading(true)
    paymentPaginationByID({ page, limit, search })
      .then(rPayment => {
        if (rPayment.success) {
          setLoading(false)
          setPaymentData(rPayment.data ?? [])
          setPage(rPayment.paging!)
        }
      })
      .catch(() => {
        setLoading(false)
        notification.error({ message: 'Có lỗi xảy ra!' })
      })
  }, [])

  useMounted(() => fetch({ page: 1, limit: page?.limit }))

  const columns: TableProps<Payment>['columns'] = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'transID',
      key: 'transID',
    },
    {
      title: 'Số tiền đã thanh toán',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (dataIndex) => (
        <Tag color={dataIndex === 'Thanh toán thành công' ? 'green' : dataIndex === 'Đang thanh toán' ? 'blue' : 'red'}>
            {dataIndex}
        </Tag>
      ),
    },
    {
        title: 'Ngày thực hiện giao dịch',
        dataIndex: 'date',
        key: 'date',   
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
            dataSource={paymentData}
            scroll={{ x: 600 }}
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

export default PaymentPagination
