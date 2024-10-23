import PageAnimation from '@components/animation/page'
import DashBoardContainer from '@containers/dashboard'
import React from 'react'

type DashboardPageProps = {}

const DashBoardPage: React.FC<React.PropsWithChildren<DashboardPageProps>> = () => {
  return (
    <PageAnimation>
      <DashBoardContainer />
    </PageAnimation>
  )
}

export default DashBoardPage