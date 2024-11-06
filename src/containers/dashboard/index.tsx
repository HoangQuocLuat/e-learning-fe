import React from 'react';
import { Wrap, Header, TableBox } from '../accountList/style';
import BarChart from './barchart'
const DashBoardContainer: React.FC = () => {
    return (
        <Wrap>
            <Header>
                <h2>Dash board</h2>
            </Header>
            <TableBox>
                <BarChart></BarChart>
            </TableBox>
        </Wrap>
    );
};

export default DashBoardContainer;
