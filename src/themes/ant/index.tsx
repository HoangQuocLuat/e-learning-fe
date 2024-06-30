import { App, ConfigProvider } from 'antd'
import React from 'react'
import { StyleProvider, px2remTransformer } from '@ant-design/cssinjs'
import { useTheme } from 'styled-components'

type AntDesignProviderProps = {
  children?: React.ReactNode
}

const px2rem = px2remTransformer({
  rootValue: 10,
})

const AntDesignProvider: React.FC<AntDesignProviderProps> = ({ children }) => {

  const theme = useTheme()

  return (
    <StyleProvider transformers={[px2rem]}>
      <App>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: theme.colors?.primary_1,
              fontFamily: 'Quicksand',
            },
            components: {
              Button: {
                primaryShadow: 'unset',
              },
            },
            hashed: true,
          }}
        >
          {children}
        </ConfigProvider>
      </App>
    </StyleProvider>
  )
}

export default AntDesignProvider
