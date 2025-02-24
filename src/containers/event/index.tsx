import React, { useCallback, useRef, useState } from 'react'
import { Button, Space, TableProps, notification, Table, Tag } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Buttons, Header, TableBox, Wrap, TableData, BoxAction } from './style'
import { Event } from '@models/event'
import { eventPagination } from '@graphql/query/admin/event-pagination'
import { Pagination } from '@models/pagination'
import { useMounted } from '@hooks/lifecycle'
import { usePushShallowRoute } from '@hooks/router'
import { useParams } from 'react-router-dom'
import ButtonDelete from './button-delete'
import DrawersEvent, { DrawerEventMethods } from './drawerEvent'
// import SearchEvent from './search-event'

type FetchParams = {
  page?: number
  limit?: number
  search?: Record<string, any>
}

export type InputSearch = {
  event_name: string
  location: string
}

const ListEvent: React.FC = () => {
  const drawerRef = useRef<DrawerEventMethods>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [eventData, setEventData] = useState<Event[]>([])
  const [page, setPage] = useState<Pagination>(Pagination.default)
  const onPushShallow = usePushShallowRoute()
  const params = useParams<{ page: string; limit: string }>()
  const paramsRef = useRef(params)

  const fetch = useCallback(({ page, limit, search }: FetchParams) => {
    setLoading(true)
    eventPagination({ page, limit, search })
      .then(rEvent => {
        if (rEvent.success) {
          setLoading(false)
          setEventData(rEvent.data ?? [])
          setPage(rEvent.paging!)
        }
      })
      .catch(() => {
        setLoading(false)
        notification.error({ message: 'Có lỗi xảy ra!' })
      })
  }, [])

  const onSearch = (input: InputSearch) => {
    const { event_name, location } = input
    const searchParams: Record<string, any> = {}
    if (event_name) searchParams.event_name = event_name
    if (location) searchParams.location = location

    onPushShallow({ page: 1, limit: page.limit, ...searchParams })
    fetch({ page: 1, limit: page.limit, search: searchParams })
  }

  useMounted(() => fetch({ page: 1, limit: page.limit }))

  const columns: TableProps<Event>['columns'] = [
    {
      title: 'Tên sự kiện',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Chi tiết sự kiện',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => drawerRef.current?.open(record)}
            style={{ border: 'none' }}
          />
          <ButtonDelete
            record={record}
            fetchEntry={() => fetch({ page: page.current, limit: page.limit })}
          />
        </Space>
      ),
    },
  ]
  

  return (
    <Wrap>
      <Header>
        {/* <SearchEvent onSearch={onSearch} /> */}
        <BoxAction>
          <Buttons icon={<PlusOutlined />} onClick={() => drawerRef.current?.open()}>
            Thêm sự kiện
          </Buttons>
        </BoxAction>
      </Header>
      <TableBox>
        {
          <TableData
            // @ts-ignore
            columns={columns}
            loading={loading}
            rowKey= {record => record?.id ?? ''}
            dataSource={eventData}
            scroll={{ x: 600 }}
            pagination={{
              pageSize: page.limit ?? 10,
              current: page.current > 0 ? page.current : 1,
              total: page.total,
              onChange: (newPage, pageSize) => {
                onPushShallow({ page: newPage, limit: pageSize, ...paramsRef.current })
                fetch({ page: newPage, limit: pageSize })
              },
            }}
          />
        }
        <DrawersEvent
          ref={drawerRef}
          onEventSuccess={() => fetch({ page: 1, limit: page.limit })}
          onEventUpdateSuccess={() =>
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

export default ListEvent
