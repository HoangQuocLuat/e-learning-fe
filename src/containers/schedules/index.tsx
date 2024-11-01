import React, {useRef, useState } from 'react';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import ButtonDelete from './button-delete'
import { Buttons, Wrap, Header } from '../accountList/style';
import { Calendar, Modal, Button, Tag, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import DrawersSchedules, { DrawerSchedulesMethods } from './drawerSchedules';
import { schedulesList } from '@graphql/query/admin/schedules-list';
import { useMounted } from '@hooks/lifecycle';
import { Schedules } from '@models/schedules';
import {BoxAction, TableBox } from './style';
import {formatScheduleTime} from '../../commons/datetime/format'

const SchedulesContainer: React.FC = () => {
  const drawerRef = useRef<DrawerSchedulesMethods>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedules | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSchedulesList, setDataSchedulesList] = useState<Schedules[]>([]);
  const fetchSchedulesList = () => {
    setLoading(true);
    schedulesList()
      .then((response) => {
        if (response.success) {
          setDataSchedulesList(response.data ?? []);
          console.log(dataSchedulesList)
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
  console.log("aaaa")

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
      <ul className="events" style={{ padding: 0, margin: 0 }}>
        {listData.map((item) => (
          <li
            key={item.id}
            onClick={() => showDetails(item)}
            style={{
              listStyleType: 'none',
              padding: "8px 12px",
              marginTop: 3,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #f0f0f0",
              borderRadius: 4,
              background: "#fff"
            }}
          >
            <Tag 
              color={item.schedules_type === 'Học bình thường' ? 'green' : item.schedules_type === 'Làm kiểm tra' ? 'red' : 'gold'}
            >
              {item.class?.class_name}
            </Tag>
            
            <Space size="middle">
              <Button
                icon={<EditOutlined />}
                style={{ border: 'none', width: 10, height: 10 }}
                onClick={() => {drawerRef.current?.open(item)}}
              />
              <ButtonDelete record={item} fetchSchedules={fetchSchedulesList} />
            </Space>
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
        title={`Thông tin lịch`}
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
            <p><strong>Tên lớp học:</strong> {selectedSchedule.class?.class_name}</p>
            <p><strong>Loại lịch:</strong> {selectedSchedule.schedules_type}</p>
            <p><strong>Thời gian:</strong>
            {selectedSchedule.start_time && selectedSchedule.end_time
                  ? formatScheduleTime(
                      selectedSchedule.start_time,
                      selectedSchedule.end_time
                    )
                  : 'Time not available'}
            </p>
            <p><strong>Thông tin chi tiết:</strong> {selectedSchedule?.description}</p>
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
