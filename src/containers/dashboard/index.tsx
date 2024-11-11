import React from 'react';
import { Wrap, Header, TableBox } from '../accountList/style';
import BarChart from './barchart'
import ListCard from './listCard';
const DashBoardContainer: React.FC = () => {
    return (
        <Wrap>
            <Header>
                <h2>Dash board</h2>
            </Header>
            <TableBox>
                <BarChart></BarChart>
                <ListCard></ListCard>
            </TableBox>
        </Wrap>
    );
};

export default DashBoardContainer;
