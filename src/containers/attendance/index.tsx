import React, { useRef, useState, useCallback } from 'react';
import { Wrap, Header, TableBox, TableData } from '../accountList/style';
import { classList } from '@graphql/query/admin/class-list'
import { notification, Button, Space, TableProps, Modal, Table} from 'antd'
import { Class } from '@models/class'
import { CameraOutlined } from '@ant-design/icons'
import { useMounted } from '@hooks/lifecycle'
import {formatDate} from '../../commons/datetime/format'
import AttenPagination from './attendance-pagination'
const AttendanceContainer: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [classData, setClassData] = useState<Class[]>([]);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [attendanceData, setAttendanceData] = useState<any[]>([]);

    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    //fetch data class
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
          title: 'Hành động',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button
                icon={<CameraOutlined />}
                onClick={() => {
                    if (record.id) {
                        openAttendanceModal(record.id)
                    }
                }
                }
                style={{ border: 'none' }}
              />
            </Space>
          ),
        },
      ]
    
      const openAttendanceModal = (classId: string) => {
        setSelectedClassId(classId);
        setIsModalVisible(true);
        startCamera(); // Mở camera khi modal xuất hiện
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    const handleCheckIn = async () => {
        if (!videoRef.current) return;
    
        // Capture the current frame
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
    
        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
            // Convert the captured frame to a data URL
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            
            if (imageDataUrl === "") {
                alert("Hãy thử lại");
                console.error('Failed to capture frame');
                return;
            }
    
            // Kiểm tra dữ liệu trước khi gửi
            console.log('Captured image data URL:', imageDataUrl);
    
            // Send the image data to the backend
            try {
                const response = await fetch('http://127.0.0.1:8989/api/v1/test/openCam', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: imageDataUrl, class_id: selectedClassId }),
                });
    
                const result = await response.json();
                console.log(result);
    
                if (result?.message?.Status === 0) {
                    alert(result?.message?.Message);
                } else if (result?.message?.Status === 2) {
                    alert(result?.message?.Message);
                } else if (result?.message?.Status === 3) {
                    alert(result?.message?.Message);
                } else if (result?.Status === 200) {
                    setAttendanceData([result?.Data]);
                }
            } catch (error) {
                console.error('Error sending image to backend:', error);
            }
        }
    };

    const handleCheckOut = async () => {
        if (!videoRef.current) return;

        // Capture the current frame
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');

        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Convert the captured frame to a data URL
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            if (imageDataUrl === "") {
                alert("Hãy thử lại")
                return;
            }
            // Send the image data to the backend
            try {
                const response = await fetch('http://127.0.0.1:8989/api/v1/test/checkOut', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: imageDataUrl, class_id: selectedClassId }),
                });
                const result = await response.json();
                if (result?.message?.Status === 0) { // không tìm thấy mặt
                    alert(result?.message?.Message)
                }else if (result?.message?.Status === 2) { // khuôn mặt ko có trong lớp 
                    alert(result?.message?.Message)
                }else if (result?.message?.Status === 1) {
                    alert(result?.message?.Message)
                }else if (result?.Status === 200) {
                    setAttendanceData([result?.Data]);
                    console.log(result?.message)
                    console.log('Updated attendanceData:', [result?.Data]);
                }
            } catch (error) {
                console.error('Error sending image to backend:', error);
            }
        }
    };

    const attendanceColumns= [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status_check_in',
            key: 'status_check_in',
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
            render: (time: string) => formatDate(time, 'HH:mm:ss DD/MM/YYYY')
        },
    ];


    return (
        <Wrap>
            <Header>
                <h2>Quản lý điểm danh</h2>
            </Header>
            <TableBox>
                <TableData
                // @ts-ignore
                columns={columns}
                loading={loading}
                dataSource={classData}
                rowKey={record => record?.id ?? ''} 
                scroll={{ x: 600 }}
                pagination= {false}
                />
            </TableBox>
            <AttenPagination></AttenPagination>
            <Modal
                title={`Điểm danh`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={900}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <video
                        ref={videoRef}
                        width="320"
                        height="240"
                        autoPlay
                        style={{ border: '1px solid #ccc' }}
                    />
                    <div style={{ flex: 1, paddingLeft: 20 }}>
                        <Space>
                        <Button onClick={handleCheckIn} type="primary" style={{ marginBottom: 16, }}>
                            Điểm danh vào
                        </Button>
                        <br/>
                        <Button onClick={handleCheckOut} type="primary" style={{ marginBottom: 16, backgroundColor: "red"}}>
                            Điểm danh ra
                        </Button>
                        </Space>
                        <Table
                            columns={attendanceColumns}
                            dataSource={attendanceData}
                            rowKey={(record) => record?.id || 'default_key'}
                            pagination={false}
                        />
                    </div>
                </div>
            </Modal>
        </Wrap>
    );
};

export default AttendanceContainer;
