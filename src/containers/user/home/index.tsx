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
            <div>
                <div>
                <div style = {{display: 'flex'}}>
                    <p>aaaa</p>
                    <p>aaaa</p>
                </div>
                    {/* <ContentStyle>
                        <img 
                            src="https://via.placeholder.com/800x300.png?text=Image+2" 
                            alt="Image 2" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    </ContentStyle> */}
                </div>
            </div>
            
            <EventPagination/>
            <InstructPagination/>
        </Wrap>
    );
}

export default HomeContainer;
