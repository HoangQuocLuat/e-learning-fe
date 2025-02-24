import { DeleteOutlined } from '@ant-design/icons'
import { schedulesDelete } from '@graphql/mutation/admin/schedules-delete'
import { Schedules } from '@models/schedules'
import { Button, notification } from 'antd'
import React from 'react'

type ButtonDeleteProps = {
  record?: Schedules
  fetchSchedules?: () => void
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ record, fetchSchedules }) => {
  const handleDeleteSchedules = (id: string | undefined) => {
    if (id) {
      schedulesDelete({ id })
        .then(r => {
          if (r.success) {
            notification.success({ message: 'Xóa lịch thành công ' })
            if (fetchSchedules) {
              fetchSchedules()
            }
          }
          if (!r.success) {
            notification.error({ message: 'Xóa lịch không thành công ' })
          }
        })
        .catch(() => {
          notification.error({ message: 'Xóa lịch không thành công ' })
        })
    }
  }

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={() => handleDeleteSchedules(record?.id)}
      style={{ border: 'none', width: 10, height: 10,}}
    />
  )
}

export default ButtonDelete
