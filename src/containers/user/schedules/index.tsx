import React, { useCallback, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Buttons, Wrap, Header } from '../../accountList/style';
import { Badge, Calendar, Modal, Button, Tag } from 'antd';
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
    const formattedDate = value.format('YYYY-MM-DD');
    return dataSchedulesList.filter(schedule => dayjs(schedule.day).format('YYYY-MM-DD') === formattedDate);
  };
  
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    if (listData.length === 0) {
      return null;
    }
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id} onClick={() => showDetails(item)} style={{ listStyleType: 'none', padding: 0, marginTop: 3}}>
             <Tag color={item.schedules_type === 'Học bình thường' ? 'green' : item.schedules_type === 'Làm kiểm tra' ? 'red' : 'gold'}>
            {item.schedules_type}
            </Tag>
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

  console.log("aaaa", selectedSchedule?.start_time)
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
