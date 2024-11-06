import React, { useCallback, useRef, useState } from 'react'
import { TableProps, notification} from 'antd'
import { TableBox, TableData, } from '../../accountList/style'
import { Attendance } from '@models/attendance'
import { attendancePagination } from '@graphql/query/admin/attendance-pagination'
import { Pagination } from '@models/pagination'
import { useMounted } from '@hooks/lifecycle'
import { usePushShallowRoute } from '@hooks/router'
import { useParams } from 'react-router-dom'
import {formatDate} from '../../../commons/datetime/format'

type FetchParams = {
  page?: number
  limit?: number
  search?: Record<string, any>
}

export type InputSearch = {
  name: string
}

const AttenPagination: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([])
  const [page, setPage] = useState<Pagination>(Pagination.default)
  const onPushShallow = usePushShallowRoute()
  //@ts-ignore
  const params = useParams(['page', 'limit'])
  const paramsRef = useRef(params)

  const fetch = useCallback(({ page, limit, search }: FetchParams) => {
    setLoading(true)
    attendancePagination({ page, limit, search })
      .then(r => {
        console.log("aa", r.data)
        if (r.success) {
          setLoading(false)
          setAttendanceData(r.data ?? [])
          setPage(r.paging!)
        }
      })
      .catch(() => {
        setLoading(false)
        notification.error({ message: 'Có lỗi xảy ra!' })
      })
  }, [])
  // const onSearch = (input: InputSearch) => {
  //   const name = input?.name
  //   const phone = input?.phone
  //   if (name) {
  //     onPushShallow({ name })
  //     fetch({
  //       page: 1,
  //       limit: page.limit ?? 10,
  //       search: { name},
  //     })
  //   } else if (phone) {
  //     onPushShallow({ phone })
  //     fetch({
  //       page: 1,
  //       limit: page.limit ?? 10,
  //       search: { phone },
  //     })
  //   } else {
  //     onPushShallow({ page: 1, limit: page.limit })
  //     fetch({
  //       page: 1,
  //       limit: page.limit ?? 10,
  //     })
  //   }
  // }

  useMounted(() => fetch({ page: 1, limit: page?.limit }))

  const columns: TableProps<Attendance>['columns'] = [
    {
      title: 'Tên học sinh',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thời gian vào',
      dataIndex: 'time_check_in',
      key: 'time_check_in',
      render: (time: string) => formatDate(time, 'HH:mm:ss DD/MM/YYYY')
    },
    {
      title: 'Thời gian ra',
      dataIndex: 'time_check_out',
      key: 'time_check_out',
      render: (time: string | null) => time ? formatDate(time, 'HH:mm:ss DD/MM/YYYY') : '0'
    }    
  ]  

  return (
          //@ts-ignore
    <TableBox>
          <TableData
            // @ts-ignore
            columns={columns}
            loading={loading}
            rowKey={record => record?.id ?? ''}
            dataSource={attendanceData}
            scroll={{ x: 600 }}
            title={() => 'Danh sách điểm danh trong tháng'}
            pagination={{
              pageSize: page.limit ?? 12,
              current: page.current > 0 ? page.current : 1,
              total: page.total,
              onChange: (newPage, pageSize) => {
                onPushShallow({
                  ...paramsRef.current,
                  page: newPage,
                  limit: pageSize,
                })
                fetch({
                  page: newPage,
                  limit: pageSize,
                })
              },
            }}
          />
    </TableBox>
        
  )
}

export default AttenPagination
