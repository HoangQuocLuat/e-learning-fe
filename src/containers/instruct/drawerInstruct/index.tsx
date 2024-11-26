import { useImperativeHandle, forwardRef, useState } from 'react';
import { DrawerStyle, Title, Wrap } from './styles';
import FormInputInstruct from '../formInstruct';
import { notification } from 'antd';
import { Instruct } from '@models/instruct';
import { instructAdd } from '@graphql/mutation/admin/instruct-add';
import { instructUpdate } from '@graphql/mutation/admin/instruct-update';

export type DrawerInstructMethods = {
  open: (data?: Instruct) => void;
  close: () => void;
};

type DrawerInstructProps = {
  onInstructSuccess: () => void;
  onInstructUpdateSuccess: () => void;
};

const DrawerInstruct = forwardRef<DrawerInstructMethods, DrawerInstructProps>(
  ({ onInstructSuccess, onInstructUpdateSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const [dataInstruct, setDataInstruct] = useState<Instruct>();

    useImperativeHandle(ref, () => ({
      open: (data?: Instruct) => {
        setVisible(true);
        setDataInstruct(data);
      },
      close: () => onClose(),
    }));

    const onClose = () => {
      setVisible(false);
    };

    const onAddInstruct = (input: Instruct) => {
      return instructAdd({
        input: {
          title: input.title,
          description: input.description,
          date: input.date,
        },
      })
        .then((r) => {
          if (r.success) {
            notification.success({ message: 'Thêm hướng dẫn thành công' });
            onInstructSuccess();
            onClose();
          } else {
            notification.error({ message: 'Thêm hướng dẫn không thành công' });
          }
          return Promise.resolve(r.success ?? false);
        })
        .catch(() => {
          return Promise.resolve(false);
        });
    };

    const onUpdateInstruct = (input: Instruct) => {
      return instructUpdate({
        input: {
          id: input.id,
          title: input.title,
          description: input.description,
          date: input.date,
        },
      })
        .then((r) => {
          if (r.success) {
            notification.success({ message: 'Cập nhật hướng dẫn thành công' });
            onInstructUpdateSuccess();
            onClose();
          } else {
            notification.error({ message: 'Cập nhật hướng dẫn không thành công' });
          }
          return Promise.resolve(r.success ?? false);
        })
        .catch(() => {
          return Promise.resolve(false);
        });
    };

    return (
      <DrawerStyle
        title={<Title>{dataInstruct ? 'Cập nhật hướng dẫn' : 'Thêm hướng dẫn mới'}</Title>}
        open={visible}
        width={700}
        onClose={onClose}
      >
        <Wrap>
          <FormInputInstruct
            dataInstruct={dataInstruct}
            onAddInstruct={onAddInstruct}
            onUpdateInstruct={onUpdateInstruct}
          />
        </Wrap>
      </DrawerStyle>
    );
  },
);

export default DrawerInstruct;
