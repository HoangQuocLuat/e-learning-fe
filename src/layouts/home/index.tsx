import { useSetting } from '@contexts/setting/context'
import { media_break_points } from '@themes/styled/globalStyle'
import { Layout } from 'antd'
import cx from 'classnames'
import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import {
  ANIMATION_SPEED,
  HEADER_HEIGHT,
  SIDER_BAR_COLLAPSED_WIDTH,
  SIDER_BAR_WIDTH,
} from './constants'
import LayoutHeader from '../header'
import LayoutSider from '../siber'
import TagView, { TAG_VIEW_HEIGHT } from './tag-view'

const LayoutStyled = styled(Layout)`
  position: relative;
  height: 100%;
  width: 100%;
  display: block;
`

const Wrap = styled.div`
  margin-left: ${SIDER_BAR_WIDTH / 10}rem;
  transition:
    all ${ANIMATION_SPEED}s,
    background 0s;
  &.collapsed {
    margin-left: ${SIDER_BAR_COLLAPSED_WIDTH / 10}rem;
  }

  ${media_break_points.xs} {
    margin-left: 0 !important;
  }
`

const FixedHeader = styled.div<{ $collapsed?: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - ${p => (p.$collapsed ? SIDER_BAR_COLLAPSED_WIDTH : SIDER_BAR_WIDTH) / 10}rem);
  transition: width ${ANIMATION_SPEED}s;

  ${media_break_points.xs} {
    width: 100%;
  }
`

const MainApp = styled.div`
  width: 100%;
  transition: width ${ANIMATION_SPEED}s;
  position: relative;
  overflow: hidden;
`

type DashboardLayoutProps = {}

const DashboardLayout: React.FC<React.PropsWithChildren<DashboardLayoutProps>> = () => {
  const { sidebarCollapsed, showTagView } = useSetting()

  return (
    <LayoutStyled>
      <LayoutSider />
      <Wrap className={cx({ collapsed: sidebarCollapsed })}>
          <LayoutHeader />
        <MainApp>
          <Outlet />
        </MainApp>
      </Wrap>
    </LayoutStyled>
  )
}

export default DashboardLayout
