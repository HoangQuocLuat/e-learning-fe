import React, { useImperativeHandle, forwardRef,useCallback, useRef, useEffect, useState} from 'react';
import { Form, Input, TimePicker, Button, Select, DatePicker,notification} from 'antd';
import { CheckOutlined } from '@ant-design/icons'
import { Schedules } from '@models/schedules';
import { Class } from '@models/class';
import dayjs from 'dayjs';
import { classList } from '@graphql/query/admin/class-list'
import { useMounted } from '@hooks/lifecycle'

const scheduleOptions = [
  { value: 0, label: 'Học bình thường' },
  { value: 1, label: 'Làm bài kiểm tra' },
  { value: 2, label: 'Học bù' },
];

const dayOfWeekOptions = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];
export type AddScheduleFormProps = {
  dataSchedules?: Schedules;
  onAddSchedules?: (schedule: Schedules) => Promise<boolean>;
  onUpdateSchedules?: (input: Schedules) => Promise<boolean>;
};

export type AddScheduleFormRef = {
  reset: () => void;
};

const FormInputSchedules: React.ForwardRefRenderFunction<AddScheduleFormRef, AddScheduleFormProps> = (
  {dataSchedules, 
   onAddSchedules = () => Promise.resolve(false),
   onUpdateSchedules = () => Promise.resolve(false),
  },
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
        class_id: dataSchedules.class_id,
        description: dataSchedules.description,
        schedulesType: dataSchedules.schedules_type,
        dayOfWeek: dataSchedules.day_of_week,
        startTime: dayjs(dataSchedules.start_time),
        endTime: dayjs(dataSchedules.end_time),
        startDate: dayjs(dataSchedules.start_date),
        endDate: dayjs(dataSchedules.end_date),
      });
    } else {
      form.resetFields();
    }
  }, [dataSchedules]);

  const [classData, setClassData] = useState<Class[]>([])
  const fetchClassList = useCallback(() => {
    classList()
      .then(rClass => {
        if (rClass.success) {
          setClassData(rClass.data ?? [])
          // setPage(rClass.paging!)
        }
      })
      .catch(() => {
        notification.error({ message: 'Có lỗi xảy ra!' })
      })
  }, [])

  useMounted(() => fetchClassList())

  const onFinish = () => {
    const input = { ...oldData.current } as Schedules;
    if (!dataSchedules) {
      input.class_id = form.getFieldValue('class_id');
    }
    if (dataSchedules) {
      input.id = dataSchedules.id;
    }
    input.end_date = form.getFieldValue('endDate').format('DD-MM-YYYY');
    input.start_date = form.getFieldValue('startDate').format('DD-MM-YYYY');
    input.day_of_week = form.getFieldValue('day_of_week');
    input.description = form.getFieldValue('description');
    input.schedules_type = form.getFieldValue('schedulesType');
    input.start_time = form.getFieldValue('startTime').format('HH:mm');
    input.end_time = form.getFieldValue('endTime').format('HH:mm');
    // input.start_date = form.getFieldValue('startDate').format('DD-MM-YYYY');
    // input.end_date = form.getFieldValue('endDate').format('DD-MM-YYYY');

    if (!dataSchedules) {
      onAddSchedules?.(input);
    }

    if (dataSchedules) {
      onUpdateSchedules?.(input);
    }

    // form.resetFields();

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
        {!dataSchedules && <Form.Item
          label="Chọn lớp học"
          name="class_id"
          rules={ dataSchedules ? []:[{required: true, message: 'Vui lòng chọn lớp học!' }]}
        >
          <Select placeholder="Chọn lớp học" style={{ width: 200 }}>
            {classData?.map(cls => (
              <Select.Option key={cls.id} value={cls.id}>
                {cls.class_name} {/* Hiển thị tên lớp học */}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        }
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
          <Select placeholder="Chọn loại lịch" style={{ width: 200 }}>
        {scheduleOptions.map(option => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
        </Form.Item>
        {!dataSchedules &&<Form.Item
          label="Ngày trong tuần"
          name="day_of_week"
          rules={[{ required: true, message: 'Vui lòng chọn ngày trong tuần!' }]}
        >
           <Select placeholder="Chọn ngày trong tuần" style={{ width: 200 }}>
        {dayOfWeekOptions.map(option => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
        </Form.Item>}
        {!dataSchedules &&<Form.Item
          label="Ngày bắt đầu"
          name="startDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày bắt đầu" />
        </Form.Item>}
        {!dataSchedules &&<Form.Item
          label="Ngày kết thúc"
          name="endDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
        >
          <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày kết thúc" />
        </Form.Item>}
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
