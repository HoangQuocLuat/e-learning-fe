import React, { useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Instruct } from '@models/instruct';

export type FormInputInstructProps = {
  dataInstruct?: Instruct;
  onAddInstruct?: (input: Instruct) => Promise<boolean>;
  onUpdateInstruct?: (input: Instruct) => Promise<boolean>;
};

export type FormInputInstructRef = {
  reset: () => void;
};

const FormInputInstruct: React.ForwardRefRenderFunction<FormInputInstructRef, FormInputInstructProps> = (
  { 
    dataInstruct, 
    onAddInstruct = () => Promise.resolve(false), 
    onUpdateInstruct = () => Promise.resolve(false) 
  },
  ref
) => {
  const [form] = Form.useForm();
  const oldData = useRef<Instruct | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields();
    },
  }));

  useEffect(() => {
    if (dataInstruct) {
      form.setFieldsValue({
        title: dataInstruct.title,
        description: dataInstruct.description,
        date: dataInstruct.date,
      });
    } else {
      form.resetFields();
    }
  }, [dataInstruct]);

  const onFinish = () => {
    const input = { ...oldData.current } as Instruct;
    if (dataInstruct) {
      input.id = dataInstruct.id;
    }
    input.title = form.getFieldValue('title');
    input.description = form.getFieldValue('description');
    input.date = form.getFieldValue('date');

    if (!dataInstruct) {
      onAddInstruct?.(input);
    }

    if (dataInstruct) {
      onUpdateInstruct?.(input);
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
          label="Tiêu đề hướng dẫn"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input placeholder="Nhập tiêu đề hướng dẫn" />
        </Form.Item>
        <Form.Item
          label="Mô tả hướng dẫn"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input.TextArea placeholder="Nhập mô tả hướng dẫn" rows={4} />
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
            {dataInstruct ? 'Save' : 'Add'}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default forwardRef(FormInputInstruct);
