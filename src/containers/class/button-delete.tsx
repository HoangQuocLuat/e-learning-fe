import { DeleteOutlined } from '@ant-design/icons'
import { classDelete } from '@graphql/mutation/admin/class-delete'
import { Class } from '@models/class'
import { Button, notification } from 'antd'
import React from 'react'

type ButtonDeleteProps = {
  record?: Class
  fetchClass?: () => void
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ record, fetchClass }) => {
  const handleDeleteClass = (id: string | undefined) => {
    if (id) {
      classDelete({ id })
        .then(r => {
          if (r.success) {
            notification.success({ message: 'Xóa thông tin lớp học thành công ' })
            if (fetchClass) {
                fetchClass()
            }
          }
          if (!r.success) {
            notification.error({ message: 'Xóa thông tin lớp học không thành công ' })
          }
        })
        .catch(() => {
          notification.error({ message: 'Xóa thông tin lớp học không thành công ' })
        })
    }
  }

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={() => handleDeleteClass(record?.id)}
      style={{ border: 'none', width: 10, height: 10,}}
    />
  )
}

export default ButtonDelete
