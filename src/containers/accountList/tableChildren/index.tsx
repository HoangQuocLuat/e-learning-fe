// import React, { useCallback, useRef, useState } from 'react'
// import { Button, Space } from 'antd'
// import { EditOutlined, PlusOutlined } from '@ant-design/icons'
// import { ButtonBox, TableChildrenn } from './style'
// import { Buttons } from '../style'
// import DrawerTableChildren, { DrawerTableChildrenMethods } from './drawerTableChildren'
// import { entryDetailList } from '@graphql/query/auth/entry-detail-list'
// import { EntryDetail } from '@models/entry-detail'
// import { TableProps } from 'antd/lib/table'
// import { formatDate } from '@commons/datetime/format'
// import { useMounted } from '@hooks/lifecycle'
// import TableChildrenDelete from './tableChildrenDelete'
// import { Entry } from '@models/entry'

// type TableBoxChildrenProps = {
//   entry: Entry
// }

// const TableChildren: React.FC<TableBoxChildrenProps> = ({ entry }) => {
//   const drawerRef = useRef<DrawerTableChildrenMethods>(null)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [dataEntryDetail, setDataEntryDetail] = useState<EntryDetail[]>([])
//   const entryId = entry?.id

//   const fetchDetailList = useCallback(({ entryId }: { entryId: string | undefined }) => {
//     setLoading(true)
//     if (entryId) {
//       return entryDetailList({ entryId }).then(r => {
//         if (r.success) {
//           setLoading(false)
//           const formattedData = r.data?.map((entryDetail: EntryDetail) => ({
//             ...entryDetail,
//             //@ts-ignore
//             date_time: formatDate(entryDetail?.date_time),
//           }))
//           setDataEntryDetail(formattedData)
//         }
//       })
//     }
//   }, [])

//   useMounted(() => fetchDetailList({ entryId }))

//   const columns: TableProps<EntryDetail>['columns'] = [
//     {
//       title: 'Ngày giờ',
//       dataIndex: 'date_time',
//       key: 'date_time',
//     },
//     {
//       title: 'Khu vực',
//       dataIndex: 'area',
//       key: 'area',
//     },
//     {
//       title: 'Chi tiết',
//       dataIndex: 'description',
//       key: 'description',
//     },
//     {
//       title: '',
//       key: 'action',
//       render: (record: EntryDetail) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => drawerRef.current?.open(record)}
//             style={{ border: 'none' }}
//           />
//           <TableChildrenDelete
//             entryDetail={record}
//             fetchDetailList={() => fetchDetailList({ entryId })}
//           />
//         </Space>
//       ),
//     },
//   ]

//   return (
//     <div>
//       <TableChildrenn
//         // @ts-ignore
//         columns={columns}
//         loading={loading}
//         rowKey={record => record.id ?? ''}
//         dataSource={dataEntryDetail ?? []}
//         scroll={{ x: 600 }}
//         pagination={false}
//       />
//       <DrawerTableChildren
//         ref={drawerRef}
//         fetchDetailList={() => fetchDetailList({ entryId })}
//         entry={entry}
//       />
//       <ButtonBox>
//         <Buttons
//           icon={<PlusOutlined />}
//           onClick={() => {
//             drawerRef.current?.open()
//           }}
//         >
//           Add
//         </Buttons>
//       </ButtonBox>
//     </div>
//   )
// }

// export default TableChildren
