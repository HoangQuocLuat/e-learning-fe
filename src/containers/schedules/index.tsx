import React, { useRef, useState } from 'react';
import type { BadgeProps, CalendarProps } from 'antd';
import { EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import {Buttons, Wrap, Header} from '../accountList/style' 
import { Badge, Calendar, Modal, Form, Input, TimePicker, Button} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import DrawersSchedules, { DrawerSchedulesMethods } from './drawerSchedules'
import { BoxAction } from '@containers/accountList/style';
import {DrawerListAccountMethods} from '../accountList/drawerListAccount/index'
import { Console } from 'console';

// Hàm lấy dữ liệu sự kiện cho từng ngày
const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = []; 
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event......' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' },
      ];
      break;
    default:
  }
  return listData || [];
};

// Hàm lấy dữ liệu tháng
const getMonthData = (value: Dayjs) => {
  if (value.month() === dayjs().month()) {
    return 1394;
  }
};

const SchedulesContainer: React.FC = () => {
  const drawerRef = useRef<DrawerListAccountMethods>(null)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [form] = Form.useForm();

  // Hàm render các ô tháng
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  // Hàm render các ô ngày
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps['status']} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  // Hàm khi người dùng click vào ngày
  const onSelectDate = (value: Dayjs) => {
    setSelectedDate(value);  // Lưu ngày đã chọn
    setIsModalVisible(true); // Hiển thị Modal
  };

  // Hàm xử lý khi đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();  // Reset các giá trị trong form
  };

  // Hàm xử lý khi submit form
  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log('Submitted values:', values);
      console.log('Selected date:', selectedDate?.format('YYYY-MM-DD'));
      // Lưu sự kiện hoặc thực hiện logic khác tại đây
      setIsModalVisible(false);
      form.resetFields();  // Reset các giá trị trong form
    });
  };

  // Hàm render các ô tùy chỉnh
  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
    <Wrap>
     <Header>
      <BoxAction>
        <Buttons icon={<PlusOutlined />} onClick={() => drawerRef.current?.open()}>
              Thêm lịch
        </Buttons>
      </BoxAction>
      </Header>
      <Calendar cellRender={cellRender} onSelect={onSelectDate} />

      {/* Modal điền lịch */}
      <Modal
        title={`Add Event on ${selectedDate ? selectedDate.format('YYYY-MM-DD') : ''}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: 'Please select start time!' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: 'Please select end time!' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Event Content"
            rules={[{ required: true, message: 'Please enter event content!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <DrawersSchedules
          ref={drawerRef}
          onSchedulesSucces={()=>'Schedules done'}
          onSchedulesUpdateSucces={() =>'Schedules update done'}
        />
    </Wrap>
  );
};

export default SchedulesContainer;

// import React, { useState } from 'react';
// import { Badge, Calendar } from 'antd';
// import dayjs, { Dayjs } from 'dayjs';
// import AddScheduleForm, { Schedule } from './formSchedules/'

// const SchedulesContainer: React.FC = () => {
//   const [events, setEvents] = useState<{ [key: string]: Schedule[] }>({});
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

//   const handleAddSchedule = (newSchedule: Schedule) => {
//     if (selectedDate) {
//       const dateKey = selectedDate.format('DD-MM-YYYY');
//       const currentEvents = events[dateKey] || [];
//       setEvents({
//         ...events,
//         [dateKey]: [...currentEvents, newSchedule],
//       });
//     }
//     setIsModalVisible(false);
//   };

//   const getListData = (value: Dayjs) => {
//     return events[value.format('DD-MM-YYYY')] || [];
//   };

//   const dateCellRender = (value: Dayjs) => {
//     const listData = getListData(value);
//     return (
//       <ul className="events">
//         {listData.map((item, index) => (
//           <li key={index}>
//             <Badge status="success" text={`${item.content} (${item.startTime.format('h:mm a')} - ${item.endTime.format('h:mm a')})`} />
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   const onSelect = (value: Dayjs) => {
//     setSelectedDate(value);
//     setIsModalVisible(true);
//   };

//   return (
//     <div className="schedules-container">
//       <h2>Schedules</h2>
//       <Calendar dateCellRender={dateCellRender} onSelect={onSelect} />
//       <AddScheduleForm
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         onAddSchedule={handleAddSchedule}
//       />
//     </div>
//   );
// };

// export default SchedulesContainer;

