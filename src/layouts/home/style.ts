import styled from 'styled-components'
import { Layout } from 'antd'
import { TAG_VIEW_HEIGHT } from './tag-view'
import { media_break_points } from '@themes/styled/globalStyle'
import {
    ANIMATION_SPEED,
    HEADER_HEIGHT,
    SIDER_BAR_COLLAPSED_WIDTH,
    SIDER_BAR_WIDTH,
} from './constants'

export const LayoutStyled = styled(Layout)`
  position: relative;
  height: 100%;
  width: 100%;
  display: block;
`

export const Wrap = styled.div`
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

export const MainApp = styled.div`
  width: 100%;
  transition: width ${ANIMATION_SPEED}s;

  position: relative;
  overflow: hidden;
  padding-top: ${HEADER_HEIGHT / 10 + TAG_VIEW_HEIGHT / 10}rem;
`

export const FixedHeader = styled.div<{ $collapsed?: boolean }>`
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