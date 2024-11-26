import { DeleteOutlined } from '@ant-design/icons'
import { eventDelete } from '@graphql/mutation/admin/event-delete'
import { Event } from '@models/event'
import { Button, notification } from 'antd'
import React from 'react'

type ButtonDeleteProps = {
  record?: Event
  fetchEntry?: () => void
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ record, fetchEntry }) => {
  const handleDeleteEvent = (id: string | undefined) => {
    if (id) {
      eventDelete({ id })
        .then(r => {
          if (r.success) {
            notification.success({ message: 'Xóa sự kiện thành công' })
            if (fetchEntry) {
              fetchEntry()
            }
          } else {
            notification.error({ message: 'Xóa sự kiện không thành công' })
          }
        })
        .catch(() => {
          notification.error({ message: 'Có lỗi xảy ra khi xóa sự kiện' })
        })
    }
  }

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={() => handleDeleteEvent(record?.id)}
      style={{ border: 'none' }}
    />
  )
}

export default ButtonDelete
