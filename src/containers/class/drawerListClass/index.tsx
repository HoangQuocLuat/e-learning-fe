import { useImperativeHandle, forwardRef, useState } from 'react'
import { DrawerStyle, Title, Wrap } from './style'
import FormInputListClass from '../formClassList'
import { notification } from 'antd'
import { Class } from '@models/class'
import { classAdd } from '@graphql/mutation/admin/class-add'
import { classUpdate } from '@graphql/mutation/admin/class-update'


export type DrawerListClassMethods = {
  open: (data?: Class) => void
  close: () => void
}

type DrawersListClassProps = {
  onClassSucces: () => void
  onClassUpdateSucces: () => void
}

const DrawersListClass = forwardRef<DrawerListClassMethods, DrawersListClassProps>(
  ({ onClassSucces, onClassUpdateSucces }, ref) => {
    const [visible, setVisible] = useState(false)
    const [dataClass, setDataClass] = useState<Class>()

    useImperativeHandle(ref, () => ({
      open: (data?: Class) => {
        setVisible(true)
        setDataClass(data)
      },
      close: () => onClose(),
    }))

    const onClose = () => {
      setVisible(false)
    }

    const onAddClass = (input: Class) => {
      return classAdd({
        input: {
            class_name: input.class_name,
        },
      })
        .then(rClass => {
          if (rClass.success) {
            notification.success({ message: 'Thêm thông tin lớp học thành công' })
            onClassSucces()
            onClose()
          }
          if (!rClass.success) {
            notification.error({ message: 'Thêm thông tin class không thành công' })
          }
          return Promise.resolve(rClass.success ?? false)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    }

    const onUpdateClass = (input: Class) => {
      return classUpdate({
        input: {
          id: input.id,
          class_name: input.class_name
        },
      })
        .then(rClass => {
          if (rClass.success) {
            notification.success({ message: 'Cập nhật thông tin lớp học thành công' })
            onClassUpdateSucces()
            onClose()
          }
          if (!rClass.success) {
            notification.error({ message: 'Cập nhật thông tin lớp học không thành công' })
          }
          return Promise.resolve(rClass.success ?? false)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    }

    return (
      <DrawerStyle
        title={<Title>{dataClass ? 'Thông tin lớp học' : 'Thêm thông tin lớp học'}</Title>}
        open={visible}
        width={700}
        onClose={onClose}
      >
        <Wrap>
          <FormInputListClass
            dataClass={dataClass}
            onAddClass={onAddClass}
            onUpdateClass={onUpdateClass}
          />
        </Wrap>
      </DrawerStyle>
    )
  },
)

export default DrawersListClass
