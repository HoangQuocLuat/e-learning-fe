import { Wrap } from '../../accountList/style';
import { Header } from './style.ts'
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button} from 'antd';
type ProfileContainerProps = {}
const ProfileContainer: React.FC<React.PropsWithChildren<ProfileContainerProps>> = () => { 
    return (
        <Wrap>
          <Header>
            <Avatar size={120} icon={<UserOutlined />} />
            <Button
              icon={<EditOutlined style={{ fontSize: '20px' }} />} // Tăng kích thước icon
              style={{ border: 'none', padding: '10px', fontSize: '20px' }} // Tăng kích thước tổng thể của button
              // onClick={() => {console.log(record); drawerRef.current?.open(record)}}
            >
              Edit
            </Button>
          </Header>
        </Wrap>
      )
}

export default ProfileContainer