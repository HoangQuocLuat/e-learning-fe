import React, { useImperativeHandle, forwardRef, useRef, useEffect } from 'react'
import { Button, Form, Input, notification } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { Account } from '@models/account'

export type FormInputProps = {
  dataAccount?: Account
  onUpdateAccount?: (input: Account) => Promise<boolean>
}

export type FormInputRef = {
  reset: () => void
}

const FormInputInfo: React.ForwardRefRenderFunction<FormInputRef, FormInputProps> = (
  {
    dataAccount,
    onUpdateAccount = () => Promise.resolve(false),
  },
  ref,
) => {
console.log("dd", dataAccount)
  const [form] = Form.useForm()
  const oldData = useRef<Account>(Account.default)
  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields()
    },
  }))
  
  useEffect(() => {
    if (dataAccount) {
      form.setFieldsValue({
        password: dataAccount.password,
        name: dataAccount.name,
        date_birth: dataAccount.date_birth,
        phone: dataAccount.phone,
        email: dataAccount.email,
        address: dataAccount.address,
      })
    }
    if (!dataAccount) {
      form.resetFields()
    }
  }, [dataAccount])

  const onFinish = () => {
    const input = Account.clone(oldData.current)
    if (dataAccount) {
      input.id = dataAccount.id
    }
    input.password = form.getFieldValue('password')
    input.name = form.getFieldValue('name')
    input.date_birth = form.getFieldValue('date_birth')
    input.phone = form.getFieldValue('phone')
    input.email = form.getFieldValue('email')
    input.address = form.getFieldValue('address')

    if (dataAccount) {
      onUpdateAccount(input)
    }
  }

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
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Vui lòng nhập mật khẩu" />
        </Form.Item>
        <Form.Item
          label="Họ tên đầy đủ"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên đầy đủ!' }]}
        >
          <Input placeholder="Vui lòng nhập họ tên đầy đủ" />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="date_birth"
          rules={[{ required: true, message: 'Vui lòng nhập ngày tháng năm sinh!' }]}
        >
          <Input placeholder="Vui lòng nhập ngày tháng năm sinh" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input placeholder="Vui lòng nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input placeholder="Vui lòng nhập email" />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Vui lòng nhập địa chỉ" />
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
            Save
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

export default forwardRef(FormInputInfo)
