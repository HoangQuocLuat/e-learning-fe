import React, { useCallback, useRef, useState } from 'react'
import { Button, Space, TableProps, Upload, UploadProps, message, notification, Tag } from 'antd'
import { Buttons, Header, TableBox, Wrap, TableData, BoxAction } from '../accountList/style'
import { Payment } from '@models/payment'
import { paymentPagination } from '@graphql/query/admin/payment-pagination'
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

const ListPayment: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [paymentData, setPaymentData] = useState<Payment[]>([])
  const [page, setPage] = useState<Pagination>(Pagination.default)
  const onPushShallow = usePushShallowRoute()
  //@ts-ignore
  const params = useParams(['page', 'limit'])
  const paramsRef = useRef(params)

  const fetch = useCallback(({ page, limit, search }: FetchParams) => {
    setLoading(true)
    paymentPagination({ page, limit, search })
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
  const onSearch = (input: InputSearch) => {
    const name = input?.name
    const phone = input?.phone
    if (name) {
      onPushShallow({ name })
      fetch({
        page: 1,
        limit: page.limit ?? 10,
        search: { name},
      })
    } else if (phone) {
      onPushShallow({ phone })
      fetch({
        page: 1,
        limit: page.limit ?? 10,
        search: { phone },
      })
    } else {
      onPushShallow({ page: 1, limit: page.limit })
      fetch({
        page: 1,
        limit: page.limit ?? 10,
      })
    }
  }

  useMounted(() => fetch({ page: 1, limit: page?.limit }))

  const columns: TableProps<Payment>['columns'] = [
    {
      title: 'Tên học sinh',
      dataIndex: 'name',
      key: 'name',
    },
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
    <Wrap>
      <Header>
        {/* <SearchPayment onSearch={onSearch}/> */}
      </Header>
      <TableBox>
        {
          //@ts-ignore
          <TableData
            // @ts-ignore
            columns={columns}
            loading={loading}
            rowKey={record => record?.id ?? ''}
            dataSource={paymentData}
            scroll={{ x: 600 }}
            pagination={{
              pageSize: page.limit ?? 10,
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
        }
      </TableBox>
    </Wrap>
  )
}

export default ListPayment
