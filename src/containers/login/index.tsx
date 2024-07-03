import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { App, Button, Form } from 'antd'
import { useTranslations } from '@hooks/translation'
import React, { useState } from 'react'
import {
  Container,
  FormItemStyled,
  FormStyled,
  Helper,
  HomeStyled,
  InputPasswordStyled,
  InputStyled,
  Label,
  Title,
} from './style'

type LoginContainerProps = {}
const LoginContainer: React.FC<React.PropsWithChildren<LoginContainerProps>> = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState<boolean>(false)
    const { notification } = App.useApp()
    const t = useTranslations('auth')

    return (
        <HomeStyled>
          <Container>
            <FormStyled
              form={form}
            //   onFinish={onFinish}
              layout="vertical"
              name="sign-in-form"
              autoComplete="on"
            >
              <Title>{t('labels.sign_in')}</Title>
    
              <FormItemStyled
                label={<Label>{t('labels.email_or_username')}</Label>}
                name="username"
                rules={[
                  {
                    required: true,
                    message: <Helper>{t('errors.email_or_username.required')}</Helper>,
                  },
                ]}
              >
                <InputStyled
                  prefix={<UserOutlined />}
                  placeholder={t('placeholder.email_or_username')}
                />
              </FormItemStyled>
              <FormItemStyled
                label={<Label>{t('labels.password')}</Label>}
                name="password"
                rules={[
                  {
                    required: true,
                    message: <Helper>{t('errors.password.required')}</Helper>,
                  },
                ]}
              >
                <InputPasswordStyled
                  prefix={<LockOutlined />}
                  placeholder="Tối thiểu 8 kí tự bao gồm cả chữ và số"
                />
              </FormItemStyled>
    
              <FormItemStyled>
                <Button style={{ width: '100%' }} loading={loading} htmlType="submit" type="primary">
                  {t('actions.sign_in')}
                </Button>
              </FormItemStyled>
            </FormStyled>
          </Container>
        </HomeStyled>
      )
}

export default LoginContainer