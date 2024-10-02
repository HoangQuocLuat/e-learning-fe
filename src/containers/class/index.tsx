import React, { useCallback, useRef, useState } from 'react'
import { Button, Space, TableProps, Upload, UploadProps, message, notification, Table } from 'antd'
import { EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Buttons, Header, TableBox, Wrap, TableData, BoxAction } from './style'
import { classList } from '@graphql/query/admin/class-list'
import { Pagination } from '@models/pagination'
import { useMounted } from '@hooks/lifecycle'
import ButtonDelete from '../accountList/button-delete'
import { usePushShallowRoute } from '@hooks/router'
import DrawersListClass, { DrawerListClassMethods } from './drawerListClass'
import { Class } from '@models/class'

export type InputSearch = {
  class_name: string
}

const ListClass: React.FC = () => {
  const drawerRef = useRef<DrawerListClassMethods>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [classData, setClassData] = useState<Class[]>([])
  const [page, setPage] = useState<Pagination>(Pagination.default)
  const onPushShallow = usePushShallowRoute()
 

  const fetchClassList = useCallback(() => {
    setLoading(true)
    classList()
      .then(rClass => {
        if (rClass.success) {
          setLoading(false)
          setClassData(rClass.data ?? [])
          // setPage(rClass.paging!)
        }
      })
      .catch(() => {
        setLoading(false)
        notification.error({ message: 'Có lỗi xảy ra!' })
      })
  }, [])

  useMounted(() => fetchClassList())

  const columns: TableProps<Class>['columns'] = [
    {
      title: 'Tên lớp học',
      dataIndex: 'class_name',
      key: 'class_name',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => drawerRef.current?.open(record)}
            style={{ border: 'none' }}
          />
          <ButtonDelete
            record={record}
          />
        </Space>
      ),
    },
  ]

  return (
    <Wrap>
      <Header>
        <BoxAction>          
          <Buttons icon={<PlusOutlined />} onClick={() => drawerRef.current?.open()}>
            Thêm lớp học
          </Buttons>
        </BoxAction>
      </Header>
      <TableBox>
        {
          //@ts-ignore
          <TableData
            // @ts-ignore
            columns={columns}
            loading={loading}
            dataSource={classData}
            rowKey={record => record?.id ?? ''} 
            scroll={{ x: 600 }}
          />
        }
        <DrawersListClass
          ref={drawerRef}
          onClassSucces={() => fetchClassList()}
          onClassUpdateSucces={()=> fetchClassList()}
        />
      </TableBox>
    </Wrap>
  )
}

export default ListClass
