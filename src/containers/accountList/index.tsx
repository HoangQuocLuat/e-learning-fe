import React, { useCallback, useRef, useState } from 'react'
import { Button, Space, TableProps, Upload, UploadProps, message, notification, Table } from 'antd'
import { EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Buttons, Header, TableBox, Wrap, TableData, BoxAction } from './style'
import { Account } from '@models/account'
import { accountPagination } from '@graphql/query/admin/account-pagination'
import { Pagination } from '@models/pagination'
import { useMounted } from '@hooks/lifecycle'
import { usePushShallowRoute } from '@hooks/router'
import { useParams } from 'react-router-dom'
import ButtonDelete from './button-delete'
import Cookies from 'js-cookie'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import DrawersListAccount, { DrawerListAccountMethods } from './drawerListAccount'
import SearchAccount from './search-account'


type FetchParams = {
  page?: number
  limit?: number
  search?: Record<string, any>
}

export type InputSearch = {
  user_name: string
  phone: string
}

const ListAccount: React.FC = () => {
  const drawerRef = useRef<DrawerListAccountMethods>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [accountData, setAccountData] = useState<Account[]>([])
  const [page, setPage] = useState<Pagination>(Pagination.default)
  const onPushShallow = usePushShallowRoute()
  //@ts-ignore
  const params = useParams(['page', 'limit'])
  const paramsRef = useRef(params)

  const fetch = useCallback(({ page, limit, search }: FetchParams) => {
    setLoading(true)
    accountPagination({ page, limit, search })
      .then(rAccount => {
        if (rAccount.success) {
          setLoading(false)
          setAccountData(rAccount.data ?? [])
          setPage(rAccount.paging!)
        }
      })
      .catch(() => {
        setLoading(false)
        notification.error({ message: 'Có lỗi xảy ra!' })
      })
  }, [])

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.csv',
    // action: apiUploadFileEntry,
    showUploadList: false,
    headers: {
      authorization: `Bearer ${Cookies.get(AUTHEN_TOKEN_KEY)}`,
    },
    beforeUpload: file => {
      const isCSV = file.type === 'text/csv'
      if (!isCSV) {
        notification.error({ message: 'Chỉ chấp nhận file csv' })
      }
      return isCSV || Upload.LIST_IGNORE
    },
    onChange(info) {
      if (info.file.status === 'done') {
        fetch({ page: 1, limit: page?.limit ?? 10 })
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  const onSearch = (input: InputSearch) => {
    const user_name = input?.user_name
    const phone = input?.phone
    if (user_name) {
      onPushShallow({ user_name })
      fetch({
        page: 1,
        limit: page.limit ?? 10,
        search: { user_name},
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

  const columns: TableProps<Account>['columns'] = [
    {
      title: 'Tên học sinh',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'date_birth',
      key: 'date_birth',
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {console.log(record);drawerRef.current?.open(record)}}
            style={{ border: 'none' }}
          />
          <ButtonDelete
            record={record}
            fetchEntry={() =>
              fetch({
                page: page.current,
                limit: page.limit ?? 10,
              })
            }
          />
        </Space>
      ),
    },
  ]
  const expandedRowRender = (record: Account) => {
    return (
      <Table
        columns={[
          { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
          { title: 'Email', dataIndex: 'email', key: 'email' },
          { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        ]}
        dataSource={[
          {
            key: '1',
            phone: record.phone,
            email: record.email,
            address: record.address,
          },
        ]}
        pagination={false}
        showHeader={true} // Hiển thị tiêu đề của cột
      />
    )
  }
  
  

  return (
    <Wrap>
      <Header>
      <Button
            icon={<EditOutlined />}
            onClick={() => {drawerRef.current?.open()}}
            style={{ border: 'none' }}
          />
        <SearchAccount onSearch={onSearch}/>
        <BoxAction>
          <Upload {...uploadProps}>
            <Button
              icon={<UploadOutlined />}
              style={{ color: '#3154A0', border: '1px solid #3154A0' }}
            >
              Import
            </Button>
          </Upload>
          <Buttons icon={<PlusOutlined />} onClick={() => drawerRef.current?.open()}>
            Thêm tài khoản
          </Buttons>
        </BoxAction>
      </Header>
      <TableBox>
        {
          //@ts-ignore
          <TableData
            // @ts-ignore
            columns={columns}
            loading={loading}
            rowKey={record => record?.id ?? ''}
            dataSource={accountData}
            scroll={{ x: 600 }}
            expandable={{ expandedRowRender }}
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
        <DrawersListAccount
          ref={drawerRef}
          onAccountSucces={() => fetch({ page: 1, limit: page.limit ?? 10 })}
          onAccountUpdateSucces={() =>
            fetch({
              page: page.current,
              limit: page.limit,
            })
          }
        />
      </TableBox>
    </Wrap>
  )
}

export default ListAccount
