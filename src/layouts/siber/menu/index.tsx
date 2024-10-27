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
        <Header>
        <span>
          L and T
        </span>
        {/* <img src={Logo} alt="" /> */}
        </Header>
        <MenuAntdStyle
          theme="dark"
          mode="inline"
          onClick={onClick}
          style={{ color: '#3154A0', backgroundColor: '#F8F9FA' }}
          items={[
            {
              key: '',
              label: <Link to={router_keys.home}>Home</Link>,
              icon: <AppstoreOutlined />,
            },
            {
              key: '/schedules',
              icon: <FileDoneOutlined />,
              label: <Link to={router_keys.schedules}>Schedule</Link>,
            },
            {
              key: '/tuition',
              icon: <FileDoneOutlined />,
              label: <Link to={router_keys.tuition}>Tuition</Link>,
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
