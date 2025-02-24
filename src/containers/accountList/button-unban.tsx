import { PoweroffOutlined } from '@ant-design/icons'
import { accountBann } from '@graphql/mutation/admin/account-ban'
import { Account } from '@models/account'
import { Button, notification } from 'antd'
import React from 'react'

type ButtonAccountUnBanProps = {
  record?: Account
  fetchEntry?: () => void
}

const ButtonUnBan: React.FC<ButtonAccountUnBanProps> = ({ record, fetchEntry }) => {
  const handleAccountBan = (id: string | undefined, status: number) => {
    if (id) {
        accountBann({ id, status})
        .then(r => {
          if (r.success) {
            notification.success({ message: 'Mở khóa tài khoản  thành công ' })
            if (fetchEntry) {
              fetchEntry()
            }
          }
          if (!r.success) {
            notification.error({ message: 'Mở khóa tài khoản không thành công ' })
          }
        })
        .catch(() => {
          notification.error({ message: 'Mở khóa tài khoản không thành công ' })
        })
        }
    }

  return (
    <Button
      icon={<PoweroffOutlined />}
      onClick={() => handleAccountBan(record?.id, 1)}
      style={{ border: 'none' }}
    />
  )
}

export default ButtonUnBan
