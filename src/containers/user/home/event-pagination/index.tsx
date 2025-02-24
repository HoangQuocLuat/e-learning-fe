import React, { useCallback, useState, useRef } from 'react'
import { notification, List, Modal } from 'antd'
import { eventPagination } from '@graphql/query/user/event-pagination'
import { Pagination } from '@models/pagination'
import { useMounted } from '@hooks/lifecycle'
import { Event } from '@models/event'
import styled from 'styled-components'
import { flash } from 'react-animations'
import { keyframes } from 'styled-components'
import { Wrap, Header } from '../../../accountList/style'
import { usePushShallowRoute } from '@hooks/router'
import { useParams } from 'react-router-dom'

type FetchParams = {
  page?: number
  limit?: number
  search?: Record<string, any>
}

const FlashAnimation = keyframes`${flash}`
const FlashingIcon = styled.div`
  display: inline-block;
  font-size: 10px;
  font-weight: bold;
  color: #ff0000;
  text-transform: uppercase;
  animation: 1s ${FlashAnimation} infinite; // Tạo hoạt hình nhấp nháy liên tục
`

const EventPagination: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [eventData, setEventData] = useState<Event[]>([])
  const [page, setPage] = useState<Pagination>(Pagination.default)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null) // Để lưu sự kiện được chọn
  const onPushShallow = usePushShallowRoute()
  const params = useParams<{ page: string; limit: string }>()
  const paramsRef = useRef(params)

  const fetch = useCallback(({ page, limit, search }: FetchParams) => {
    setLoading(true)
    eventPagination({ page, limit, search })
      .then(r => {
        if (r.success) {
          setLoading(false)
          setEventData(r.data ?? []) 
          setPage(r.paging!)
        }
      })
      .catch(() => {
        setLoading(false)
        notification.error({ message: 'Có lỗi xảy ra!' })
      })
  }, [])

  useMounted(() => fetch({ page: 1, limit: 3 })) 

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleModalClose = () => {
    setSelectedEvent(null)
  }

  return (
    <Wrap>
      <Header style={{ display: 'flex', justifyContent: 'center' }}>
        <h2>Bảng thông báo</h2>
      </Header>
      <List
        pagination={{
          pageSize: 3, 
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
        loading={loading}
        dataSource={eventData}
        renderItem={item => (
          <List.Item onClick={() => handleEventClick(item)} style={{ cursor: 'pointer' }}>
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{item.title}</span>
                  <FlashingIcon style={{ marginLeft: '8px' }}>New</FlashingIcon>
                </div>
              }
              description={`Ngày đăng: ${item.date}`}
            />
          </List.Item>
        )}
      />
      
      <Modal
        title="Chi tiết sự kiện"
        open={!!selectedEvent} 
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedEvent && (
          <div>
            <p>{selectedEvent.description}</p>
          </div>
        )}
      </Modal>
    </Wrap>
  )
}

export default EventPagination
