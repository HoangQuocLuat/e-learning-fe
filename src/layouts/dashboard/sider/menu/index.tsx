import React from 'react'
import { Avatar, MenuProps as MenuAntdProps, Typography } from 'antd'
import {
  AppstoreOutlined,
  FileDoneOutlined,
} from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useSetting } from '@contexts/setting/context'
import { router_keys } from '@routers/key'
import { BoxUser, Header, MenuAntdStyle, MenuStyled } from './style'
import { useAuthContext } from '@contexts/auth/context'

type MenuProps = {}

const Menu: React.FC<React.PropsWithChildren<MenuProps>> = () => {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { toggleDrawerOpened } = useSetting()
  const onClick: MenuAntdProps['onClick'] = e => {
    navigate(`${e.key}`)
    toggleDrawerOpened()
  }

  return (
    <MenuStyled>
      <div>
      <Header
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '12rem', 
    backgroundColor: '#f5f5f5',
  }}
> 
  <Avatar
    shape="circle"
    src="img/Logo.png"
    style={{
      width: '100%',
      maxWidth: '10rem',
      height: '10rem',
      borderRadius: '50%',
    }}
  />
</Header>
        <MenuAntdStyle
          theme="dark"
          mode="inline"
          onClick={onClick}
          style={{ color: '#3154A0', backgroundColor: '#F8F9FA' }}
          items={[
            {
              key: '/dashboard',
              label: <Link to={router_keys.dashboard}>Dashboard</Link>,
              icon: <AppstoreOutlined />,
            },
            {
              key: '/dashboard/accountList',
              icon: <FileDoneOutlined />,
              label: <Link to={router_keys.accountList}>Quản lý tài khoản</Link>,
            },
            {
              key: '/dashboard/schedules',
              icon: <FileDoneOutlined />,
              label: <Link to={router_keys.schedules}>Quản lý lịch</Link>,
            },
            {
              key: '/dashboard/class',
              icon: <FileDoneOutlined />,
              label: <Link to={router_keys.class}>Quản lý lớp học</Link>,
            },
            {
              key: '/dashboard/tuition',
              icon: <FileDoneOutlined />,
              label: <Link to={router_keys.tuition}>Quản lý học phí</Link>,
            },
            {
              key: '/dashboard/attendance',
              icon: <FileDoneOutlined />,
              label: <Link to={router_keys.attendance}>Quản lý điểm danh</Link>,
            },
            {
              key: '/dashboard/payment',
              icon: <FileDoneOutlined />,
              label: <Link to={router_keys.attendance}>Quản lý hóa đơn</Link>,
            },
          ]}
        />
      </div>
      <BoxUser>
        <Avatar
          style={{ cursor: 'pointer' }}
          shape="circle"
          size={40}
          src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        />
        <Typography>{user?.email}</Typography>
      </BoxUser>
    </MenuStyled>
  )
}

export default Menu
