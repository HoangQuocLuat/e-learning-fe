import React, { useCallback, useRef, useState } from 'react'
import { Button, Space, TableProps, notification } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Buttons, Header, TableBox, Wrap, TableData, BoxAction } from './style'
import { classList } from '@graphql/query/admin/class-list'
import { useMounted } from '@hooks/lifecycle'
import ButtonDelete from './button-delete'
import DrawersListClass, { DrawerListClassMethods } from './drawerListClass'
import { Class } from '@models/class'

export type InputSearch = {
  class_name: string
}

const ListClass: React.FC = () => {
  const drawerRef = useRef<DrawerListClassMethods>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [classData, setClassData] = useState<Class[]>([])
  const fetchClassList = useCallback(() => {
    setLoading(true)
    classList()
      .then(rClass => {
        if (rClass.success) {
          setLoading(false)
          setClassData(rClass.data ?? [])
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
      title: 'Học phí',
      dataIndex: 'price',
      key: 'price',
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
            fetchClass={fetchClassList}
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
