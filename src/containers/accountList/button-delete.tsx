import { DeleteOutlined } from '@ant-design/icons'
import { accountDelete } from '@graphql/mutation/admin/account-delete'
import { Account } from '@models/account'
import { Button, notification } from 'antd'
import React from 'react'

type ButtonDeleteProps = {
  record?: Account
  fetchEntry?: () => void
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ record, fetchEntry }) => {
  const handleDeleteAccount = (id: string | undefined) => {
    if (id) {
      accountDelete({ id })
        .then(r => {
          if (r.success) {
            notification.success({ message: 'Xóa tài khoản thành công ' })
            if (fetchEntry) {
              fetchEntry()
            }
          }
          if (!r.success) {
            notification.error({ message: 'Xóa tài khoản không thành công ' })
          }
        })
        .catch(() => {
          notification.error({ message: 'Xóa tài khoản không thành công ' })
        })
    }
  }

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={() => handleDeleteAccount(record?.id)}
      style={{ border: 'none' }}
    />
  )
}

export default ButtonDelete
