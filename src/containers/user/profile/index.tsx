import {useState} from 'react';
import { Wrap } from '../../accountList/style';
import { Account } from '@models/account'
import { Header } from './style';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Modal, Upload, UploadProps, notification} from 'antd';
import { getUserMe } from '@graphql/query/user/user-me';
import { useMounted } from '@hooks/lifecycle';
import React from 'react';
import axios from 'axios';

const ProfileContainer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<Account | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState<File | null>(null); // Lưu file
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Lưu URL preview

  const fetchGpl = () => {
    setLoading(true);
    getUserMe()
      .then((response) => {
        if (response.success) {
          setUserData(response.data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useMounted(() => fetchGpl());

  const handleModelOpen = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFile(null);
    setPreviewUrl(null);
  };

  const uploadProps: UploadProps = {
    name: 'image',
    listType: "picture-circle",
    accept: '.jpg,.jpeg,.png',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        notification.error({ message: 'Chỉ chấp nhận file ảnh' });
      } else {
        // Tạo URL tạm thời để xem trước
        setPreviewUrl(URL.createObjectURL(file));
        setFile(file); // Lưu file để dùng sau
      }
      return false; // Ngăn việc upload tự động
    },
  };

  const handleUploadAvatar = async () => {
    if (!file || !userData) {
      notification.error({ message: 'Chưa chọn ảnh hoặc thiếu thông tin người dùng' });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('user_id', userData.id || 'unknown');

    try {
      const response = await axios.post('http://127.0.0.1:8989/api/v1/upload/image', formData);
      if (response.status === 200) {
        notification.success({ message: 'Tải ảnh thành công' });
        setIsModalVisible(false);
        fetchGpl(); 
      } else {
        notification.error({ message: 'Tải ảnh thất bại' });
      }
    } catch (error) {
      notification.error({ message: 'Lỗi khi tải ảnh. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrap>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size={200} src={userData?.avatar} icon={<UserOutlined />} />
          <p style={{ marginLeft: '20px', fontSize: '40px' }}>{userData?.name}</p>
        </div>
        <Space size="middle">
          <Button
            icon={<UploadOutlined style={{ fontSize: '20px' }} />}
            style={{ border: 'none', padding: '10px', fontSize: '20px' }}
            onClick={handleModelOpen}
          >
            Tải ảnh đại diện
          </Button>
          <Button
            icon={<EditOutlined style={{ fontSize: '20px' }} />}
            style={{ border: 'none', padding: '10px', fontSize: '20px' }}
          >
            Sửa thông tin
          </Button>
        </Space>
      </Header>

      <Modal
        title="Tải ảnh đại diện"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Upload {...uploadProps}>
            <Avatar size={100} src={previewUrl || undefined} icon={<UploadOutlined />} />
          </Upload>
          <Button onClick={handleUploadAvatar} loading={loading} style={{ marginTop: '20px' }}>
            Tải lên
          </Button>
        </div>
      </Modal>

      <div style={{ width: '100%', height: '20px' }}></div>

      <div style={{ padding: '20px', width: '100%', backgroundColor: 'white', display: 'flex',  justifyContent: 'center', borderRadius:'20px', }}>
      <div style={{ maxWidth: '600px', width: '100%'}}>
        
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
      <p style={{ width: '50%' }}>Ngày sinh:</p>
      <p style={{ width: '50%' }}>{userData?.date_birth}</p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
      <p style={{ width: '50%' }}>Tên lớp học:</p>
      <p style={{ width: '50%' }}>{userData?.class?.class_name}</p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
      <p style={{ width: '50%' }}>Địa chỉ:</p>
      <p style={{ width: '50%' }}>{userData?.address}</p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
      <p style={{ width: '50%' }}>Số điện thoại:</p>
      <p style={{ width: '50%' }}>{userData?.phone}</p>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
      <p style={{ width: '50%' }}>Email:</p>
      <p style={{ width: '50%' }}>{userData?.email}</p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
      <p style={{ width: '50%' }}>Học sinh được hỗ trợ:</p>
      <p style={{ width: '50%' }}>{userData?.user_type}</p>
    </div>
  </div>
      </div>
    </Wrap>
  );
};

export default ProfileContainer;

