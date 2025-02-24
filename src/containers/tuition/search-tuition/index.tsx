import React, { useCallback } from 'react'
import { BoxInput, BoxSearch, Inputs } from './style'
import { SearchOutlined } from '@ant-design/icons'
import { Form } from 'antd'
import * as _ from 'lodash'
import { InputSearch } from '..'

type SearchTuitionProps = {
    onSearch?: (input: InputSearch) => void
}

const SearchTuition: React.FC<SearchTuitionProps> = ({ onSearch }) => {
    const [form] = Form.useForm()

    const onChangeSearch = useCallback(
        _.debounce(() => {
            const input = {
                remaining_fee: form.getFieldValue('remaining_fee'),
            }
            onSearch?.(input)
        }, 500),
        [form, onSearch],
    )

    const onFinish = useCallback(
        (values: any) => {
            const input = {
                remaining_fee: values.remaining_fee,
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
                    {/* Tìm kiếm theo remaining_fee */}
                    <Form.Item name="remaining_fee" style={{ margin: '0' }}>
                        <Inputs placeholder="Remaining Fee" prefix={<SearchOutlined />} />
                    </Form.Item>
                </Form>
            </BoxInput>
        </BoxSearch>
    )
}

export default SearchTuition
