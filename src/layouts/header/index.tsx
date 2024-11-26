import { Avatar, Dropdown, Layout, MenuProps } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { HEADER_HEIGHT } from '../home/constants'
import { Link, useLocation } from 'react-router-dom'
import { router_keys } from '@routers/key'
import { BellOutlined, QuestionOutlined } from '@ant-design/icons'
import { findRouter } from '@routers'
import { media_break_points } from '@themes/styled/globalStyle'
import Hamburger from '@components/hamburger'
import Cookies from 'js-cookie'
import { AUTHEN_TOKEN_KEY } from '@constants/key'

const HeaderStyled = styled(Layout.Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${HEADER_HEIGHT / 10}rem;
  background: #fff !important;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 9;
  padding: 0 2.4rem;
  position: relative;
`

const RightMenu = styled.div`
  float: right;
  display: flex;
  gap: 1.6rem;
  align-items: center;
  height: 100%;
`
const BoxTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`

const Title = styled.h1`
  font-size: 2.4rem;
  color: #3154a0;
  font-weight: bold;
  text-transform: uppercase;
  ${media_break_points.phone_only} {
    font-size: 20px;
  }
`

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <Link to={router_keys.profile}>Profile</Link>,
  },
  {
    key: '2',
    label: (
      <Link to={router_keys.login} onClick={() => Cookies.remove(AUTHEN_TOKEN_KEY)}>
        Logout
      </Link>
    ),
  },
]

type LayoutHeaderProps = {}

const LayoutHeader: React.FC<React.PropsWithChildren<LayoutHeaderProps>> = () => {
  const location = useLocation()

  const r = findRouter(location.pathname)

  return (
    <HeaderStyled>
      <BoxTitle>
        <Hamburger />
        {/* <BreadCrumb /> */}
        <Title>{r?.meta?.title}</Title>
      </BoxTitle>

      <RightMenu>
        <BellOutlined style={{ fontSize: '2.2rem', cursor: 'pointer' }} />
        <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
          <Avatar
            style={{ cursor: 'pointer' }}
            shape="circle"
            size={40}
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
          />
        </Dropdown>
      </RightMenu>
    </HeaderStyled>
  )
}

export default LayoutHeader
