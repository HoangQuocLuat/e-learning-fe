import React from 'react';
import { Wrap, Header } from '../../accountList/style';
import EventPagination from './event-pagination'
import InstructPagination from './instruct-pagination'
const HomeContainer: React.FC = () => {

    return (
        <Wrap>
            <Header>
                <h2>Trang chủ</h2>
            </Header>
            
            <EventPagination/>
            <InstructPagination/>
        </Wrap>
    );
}

export default HomeContainer;
