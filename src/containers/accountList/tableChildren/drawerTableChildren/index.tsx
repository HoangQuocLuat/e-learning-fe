// import { useImperativeHandle, forwardRef, useState } from 'react'
// import { DrawerStyle, Title, Wrap } from './style'
// import FormInputListOrder from '../formTableChildren'
// import { EntryDetail } from '@models/entry-detail'
// import { entryDetailAdd } from '@graphql/mutation/auth/entry-detail-add'
// import { notification } from 'antd'
// import { entryDetailUpdate } from '@graphql/mutation/auth/entry-detail-update'
// import { Entry } from '@models/entry'

// type DrawerTableCHildrenProps = {
//   fetchDetailList?: () => void
//   entry: Entry
// }

// export type DrawerTableChildrenMethods = {
//   open: (data?: EntryDetail) => void
//   close: () => void
// }

// const DrawerTableChildren = forwardRef<DrawerTableChildrenMethods, DrawerTableCHildrenProps>(
//   ({ fetchDetailList, entry }, ref) => {
//     const [visible, setVisible] = useState(false)
//     const [dataEntryDetail, setDataEntryDetail] = useState<EntryDetail>()
//     const entryId = entry?.id
//     useImperativeHandle(ref, () => ({
//       open: (data?: EntryDetail) => {
//         setVisible(true)
//         setDataEntryDetail(data)
//       },
//       close: () => onClose(),
//     }))

//     const onClose = () => {
//       setVisible(false)
//     }

//     const onCreateEntryDetail = (input: EntryDetail) => {
//       return entryDetailAdd({
//         input: {
//           entryId,
//           description: input.description,
//           dateTime: input.dateTime,
//           area: input.area,
//         },
//       }).then(r => {
//         if (r.success) {
//           notification.success({ message: 'Thêm chi tiết vận đơn thành công' })
//           //@ts-ignore
//           fetchDetailList()
//           onClose()
//         }
//         if (!r.success) {
//           notification.error({ message: 'Thêm chi tiết vận đơn không thành công' })
//         }
//       })
//     }

//     const onUpdateEntryDetail = (input: EntryDetail) => {
//       return entryDetailUpdate({
//         input: {
//           entryDetailId: input.id,
//           description: input.description,
//           dateTime: input.dateTime,
//           area: input.area,
//         },
//       }).then(r => {
//         if (r.success) {
//           notification.success({ message: 'Cập nhật chi tiết vận đơn thành công' })
//           //@ts-ignore
//           fetchDetailList()
//           onClose()
//         }
//         if (!r.success) {
//           notification.error({ message: 'Cập nhật chi tiết vận đơn không thành công' })
//         }
//       })
//     }

//     return (
//       <DrawerStyle
//         title={
//           <Title>
//             {dataEntryDetail ? 'Chi tiết mã vận đơn gốc' : 'Thêm chi tiết mã vận đơn gốc'}
//           </Title>
//         }
//         open={visible}
//         width={700}
//         onClose={onClose}
//       >
//         <Wrap>
//           <FormInputListOrder
//             dataEntryDetail={dataEntryDetail}
//             onCreateEntryDetail={onCreateEntryDetail}
//             onUpdateEntryDetail={onUpdateEntryDetail}
//             entry={entry}
//           />
//         </Wrap>
//       </DrawerStyle>
//     )
//   },
// )

// export default DrawerTableChildren
