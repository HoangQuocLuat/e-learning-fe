import React, { useImperativeHandle, forwardRef, useRef, useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { Tuition } from '@models/tuition'

export type FormInputProps = {
  dataTuition?: Tuition 
  onUpdateTuition?: (input: Tuition) => Promise<boolean>
}

export type FormInputRef = {
  reset: () => void
}

const FormInputTuition: React.ForwardRefRenderFunction<FormInputRef, FormInputProps> = (
  {
    dataTuition,
    onUpdateTuition = () => Promise.resolve(false),
  },
  ref,
) => {
  const [form] = Form.useForm()
  const oldData = useRef<Tuition>(Tuition.default)
  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields()
    },
  }))
  useEffect(() => {
    if (dataTuition) {
      form.setFieldsValue({
        total_fee: dataTuition.total_fee,
        discount: dataTuition.discount,
        paid_amount: dataTuition.paid_amount,
        remaining_fee: dataTuition.remaining_fee,
      })
    }
    if (!dataTuition) {
      form.resetFields()
    }
  }, [dataTuition])

  const onFinish = () => {
    const input = Tuition.clone(oldData.current)
    if (dataTuition) {
      input.id = dataTuition.id
    }
    input.total_fee = form.getFieldValue('total_fee')
    input.discount = form.getFieldValue('discount')
    input.paid_amount = form.getFieldValue('paid_amount')
    input.remaining_fee = form.getFieldValue('remaining_fee')
    if (dataTuition) {
      onUpdateTuition(input)
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
          label="Tổng tiền"
          name="total_fee"
        >
          <Input placeholder="Vui lòng nhập tổng tiền" />
        </Form.Item>
        <Form.Item
          label="Số tiền sau khi giảm"
          name="discount"
        >
          <Input placeholder="Vui lòng nhập số tiền sau khi giảm" />
        </Form.Item>
        <Form.Item
          label="Số tiền đã thanh toán"
          name="paid_amount"
        >
          <Input placeholder="Vui lòng nhập số tiền đã thanh toán" />
        </Form.Item>
        <Form.Item
          label="Số tiền còn lại "
          name="remaining_fee"
        >
          <Input placeholder="Vui lòng nhập số tiền còn lại" />
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
            {dataTuition ? 'save' : 'add'}
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

export default forwardRef(FormInputTuition)
