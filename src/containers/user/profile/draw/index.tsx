import { useImperativeHandle, forwardRef, useState } from 'react'
import { DrawerStyle, Title, Wrap } from './style'
import FormInputInfo from '../formPr'
import { notification } from 'antd'
import { Account } from '@models/account'
import { infoUpdate } from '@graphql/mutation/user/info-update'

export type DrawerPrMethods = {
  open: (data?: Account) => void
  close: () => void
}

type DrawPrProps = {
  onAccountUpdateSucces: () => void
}

const DrawPr = forwardRef<DrawerPrMethods, DrawPrProps>(
  ({ onAccountUpdateSucces }, ref) => {
    const [visible, setVisible] = useState(false)
    const [dataAccount, setDataAccount] = useState<Account>()
    console.log("sss", dataAccount)
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

    const onUpdateAccount = (input: Account) => {
      return infoUpdate({
        input: {
          password: input.password,
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
        title={<Title>{dataAccount ? 'Thông tin tài khoản' : 'Cập nhật thông tin tài khoản'}</Title>}
        open={visible}
        width={700}
        onClose={onClose}
      >
        <Wrap>
          <FormInputInfo
            dataAccount={dataAccount}
            onUpdateAccount={onUpdateAccount}
          />
        </Wrap>
      </DrawerStyle>
    )
  },
)

export default DrawPr
