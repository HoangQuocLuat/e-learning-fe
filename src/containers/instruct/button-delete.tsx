import { DeleteOutlined } from '@ant-design/icons';
import { instructDelete } from '@graphql/mutation/admin/instruct-delete';
import { Instruct } from '@models/instruct';
import { Button, notification } from 'antd';
import React from 'react';

type ButtonDeleteProps = {
  record?: Instruct;
  fetchEntry?: () => void;
};

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ record, fetchEntry }) => {
  const handleDeleteInstruct = (id: string | undefined) => {
    if (id) {
      instructDelete({ id })
        .then(r => {
          if (r.success) {
            notification.success({ message: 'Xóa hướng dẫn thành công' });
            if (fetchEntry) {
              fetchEntry();
            }
          } else {
            notification.error({ message: 'Xóa hướng dẫn không thành công' });
          }
        })
        .catch(() => {
          notification.error({ message: 'Có lỗi xảy ra khi xóa hướng dẫn' });
        });
    }
  };

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={() => handleDeleteInstruct(record?.id)}
      style={{ border: 'none' }}
    />
  );
};

export default ButtonDelete;
