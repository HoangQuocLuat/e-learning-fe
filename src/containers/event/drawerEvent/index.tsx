import { useImperativeHandle, forwardRef, useState } from 'react'
import { DrawerStyle, Title, Wrap } from './style'
import FormInputListAccount from '../formAccountList'
import { notification } from 'antd'
import { Event } from '@models/event'
import { accountAdd } from '@graphql/mutation/admin/account-add'
import { accountUpdate } from '@graphql/mutation/admin/account-update'

export type DrawerEventMethods = {
  open: (data?: Event) => void
  close: () => void
}

type DrawersEventProps = {
  onEventSucces: () => void
  onEventUpdateSucces: () => void
}

const DrawersListAccount = forwardRef<DrawerEventMethods, DrawersEventProps>(
  ({ onEventSucces, onEventUpdateSucces }, ref) => {
    const [visible, setVisible] = useState(false)
    const [dataEvent, setDataEvent] = useState<Event>()

    useImperativeHandle(ref, () => ({
      open: (data?: Event) => {
        setVisible(true)
        setDataEvent(data)
      },
      close: () => onClose(),
    }))

    const onClose = () => {
      setVisible(false)
    }

    const onAddEvent = (input: Event) => {
      return EventAdd({
        input: {
          title: input.title,
          description: input.description,
          images: input.images,
          docurl: input.docurl,
        },
      })
        .then(r => {
          if (r.success) {
            notification.success({ message: 'Thêm thông tin sự kiện thành công' })
            onAddEventSucces()
            onClose()
          }
          if (!r.success) {
            console.log(input)
            notification.error({ message: 'Thêm thông tin sự kiện không thành công' })
          }
          return Promise.resolve(r.success ?? false)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    }

    const onUpdateAccount = (input: Event) => {
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
            notification.success({ message: 'Cập nhật thông tin đơn hàng thành công' })
            onEntryUpdateSucces()
            onClose()
          }
          if (!rEntry.success) {
            notification.error({ message: 'Cập nhật thông tin đơn hàng không thành công' })
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
          />
        </Wrap>
      </DrawerStyle>
    )
  },
)

export default DrawersListAccount
