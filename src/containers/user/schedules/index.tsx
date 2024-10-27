import React, { useCallback, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Buttons, Wrap, Header } from '../../accountList/style';
import { Badge, Calendar, Modal, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { getSchedules } from '@graphql/query/user/schedule';
import { useMounted } from '@hooks/lifecycle';
import { Schedules } from '@models/schedules';
import {BoxAction, TableBox } from './style';
import {formatScheduleTime} from '../../../commons/datetime/format'
const SchedulesContainer: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedules | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSchedulesList, setDataSchedulesList] = useState<Schedules[]>([]);
  const fetchSchedulesList = () => {
    setLoading(true);
    getSchedules()
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
  }

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
            <p><strong>Type:</strong> {selectedSchedule.schedules_type}</p>
            <p>
                <strong>Time:</strong> 
                {selectedSchedule.start_time && selectedSchedule.end_time
                  ? formatScheduleTime(
                      selectedSchedule.start_time,
                      selectedSchedule.end_time
                    )
                  : 'Time not available'}
              </p>
          </div>
        )}
      </Modal>
      </TableBox>
    </Wrap>
  );
};

export default SchedulesContainer;
