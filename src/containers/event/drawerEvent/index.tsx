import { useImperativeHandle, forwardRef, useState } from 'react';
import { DrawerStyle, Title, Wrap } from './style';
import FormInputEvent from '../formEvent';
import { notification } from 'antd';
import { Event } from '@models/event';
import { eventAdd } from '@graphql/mutation/admin/event-add';
import { eventUpdate } from '@graphql/mutation/admin/event-update';

export type DrawerEventMethods = {
  open: (data?: Event) => void;
  close: () => void;
};

type DrawerEventProps = {
  onEventSuccess: () => void;
  onEventUpdateSuccess: () => void;
};

const DrawerEvent = forwardRef<DrawerEventMethods, DrawerEventProps>(
  ({ onEventSuccess, onEventUpdateSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const [dataEvent, setDataEvent] = useState<Event>();

    useImperativeHandle(ref, () => ({
      open: (data?: Event) => {
        setVisible(true);
        setDataEvent(data);
      },
      close: () => onClose(),
    }));

    const onClose = () => {
      setVisible(false);
    };

    const onAddEvent = (input: Event) => {
      return eventAdd({
        input: {
          title: input.title,
          description: input.description,
          date: input.date,
        },
      })
        .then((r) => {
          if (r.success) {
            notification.success({ message: 'Thêm sự kiện thành công' });
            onEventSuccess();
            onClose();
          } else {
            notification.error({ message: 'Thêm sự kiện không thành công' });
          }
          return Promise.resolve(r.success ?? false);
        })
        .catch(() => {
          return Promise.resolve(false);
        });
    };

    const onUpdateEvent = (input: Event) => {
      return eventUpdate({
        input: {
          id: input.id,
          title: input.title,
          description: input.description,
          date: input.date,
        },
      })
        .then((r) => {
          if (r.success) {
            notification.success({ message: 'Cập nhật sự kiện thành công' });
            onEventUpdateSuccess();
            onClose();
          } else {
            notification.error({ message: 'Cập nhật sự kiện không thành công' });
          }
          return Promise.resolve(r.success ?? false);
        })
        .catch(() => {
          return Promise.resolve(false);
        });
    };

    return (
      <DrawerStyle
        title={<Title>{dataEvent ? 'Cập nhật sự kiện' : 'Thêm sự kiện mới'}</Title>}
        open={visible}
        width={700}
        onClose={onClose}
      >
        <Wrap>
          <FormInputEvent
            dataEvent={dataEvent}
            onAddEvent={onAddEvent}
            onUpdateEvent={onUpdateEvent}
          />
        </Wrap>
      </DrawerStyle>
    );
  },
);

export default DrawerEvent;
