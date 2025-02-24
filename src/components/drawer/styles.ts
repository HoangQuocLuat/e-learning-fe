import { Drawer } from 'antd'
import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Title = styled.h1`
  font-size: 2.4rem;
  color: #3154a0;
  font-weight: bold;
`
export const DrawerStyle1 = styled(Drawer)`
  .ant-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ant-drawer-title {
    order: -1;
    margin-right: auto;
  }
`
