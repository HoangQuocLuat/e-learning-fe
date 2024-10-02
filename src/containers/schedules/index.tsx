import React, { useCallback, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Buttons, Wrap, Header } from '../accountList/style';
import { Badge, Calendar, Modal, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import DrawersSchedules, { DrawerSchedulesMethods } from './drawerSchedules';
import { schedulesList } from '@graphql/query/admin/schedules-list';
import { useMounted } from '@hooks/lifecycle';
import { Schedules } from '@models/schedules';
import {BoxAction, TableBox } from './style';

const SchedulesContainer: React.FC = () => {
  const drawerRef = useRef<DrawerSchedulesMethods>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedules | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSchedulesList, setDataSchedulesList] = useState<Schedules[]>([]);
  const fetchSchedulesList = useCallback(() => {
    setLoading(true);
    schedulesList()
      .then((response) => {
        if (response.success) {
          setDataSchedulesList(response.data ?? []);
        } else {
          throw new Error('Failed to fetch schedules');
        }
      })
      .catch(() => {
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useMounted(() => fetchSchedulesList());

  const getListData = (value: Dayjs) => {
    return dataSchedulesList.filter(schedule => {
      
      const isSameDayOfWeek = value.day() === schedule.day_of_week; 
  
      const startDate = dayjs(schedule.start_date); 
      const endDate = dayjs(schedule.end_date);     
      const isAfterStartDate = value.isSame(startDate, 'day') || value.isAfter(startDate, 'day');
      const isBeforeEndDate = value.isSame(endDate, 'day') || value.isBefore(endDate, 'day');

      return isSameDayOfWeek && isAfterStartDate && isBeforeEndDate
    });
  };
  
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id} onClick={() => showDetails(item)}>
            <Badge status="success" text={item.schedules_type} />
          </li>
        ))}
      </ul>
    );
  };

  // Show details of the selected schedule
  const showDetails = (schedule: Schedules) => {
    setSelectedSchedule(schedule);
    setIsModalVisible(true);
  };

  // Close the modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSchedule(null);
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
      <TableBox>      
      <Calendar cellRender={dateCellRender} />
      {/* Modal to display schedule details */}
      <Modal
        title={`Details for ${selectedSchedule?.description}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        {selectedSchedule && (
          <div>
            <p><strong>Class name:</strong> {selectedSchedule.class?.class_name}</p>
            <p><strong>Type:</strong> {selectedSchedule.schedules_type}</p>
            <p><strong>Day of Week:</strong> {selectedSchedule.day_of_week}</p>
            <p><strong>Start Time:</strong> {selectedSchedule.start_time}</p>
            <p><strong>End Time:</strong> {selectedSchedule.end_time}</p>
            <p><strong>Start Date:</strong> {selectedSchedule.start_date}</p>
            <p><strong>End Date:</strong> {selectedSchedule.end_date}</p>
          </div>
        )}
      </Modal>

      <DrawersSchedules
        ref={drawerRef}
        onSchedulesSucces={fetchSchedulesList} 
        onSchedulesUpdateSucces={fetchSchedulesList}
      />
      </TableBox>
    </Wrap>
  );
};

export default SchedulesContainer;
