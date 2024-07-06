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
import { logIn } from '@graphql/query/auth/login'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import Cookies from 'js-cookie'
import { useAuthContext } from '@contexts/auth/context'
import { useNavigate } from 'react-router-dom'
import { router_keys } from '@routers/key'

type LoginContainerProps = {}
const LoginContainer: React.FC<React.PropsWithChildren<LoginContainerProps>> = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState<boolean>(false)
    const { notification } = App.useApp()
    const t = useTranslations('auth')

    const { setLogin } = useAuthContext()
    const navigate = useNavigate()

    const onFinish = () => {
      const input = {
        userName: form.getFieldValue('userName'),
        password: form.getFieldValue('password'),
      }
      setLoading(true)
      logIn({ input }).then(r => {
        setLoading(false)
        if (r.success) {
          Cookies.set(AUTHEN_TOKEN_KEY, r?.data ?? '')
          setLogin(true)
          navigate(router_keys.home)
          return
        }
        notification.error({ message: t('messages.sign_in_failed') })
      })
    }

    return (
        <HomeStyled>
          <Container>
            <FormStyled
              form={form}
              onFinish={onFinish}
              layout="vertical"
              name="sign-in-form"
              autoComplete="on"
            >
              <Title>{t('labels.sign_in')}</Title>
    
              <FormItemStyled
                label={<Label>{t('labels.email_or_username')}</Label>}
                name="userName"
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