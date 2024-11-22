import React, { useImperativeHandle, forwardRef, useRef, useEffect, useState, useCallback } from 'react'
import { Button, Form, Input, Select, notification } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { Account } from '@models/account'
import { Class } from '@models/class';
import { classList } from '@graphql/query/admin/class-list'
import { useMounted } from '@hooks/lifecycle'

export type FormInputProps = {
  dataAccount?: Account
  onAddAccount?: (input: Account) => Promise<boolean>
  onUpdateAccount?: (input: Account) => Promise<boolean>
}

export type FormInputRef = {
  reset: () => void
}

const FormInputListAccount: React.ForwardRefRenderFunction<FormInputRef, FormInputProps> = (
  {
    dataAccount,
    onAddAccount = () => Promise.resolve(false),
    onUpdateAccount = () => Promise.resolve(false),
  },
  ref,
) => {

  const [form] = Form.useForm()
  const oldData = useRef<Account>(Account.default)
  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields()
    },
  }))
  useEffect(() => {
    if (dataAccount) {
      console.log("aa",dataAccount)
      form.setFieldsValue({
        class_id: dataAccount.class?.id,
        user_name: dataAccount.user_name,
        password: dataAccount.password,
        role: dataAccount.role,
        name: dataAccount.name,
        date_birth: dataAccount.date_birth,
        phone: dataAccount.phone,
        address: dataAccount.address,
        status: dataAccount.status,
        user_type: dataAccount.user_type,
        email: dataAccount.email,
      })
    }
    if (!dataAccount) {
      form.resetFields()
    }
  }, [dataAccount])

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
    const input = Account.clone(oldData.current)
    if (dataAccount) {
      input.id = dataAccount.id
    }
    input.class_id = form.getFieldValue('class_id')
    input.user_name = form.getFieldValue('user_name')
    input.password = form.getFieldValue('password')
    input.role = form.getFieldValue('role')
    input.name = form.getFieldValue('name')
    input.date_birth = form.getFieldValue('date_birth')
    input.phone = form.getFieldValue('phone')
    input.email = form.getFieldValue('email')
    input.address = form.getFieldValue('address')

    if (!dataAccount) {
      onAddAccount(input)
    }
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
          label="Chọn lớp học"
          name="class_id"
          rules={[{required: true, message: 'Vui lòng chọn lớp học!' }]}
        >
          <Select placeholder="Chọn lớp học" style={{ width: 200 }}>
            {classData?.map(cls => (
              <Select.Option key={cls.id} value={cls.id}>
                {cls.class_name} {/* Hiển thị tên lớp học */}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Tài khoản"
          name="user_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
        >
          <Input placeholder="Vui lòng nhập tên tài khoản" />
        </Form.Item>
        {
          !dataAccount &&<Form.Item
  label="Mật khẩu"
  name="password"
  rules={
    !dataAccount
      ? [{ required: true, message: 'Vui lòng nhập mật khẩu!' }]
      : []
  }
>
  <Input.Password placeholder="Vui lòng nhập mật khẩu" />
</Form.Item>
}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Form.Item
          label="Chức vụ"
          name="role"
          rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
          initialValue="user"
        >
          <Select placeholder="Chọn chức vụ" style={{ width: 200 }}>
              <Select.Option key={"user"} value={"user"}>
                user
              </Select.Option>
              <Select.Option key={"admin"} value={"admin"}>
                admin
              </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Dạng hỗ trợ"
          name="user_type"
          initialValue="user"
        >
          <Select placeholder="Chọn chức vụ" style={{ width: 200 }}>
              <Select.Option key={1} value={1}>
                Loại 1
              </Select.Option>
              <Select.Option key={2} value={2}>
                Loại 2
              </Select.Option>
              <Select.Option key="none" value={null}>
                Không hỗ trợ
              </Select.Option>
          </Select>
        </Form.Item>
        </div>
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
            {dataAccount ? 'save' : 'add'}
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

export default forwardRef(FormInputListAccount)
