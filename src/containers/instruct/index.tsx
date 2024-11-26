import React, { useCallback, useRef, useState } from 'react';
import { Button, Space, TableProps, notification, Table } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Buttons, Header, TableBox, Wrap, TableData, BoxAction } from './style';
import { Instruct } from '@models/instruct';
import { instructPagination } from '@graphql/query/admin/instruct-pagination';
import { Pagination } from '@models/pagination';
import { useMounted } from '@hooks/lifecycle';
import { usePushShallowRoute } from '@hooks/router';
import { useParams } from 'react-router-dom';
import ButtonDelete from './button-delete';
import DrawersInstruct, { DrawerInstructMethods } from './drawerInstruct';
// import SearchInstruct from './search-instruct';

type FetchParams = {
  page?: number;
  limit?: number;
  search?: Record<string, any>;
};

export type InputSearch = {
  instruct_name: string;
  location: string;
};

const ListInstruct: React.FC = () => {
  const drawerRef = useRef<DrawerInstructMethods>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [instructData, setInstructData] = useState<Instruct[]>([]);
  const [page, setPage] = useState<Pagination>(Pagination.default);
  const onPushShallow = usePushShallowRoute();
  const params = useParams<{ page: string; limit: string }>();
  const paramsRef = useRef(params);

  const fetch = useCallback(({ page, limit, search }: FetchParams) => {
    setLoading(true);
    instructPagination({ page, limit, search })
      .then(rInstruct => {
        if (rInstruct.success) {
          setLoading(false);
          setInstructData(rInstruct.data ?? []);
          setPage(rInstruct.paging!);
        }
      })
      .catch(() => {
        setLoading(false);
        notification.error({ message: 'Có lỗi xảy ra!' });
      });
  }, []);

  const onSearch = (input: InputSearch) => {
    const { instruct_name, location } = input;
    const searchParams: Record<string, any> = {};
    if (instruct_name) searchParams.instruct_name = instruct_name;
    if (location) searchParams.location = location;

    onPushShallow({ page: 1, limit: page.limit, ...searchParams });
    fetch({ page: 1, limit: page.limit, search: searchParams });
  };

  useMounted(() => fetch({ page: 1, limit: page.limit }));

  const columns: TableProps<Instruct>['columns'] = [
    {
      title: 'Tên hướng dẫn',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Chi tiết hướng dẫn',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => drawerRef.current?.open(record)}
            style={{ border: 'none' }}
          />
          <ButtonDelete
            record={record}
            fetchEntry={() => fetch({ page: page.current, limit: page.limit })}
          />
        </Space>
      ),
    },
  ];

  return (
    <Wrap>
      <Header>
        {/* <SearchInstruct onSearch={onSearch} /> */}
        <BoxAction>
          <Buttons icon={<PlusOutlined />} onClick={() => drawerRef.current?.open()}>
            Thêm hướng dẫn
          </Buttons>
        </BoxAction>
      </Header>
      <TableBox>
        {
          <TableData
            // @ts-ignore
            columns={columns}
            loading={loading}
            rowKey={record => record?.id ?? ''}
            dataSource={instructData}
            scroll={{ x: 600 }}
            pagination={{
              pageSize: page.limit ?? 10,
              current: page.current > 0 ? page.current : 1,
              total: page.total,
              onChange: (newPage, pageSize) => {
                onPushShallow({ page: newPage, limit: pageSize, ...paramsRef.current });
                fetch({ page: newPage, limit: pageSize });
              },
            }}
          />
        }
        <DrawersInstruct
          ref={drawerRef}
          onInstructSuccess={() => fetch({ page: 1, limit: page.limit })}
          onInstructUpdateSuccess={() =>
            fetch({
              page: page.current,
              limit: page.limit,
            })
          }
        />
      </TableBox>
    </Wrap>
  );
};

export default ListInstruct;
