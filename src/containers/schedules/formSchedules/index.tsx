import React, { useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { Modal, Form, Input, TimePicker, Button, Select, DatePicker } from 'antd';
import { CheckOutlined } from '@ant-design/icons'
import { Schedules } from '@models/schedules';
import dayjs from 'dayjs';

export type AddScheduleFormProps = {
  dataSchedules?: Schedules;
  onAddSchedules?: (schedule: Schedules) => Promise<boolean>;
};

export type AddScheduleFormRef = {
  reset: () => void;
};

const FormInputSchedules: React.ForwardRefRenderFunction<AddScheduleFormRef, AddScheduleFormProps> = (
  {dataSchedules, onAddSchedules = () => Promise.resolve(false)},
  ref
) => {
  const [form] = Form.useForm();
  const oldData = useRef<Schedules | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
  }));

  useEffect(() => {
    if (dataSchedules) {
      form.setFieldsValue({
        description: dataSchedules.description,
        schedulesType: dataSchedules.schedules_type,
        startTime: dayjs(dataSchedules.start_time),
        endTime: dayjs(dataSchedules.end_time),
        startDate: dayjs(dataSchedules.start_date),
        endDate: dayjs(dataSchedules.end_date),
      });
    } else {
      form.resetFields();
    }
  }, [dataSchedules]);

  const onFinish = () => {
    const input = { ...oldData.current } as Schedules;

    input.description = form.getFieldValue('description');
    input.schedules_type = form.getFieldValue('schedulesType');
    input.start_time = form.getFieldValue('startTime').format('HH:mm');
    input.end_time = form.getFieldValue('endTime').format('HH:mm');
    input.start_date = form.getFieldValue('startDate').format('DD-MM-YYYY');
    input.end_date = form.getFieldValue('endDate').format('DD-MM-YYYY');

    if (!dataSchedules) {
      onAddSchedules?.(input);
    }

    form.resetFields();
  };

  return(
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
          label="Nội dung"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
        >
          <Input placeholder="Nội dung lịch" />
        </Form.Item>
        <Form.Item
          label="Loại lịch"
          name="schedulesType"
          rules={[{ required: true, message: 'Vui lòng chọn loại lịch!' }]}
        >
          <Select placeholder="Chọn loại lịch">
            <Select.Option value="1">Học bình thường</Select.Option>
            <Select.Option value="2">Làm bài kiểm tra</Select.Option>
            <Select.Option value="3">Học bù</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Ngày bắt đầu"
          name="startDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày bắt đầu" />
        </Form.Item>
        <Form.Item
          label="Ngày kết thúc"
          name="endDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
        >
          <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày kết thúc" />
        </Form.Item>
        <Form.Item
          label="Thời gian bắt đầu"
          name="startTime"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
        >
          <TimePicker use12Hours format="h:mm a" />
        </Form.Item>
        <Form.Item
          label="Thời gian kết thúc"
          name="endTime"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
        >
          <TimePicker use12Hours format="h:mm a" />
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
            {dataSchedules ? 'Save' : 'Add'}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default forwardRef(FormInputSchedules);
