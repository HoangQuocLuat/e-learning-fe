import React, { useCallback, useState, useRef } from 'react';
import { notification, List } from 'antd';
import { instructPagination } from '@graphql/query/user/instruct-pagination';
import { Pagination } from '@models/pagination';
import { useMounted } from '@hooks/lifecycle';
import { Instruct } from '@models/instruct';
import styled from 'styled-components';
import { flash } from 'react-animations';
import { keyframes } from 'styled-components';
import { Wrap, Header } from '../../../accountList/style';
import { usePushShallowRoute } from '@hooks/router';
import { useParams } from 'react-router-dom';

type FetchParams = {
  page?: number;
  limit?: number;
  search?: Record<string, any>;
};

const FlashAnimation = keyframes`${flash}`;
const FlashingIcon = styled.div`
  display: inline-block;
  font-size: 10px;
  font-weight: bold;
  color: #ff0000;
  text-transform: uppercase;
  animation: 1s ${FlashAnimation} infinite; // Tạo hoạt hình nhấp nháy liên tục
`;

const InstructPagination: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [instructData, setInstructData] = useState<Instruct[]>([]);
  const [page, setPage] = useState<Pagination>(Pagination.default);
  const onPushShallow = usePushShallowRoute();
  const params = useParams<{ page: string; limit: string }>();
  const paramsRef = useRef(params);

  const fetch = useCallback(({ page, limit, search }: FetchParams) => {
    setLoading(true);
    instructPagination({ page, limit, search })
      .then(r => {
        if (r.success) {
          setLoading(false);
          setInstructData(r.data ?? []); // Lưu dữ liệu vào trạng thái
          setPage(r.paging!); // Cập nhật trang
        }
      })
      .catch(() => {
        setLoading(false);
        notification.error({ message: 'Có lỗi xảy ra!' });
      });
  }, []);

  useMounted(() => fetch({ page: 1, limit: 3 })); // Đặt limit mặc định là 3 khi lần đầu tiên fetch

  return (
    <Wrap>
      <Header style={{ display: 'flex', justifyContent: 'center' }}>
        <h2>Bài viết hướng dẫn sử dụng</h2>
      </Header>
      <List
        loading={loading}
        pagination={{
          pageSize: 3, // Đảm bảo mỗi trang có 3 mục
          current: page.current > 0 ? page.current : 1, // Trang hiện tại
          total: page.total, // Tổng số mục
          onChange: (newPage, pageSize) => {
            onPushShallow({
              ...paramsRef.current,
              page: newPage,
              limit: pageSize,
            });
            fetch({
              page: newPage,
              limit: pageSize, // Sử dụng pageSize ở đây
            });
          },
        }}
        dataSource={instructData} // Dữ liệu lấy từ API
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{item.title}</span>
                  <FlashingIcon style={{ marginLeft: '8px' }}>New</FlashingIcon>
                </div>
              }
              description={`Ngày đăng: ${item.date}`}
            />
          </List.Item>
        )}
      />
    </Wrap>
  );
};

export default InstructPagination;
