import { Layout, Menu, Avatar, Typography, Flex } from 'antd'
import { DashboardOutlined, ProjectOutlined, CheckSquareOutlined } from '@ant-design/icons'
import logoPic from '../assets/pic2.png'

const { Sider } = Layout
const { Text } = Typography

export default function Sidebar({ current, onMenuChange }) {
  const caidanXiang = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '工作台首页'
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: '项目管理'
    },
    {
      key: 'tasks',
      icon: <CheckSquareOutlined />,
      label: '任务管理'
    }
  ]

  const handleMenuClick = ({ key }) => {
    if (onMenuChange) {
      onMenuChange(key)
    }
  }

  return (
    <Sider className="zuocecaidan" width={220} theme="dark">
      <Flex className="caidanlogo" align="center">
        <Avatar
          className="logotupian"
          shape="square"
          size={40}
          src={logoPic}
          alt="USY logo"
        />
        <Text style={{ color: '#fff' }}>USY Studio</Text>
      </Flex>

      <Menu
        theme="dark"
        mode="inline"
        items={caidanXiang}
        selectedKeys={[current]}
        onClick={handleMenuClick}
      />
    </Sider>
  )
}
