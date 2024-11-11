import React from 'react';
import { Wrap, Header } from '../accountList/style';
import { Carousel, List } from 'antd';
import { ContentStyle } from './style';
import { flash } from 'react-animations'
import styled from 'styled-components';
import { keyframes } from 'styled-components';
const HomeContainer: React.FC = () => {
    const newsList = [
        {
            title: "Thông tin mới 1",
            date: "07-11-2024",
        },
        {
            title: "Thông tin mới 2",
            date: "06-11-2024",
        },
        {
            title: "Thông tin mới 3",
            date: "05-11-2024",
        },
    ];

    const guideList = [
        {
            title: "Hướng dẫn đóng tiền học phí trên ứng dụng",
            date: "07-11-2024",
        },
        {
            title: "Hướng dẫn xem lịch học",
            date: "06-11-2024",
        },
        {
            title: "Hướng dẫn tải hình ảnh khuôn mặt lên ứng dụng",
            date: "05-11-2024",
        },
    ];
    const FlashAnimation = keyframes`${flash}`;

const FlashingIcon = styled.div`
  display: inline-block;
  font-size: 10px;
  font-weight: bold;
  color: #ff0000;
  text-transform: uppercase;
  animation: 1s ${FlashAnimation} infinite;  // Tạo hoạt hình nhấp nháy liên tục
`;

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
            <div style={{ marginTop: '20px' }}>
                <h3 style={{ textAlign: 'center' }}>Thông tin mới</h3>
                <List
                    dataSource={newsList}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.title}
                                description={`Ngày đăng: ${item.date}`}
                            />
                            <FlashingIcon>New</FlashingIcon>
                        </List.Item>
                    )}
                />
            </div>
            <div style={{ marginTop: '20px' }}>
                <h3 style={{ textAlign: 'center' }}>Hướng dẫn</h3>
                <List
                    dataSource={guideList}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.title}
                                description={`Ngày cập nhật: ${item.date}`}
                            />
                            <FlashingIcon>New</FlashingIcon>
                        </List.Item>
                    )}
                />
            </div>
        </Wrap>
    );
}

export default HomeContainer;
