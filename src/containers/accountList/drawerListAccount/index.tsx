import { useImperativeHandle, forwardRef, useState } from 'react'
import { DrawerStyle, Title, Wrap } from './style'
import FormInputListAccount from '../formAccountList'
import { notification } from 'antd'
import { Account } from '@models/account'
import { accountAdd } from '@graphql/mutation/admin/account-add'
import { accountUpdate } from '@graphql/mutation/admin/account-update'

export type DrawerListAccountMethods = {
  open: (data?: Account) => void
  close: () => void
}

type DrawersListAccountProps = {
  onAccountSucces: () => void
  onAccountUpdateSucces: () => void
}

const DrawersListAccount = forwardRef<DrawerListAccountMethods, DrawersListAccountProps>(
  ({ onAccountSucces, onAccountUpdateSucces }, ref) => {
    const [visible, setVisible] = useState(false)
    const [dataAccount, setDataAccount] = useState<Account>()

    useImperativeHandle(ref, () => ({
      open: (data?: Account) => {
        setVisible(true)
        setDataAccount(data)
      },
      close: () => onClose(),
    }))

    const onClose = () => {
      setVisible(false)
    }

    const onAddAccount = (input: Account) => {
      return accountAdd({
        input: {
          class_id: input.class_id,
          user_name: input.user_name,
          password: input.password,
          role: input.role,
          name: input.name,
          date_birth: input.date_birth,
          phone: input.phone,
          email: input.email,
          address: input.address,
        },
      })
        .then(rAccount => {
          if (rAccount.success) {
            notification.success({ message: 'Thêm thông tin tài khoản thành công' })
            onAccountSucces()
            onClose()
          }
          if (!rAccount.success) {
            console.log(input)
            notification.error({ message: 'Thêm thông tin tài khoản không thành công' })
          }
          return Promise.resolve(rAccount.success ?? false)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    }

    const onUpdateAccount = (input: Account) => {
      return accountUpdate({
        input: {
          id: input.id,
          class_id: input.class_id,
          user_name: input.user_name,
          password: input.password,
          role: input.role,
          name: input.name,
          date_birth: input.date_birth,
          phone: input.phone,
          email: input.email,
          address: input.address
        },
      })
        .then(rEntry => {
          if (rEntry.success) {
            notification.success({ message: 'Cập nhật thông tin học sinh thành công' })
            onAccountUpdateSucces()
            onClose()
          }
          if (!rEntry.success) {
            notification.error({ message: 'Cập nhật thông tin học sinh không thành công' })
          }
          return Promise.resolve(rEntry.success ?? false)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    }

    return (
      <DrawerStyle
        title={<Title>{dataAccount ? 'Thông tin tài khoản' : 'Thêm thông tin tài khoản'}</Title>}
        open={visible}
        width={700}
        onClose={onClose}
      >
        <Wrap>
          <FormInputListAccount
            dataAccount={dataAccount}
            onAddAccount={onAddAccount}
            onUpdateAccount={onUpdateAccount}
          />
        </Wrap>
      </DrawerStyle>
    )
  },
)

export default DrawersListAccount
