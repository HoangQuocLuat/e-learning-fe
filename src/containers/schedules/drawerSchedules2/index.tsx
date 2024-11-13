import { useImperativeHandle, forwardRef, useState } from 'react'
import { DrawerStyle, Title, Wrap } from '../drawerSchedules/styles'
import FormInputSchedules2 from '../formSchedules2'
import { notification } from 'antd'
import { Schedules } from '@models/schedules';
import { schedulesAdd2 } from '@graphql/mutation/admin/schedules-add2'

export type DrawerSchedulesMethods2 = {
  open: (data?: Schedules) => void
  close: () => void
}

type DrawersSchedulesProps2 = {
  onSchedulesSucces2: () => void
}

const DrawersSchedules2 = forwardRef<DrawerSchedulesMethods2, DrawersSchedulesProps2>(
  ({ onSchedulesSucces2 }, ref) => {
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
      return schedulesAdd2({
        input: {
          day: input.day,
          start_time: input.start_time,
          end_time: input.end_time,
          schedules_type: input.schedules_type,
          description: input.description,
          class_id: input.class_id,
        },
      })
        .then(rSchedules => {
          if (rSchedules.success) {
            notification.success({ message: 'Thêm thông tin lịch thành công' })
            onSchedulesSucces2()
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

    return (
      <DrawerStyle
        title={<Title>{'Thêm thông tin lịch bổ sung'}</Title>}
        open={visible}
        width={700}
        onClose={onClose}
      >
        <Wrap>
          <FormInputSchedules2
            dataSchedules={dataSchedules}
            onAddSchedules={onAddSchedules}
          />
        </Wrap>
      </DrawerStyle>
    )
  },
)

export default DrawersSchedules2