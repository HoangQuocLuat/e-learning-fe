import { useImperativeHandle, forwardRef, useState } from 'react'
import { DrawerStyle, Title, Wrap } from '../../accountList/drawerListAccount/style'
import FormInputTuition from '../formListTuition'
import { notification } from 'antd'
import { Tuition } from '@models/tuition'
import { tuitionUpdate } from '@graphql/mutation/admin/tuition-update'

export type DrawerTuitionMethods = {
  open: (data?: Tuition) => void
  close: () => void
}

type DrawersTuitionProps = {
  onTuitionUpdateSucces: () => void
}

const DrawersTuition = forwardRef<DrawerTuitionMethods, DrawersTuitionProps>(
  ({onTuitionUpdateSucces}, ref) => {
    const [visible, setVisible] = useState(false)
    const [dataTuition, setDataTuition] = useState<Tuition>()

    useImperativeHandle(ref, () => ({
      open: (data?: Tuition) => {
        setVisible(true)
        setDataTuition(data)
      },
      close: () => onClose(),
    }))

    const onClose = () => {
      setVisible(false)
    }

    const onUpdateTuition = (input: Tuition) => {
      return tuitionUpdate({
        input: {
          id: input.id,
          total_fee: input.total_fee,
          discount: input.discount,
          paid_amount: input.paid_amount,
          remaining_fee: input.remaining_fee,
        },
      })
        .then(r => {
          if (r.success) {
            notification.success({ message: 'Cập nhật thông tin học phí thành công' })
            onTuitionUpdateSucces()
            onClose()
          }
          if (!r.success) {
            notification.error({ message: 'Cập nhật thông tin học phí không thành công' })
          }
          return Promise.resolve(r.success ?? false)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    }

    return (
      <DrawerStyle
        title={<Title>{dataTuition ? 'Thông tin học phí' : 'Sửa thông tin học phí'}</Title>}
        open={visible}
        width={700}
        onClose={onClose}
      >
        <Wrap>
          <FormInputTuition
            dataTuition={dataTuition}
            onUpdateTuition= {onUpdateTuition}
          />
        </Wrap>
      </DrawerStyle>
    )
  },
)

export default DrawersTuition
