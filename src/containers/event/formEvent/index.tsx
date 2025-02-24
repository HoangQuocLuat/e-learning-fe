import React, { useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Event } from '@models/event';

export type FormInputEventProps = {
  dataEvent?: Event;
  onAddEvent?: (input: Event) => Promise<boolean>;
  onUpdateEvent?: (input: Event) => Promise<boolean>;
};

export type FormInputEventRef = {
  reset: () => void;
};

const FormInputEvent: React.ForwardRefRenderFunction<FormInputEventRef, FormInputEventProps> = (
  { dataEvent, 
    onAddEvent = () => Promise.resolve(false), 
    onUpdateEvent = () => Promise.resolve(false) 
  },
  ref
) => {
  const [form] = Form.useForm();
  const oldData = useRef<Event | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
  }));

  useEffect(() => {
    if (dataEvent) {
      form.setFieldsValue({
        title: dataEvent.title,
        description: dataEvent.description,
        date: dataEvent.date,
      });
    } else {
      form.resetFields();
    }
  }, [dataEvent]);

  const onFinish = () => {
    const input = { ...oldData.current } as Event;
    if (dataEvent) {
      input.id = dataEvent.id;
    }
    input.title = form.getFieldValue('title');
    input.description = form.getFieldValue('description');
    input.date = form.getFieldValue('date');

    if (!dataEvent) {
      onAddEvent?.(input);
    }

    if (dataEvent) {
      onUpdateEvent?.(input);
    }

    form.resetFields();
  };

  return (
    <Form
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      form={form}
      style={{
        width: '100%',
        maxWidth: '60rem',
      }}
    >
      <div>
        <Form.Item
          label="Tiêu đề sự kiện"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input placeholder="Nhập tiêu đề sự kiện" />
        </Form.Item>
        <Form.Item
          label="Mô tả sự kiện"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input.TextArea placeholder="Nhập mô tả sự kiện" rows={4} />
        </Form.Item>
      </div>
      <div>
        <Form.Item
          wrapperCol={{ span: 24 }}
          style={{
            display: 'flex',
            justifyContent: 'end',
            position: 'absolute',
            bottom: 10,
            right: 50,
          }}
        >
          <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
            {dataEvent ? 'Save' : 'Add'}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default forwardRef(FormInputEvent);
