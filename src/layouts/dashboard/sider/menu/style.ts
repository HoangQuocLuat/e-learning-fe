import styled from 'styled-components'
import { Menu as MenuAntd } from 'antd'

export const MenuStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f8f9fa;
  .ant-menu {
    background-color: rgba(48, 65, 86, 0.5);
    .ant-menu-submenu-open {
      background-color: #263445 !important;
      border-radius: 0;
    }

    .ant-menu-sub {
      background-color: #1f2d3d !important;
    }

    .ant-layout-sider-children {
      width: 100%;
    }
  }
`
export const Header = styled.div`
  height: 8rem;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  gap: 1rem;
  font-size: 2rem;
`
export const BoxUser = styled.div`
  display: flex;
  gap: 1.5rem;
  background-color: #ffffff;
  margin: 2rem;
  padding: 1.6rem 1rem;
  border-radius: 0.8rem;
  border: 1px solid #f3f4f6;
`

export const MenuAntdStyle = styled(MenuAntd)`
  background-color: #f8f9fa;
  .ant-menu-item {
    color: #3154a0;
    font-weight: bold;
  }
  .ant-menu-item-selected {
    background-color: #3154a0;
    color: #ffffff;
  }
`
