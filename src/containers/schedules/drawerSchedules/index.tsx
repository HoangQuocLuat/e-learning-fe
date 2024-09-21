import React,{ useImperativeHandle, forwardRef, useState } from 'react'
import { DrawerStyle, Title, Wrap } from './styles'
import FormInputSchedules from '../formSchedules'
import { notification } from 'antd'
import { Schedules } from '@models/schedules';
import { schedulesAdd } from '@graphql/mutation/admin/schedules-add'

export type DrawerSchedulesMethods = {
  open: (data?: Schedules) => void
  close: () => void
}

type DrawersSchedulesProps = {
  onSchedulesSucces: () => void
  onSchedulesUpdateSucces: () => void
}

const DrawersSchedules = forwardRef<DrawerSchedulesMethods, DrawersSchedulesProps>(
  ({ onSchedulesSucces, onSchedulesUpdateSucces }, ref) => {
    const [visible, setVisible] = useState(false)
    const [dataSchedules, setDataSchedules] = useState<Schedules>()

    useImperativeHandle(ref, () => ({
      open: (data?: Schedules) => {
        setVisible(true)
        setDataSchedules(data)
      },
      close: () => onClose(),
    }))

    const onClose = () => {
      setVisible(false)
    }

    const onAddSchedules = (input: Schedules) => {
      return schedulesAdd({
        input: {
          start_date: input.start_date,
          end_date: input.end_date,
          start_time: input.start_time,
          end_time: input.end_time,
          schedules_type: input.schedules_type,
          description: input.description,
        },
      })
        .then(rSchedules => {
          if (rSchedules.success) {
            notification.success({ message: 'Thêm thông tin lịch thành công' })
            onSchedulesSucces()
            onClose()
          }
          if (!rSchedules.success) {
            console.log(input)
            notification.error({ message: 'Thêm thông tin lịch không thành công' })
          }
          return Promise.resolve(rSchedules.success ?? false)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    }

    // const onUpdateAccount = (input: Account) => {
    //   return accountUpdate({
    //     input: {
    //       id: input.id,
    //       originalCode: input.originalCode,
    //       internationalCode: input.internationalCode,
    //       destination: input.destination,
    //       status: input.status,
    //     },
    //   })
    //     .then(rEntry => {
    //       if (rEntry.success) {
    //         notification.success({ message: 'Cập nhật thông tin đơn hàng thành công' })
    //         onEntryUpdateSucces()
    //         onClose()
    //       }
    //       if (!rEntry.success) {
    //         notification.error({ message: 'Cập nhật thông tin đơn hàng không thành công' })
    //       }
    //       return Promise.resolve(rEntry.success ?? false)
    //     })
    //     .catch(() => {
    //       return Promise.resolve(false)
    //     })
    // }

    return (
      <DrawerStyle
        title={<Title>{dataSchedules ? 'Thông tin lịch' : 'Thêm thông tin lịch'}</Title>}
        open={visible}
        width={700}
        onClose={onClose}
      >
        <Wrap>
          <FormInputSchedules
            dataSchedules={dataSchedules}
            onAddSchedules={onAddSchedules}
          />
        </Wrap>
      </DrawerStyle>
    )
  },
)

export default DrawersSchedules
