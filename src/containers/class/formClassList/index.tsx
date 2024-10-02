import React, { useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons'
import { Class } from '@models/class';

export type AddClassFormProps = {
  dataClass?: Class;
  onAddClass?: (input: Class) => Promise<boolean>;
};

export type AddClassFormRef = {
  reset: () => void;
};

const FormInputListClass: React.ForwardRefRenderFunction<AddClassFormRef, AddClassFormProps> = (
  {dataClass, onAddClass = () => Promise.resolve(false)},
  ref
) => {
  const [form] = Form.useForm();
  const oldData = useRef<Class | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
  }));

  useEffect(() => {
    if (dataClass) {
      form.setFieldsValue({
        class_name: dataClass.class_name
      });
    } else {
      form.resetFields();
    }
  }, [dataClass]);

  const onFinish = () => {
    const input = { ...oldData.current } as Class;

    input.class_name = form.getFieldValue('class_name');
    if (!dataClass) {
      onAddClass?.(input);
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
          label="Tên lớp học"
          name=""
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
        >
          <Input placeholder="" />
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
            {dataClass ? 'Save' : 'Add'}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default forwardRef(FormInputListClass);
