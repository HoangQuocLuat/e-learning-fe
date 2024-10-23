import React, { useImperativeHandle, forwardRef, useState } from 'react'
import { DrawerStyle1, Title, Wrap } from './styles'
import { notification } from 'antd'

export type DrawerFormMethods = {
  open: (data?: any) => void
  close: () => void
}

type DrawerFormProps = {
  onSuccess: () => void
  onUpdateSuccess?: () => void
  title: string
  onAdd: (input: any) => Promise<boolean>
  FormInputComponent: React.FC<{ data?: any; onAdd: (input: any) => void }>
}

const DrawerForm = forwardRef<DrawerFormMethods, DrawerFormProps>(
  ({ onSuccess, title, onAdd, FormInputComponent }, ref) => {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<any>()

    useImperativeHandle(ref, () => ({
      open: (data?: any) => {
        setVisible(true)
        setData(data)
      },
      close: () => onClose(),
    }))

    const onClose = () => {
      setVisible(false)
    }

    const handleAdd = (input: any) => {
      return onAdd(input)
        .then(success => {
          if (success) {
            notification.success({ message: `${title} thành công` })
            onSuccess()
            onClose()
          } else {
            notification.error({ message: `${title} không thành công` })
          }
          return Promise.resolve(success)
        })
        .catch(() => Promise.resolve(false))
    }

    return (
      <DrawerStyle1 title={<Title>{data ? title : `Thêm ${title}`}</Title>} open={visible} width={700} onClose={onClose}>
        <Wrap>
          <FormInputComponent data={data} onAdd={handleAdd} />
        </Wrap>
      </DrawerStyle1>
    )
  },
)

export default DrawerForm
