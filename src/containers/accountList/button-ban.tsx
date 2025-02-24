import { StopOutlined } from '@ant-design/icons'
import { accountBann } from '@graphql/mutation/admin/account-ban'
import { Account } from '@models/account'
import { Button, notification } from 'antd'
import React from 'react'

type ButtonAccountBanProps = {
  record?: Account
  fetchEntry?: () => void
}

const ButtonBan: React.FC<ButtonAccountBanProps> = ({ record, fetchEntry }) => {
  const handleAccountBan = (id: string | undefined, status: number) => {
    if (id) {
        accountBann({ id, status})
        .then(r => {
            console.log(r)
          if (r.success) {
            notification.success({ message: 'Khóa tài khoản  thành công ' })
            if (fetchEntry) {
              fetchEntry()
            }
          }
          if (!r.success) {
            notification.error({ message: 'Khóa tài khoản không thành công ' })
          }
        })
        .catch(() => {
          notification.error({ message: 'Khóa tài khoản không thành công ' })
        })
        }
    }

  return (
    <Button
      icon={<StopOutlined />}
      onClick={() => handleAccountBan(record?.id, 0)}
      style={{ border: 'none' }}
    />
  )
}

export default ButtonBan
