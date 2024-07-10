import React, { useCallback } from 'react'
import { BoxInput, BoxSearch, Inputs } from './style'
import { DownOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Dropdown, Form, Menu, Space } from 'antd'
import * as _ from 'lodash'
import { InputSearch } from '..'

type SearchEntryProps = {
    onSearch?: (input: InputSearch) => void
}

const SearchEntry: React.FC<SearchEntryProps> = ({ onSearch }) => {
    const [form] = Form.useForm()

    const onChangeSearch = useCallback(
        _.debounce(() => {
            const input = {
                userName: form.getFieldValue('user_name'),
                phone: form.getFieldValue('phone'),
            }
            onSearch?.(input)
        }, 500),
        [form, onSearch],
    )

    const onFinish = useCallback(
        (values: any) => {
            const input = {
                userName: values.userName,
                phone: values.phone,
            }

            onSearch?.(input)
        },
        [onSearch],
    )
    return (
        <BoxSearch>
            <BoxInput>
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFieldsChange={() => onChangeSearch()}
                    style={{ display: 'flex', gap: '1rem' }}
                >
                    <Form.Item name="userName" style={{ margin: '0' }}>
                        <Inputs placeholder="tên tài khoản" prefix={<SearchOutlined />} />
                    </Form.Item>
                    <Form.Item name="phone" style={{ margin: '0' }}>
                        <Inputs placeholder="số điện thoại" prefix={<SearchOutlined />} />
                    </Form.Item>
                </Form>
            </BoxInput>

        </BoxSearch>
    )
}

export default SearchEntry
