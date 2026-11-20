import { Row, Col, Card, Statistic, Progress, List, Tag, Empty, Button, Typography, Space, Flex } from 'antd'
import {
  ProjectOutlined,
  CheckSquareOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FolderOutlined,
  RightOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function Dashboard({ projectList = [], onMenuChange }) {
  const totalProjects = projectList.length
  const allTasks = projectList.flatMap((project) =>
    (project.tasks || []).map((task) => ({
      ...task,
      projectId: project.id,
      projectName: project.name
    }))
  )
  const totalTasks = allTasks.length
  const completedCount = allTasks.filter((task) => task.completed).length
  const pendingCount = totalTasks - completedCount
  const percent = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0

  const recentProjects = projectList.slice(0, 3)
  const pendingTasks = allTasks.filter((task) => !task.completed).slice(0, 5)

  const jumpTo = (key) => {
    if (onMenuChange) {
      onMenuChange(key)
    }
  }

  return (
    <Flex vertical>
      {/* 1. 页面标题与欢迎语 */}
      <Flex vertical style={{ marginBottom: '20px' }}>
        <Title level={4} style={{ margin: 0 }}>
          工作台首页
        </Title>
        <Text type="secondary">欢迎回来，这里是你的教学项目与实训任务总览</Text>
      </Flex>

      {/* 2. 核心数据指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={12} lg={6}>
          <Card hoverable bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="教学项目总数"
              value={totalProjects}
              suffix="个"
              prefix={<ProjectOutlined style={{ color: '#1677ff' }} />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card hoverable bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="实训任务总数"
              value={totalTasks}
              suffix="项"
              prefix={<CheckSquareOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card hoverable bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="已完成任务"
              value={completedCount}
              suffix="项"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card hoverable bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="待推进任务"
              value={pendingCount}
              suffix="项"
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 3. 整体进度 + 最近项目 */}
        <Col xs={24} lg={14}>
          <Card title="整体实训进度" style={{ marginBottom: '16px' }}>
            <Flex align="center" gap={24} wrap>
              <Progress
                type="dashboard"
                percent={percent}
                strokeColor={{ '0%': '#108ee9', '100%': '#52c41a' }}
              />
              <Space direction="vertical" size={2}>
                <Text type="secondary">
                  共 <Text strong>{totalTasks}</Text> 项任务
                </Text>
                <Text type="secondary">
                  已完成{' '}
                  <Text strong style={{ color: '#52c41a' }}>
                    {completedCount}
                  </Text>{' '}
                  项
                </Text>
                <Text type="secondary">
                  待推进{' '}
                  <Text strong style={{ color: '#faad14' }}>
                    {pendingCount}
                  </Text>{' '}
                  项
                </Text>
              </Space>
            </Flex>
          </Card>

          <Card
            title="最近项目"
            extra={
              <Button type="link" size="small" onClick={() => jumpTo('projects')}>
                查看全部 <RightOutlined />
              </Button>
            }
          >
            {recentProjects.length ? (
              <List
                dataSource={recentProjects}
                renderItem={(project) => {
                  const tasks = project.tasks || []
                  const done = tasks.filter((task) => task.completed).length
                  const projectPercent = tasks.length ? Math.round((done / tasks.length) * 100) : 0
                  return (
                    <List.Item>
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Space size={8} align="center">
                          <Text strong>{project.name}</Text>
                          <Tag color="blue">{project.course}</Tag>
                        </Space>
                        <Space size={6} align="center">
                          <FolderOutlined style={{ color: '#8c8c8c' }} />
                          <Text type="secondary" style={{ fontSize: 12, maxWidth: 340 }} ellipsis>
                            {project.folderPath}
                          </Text>
                        </Space>
                        <Progress percent={projectPercent} size="small" />
                      </Space>
                    </List.Item>
                  )
                }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无项目，请先前往【项目管理】创建"
              />
            )}
          </Card>
        </Col>

        {/* 4. 待推进任务 */}
        <Col xs={24} lg={10}>
          <Card
            title="待推进任务"
            extra={
              <Button type="link" size="small" onClick={() => jumpTo('tasks')}>
                去处理 <RightOutlined />
              </Button>
            }
          >
            {pendingTasks.length ? (
              <List
                dataSource={pendingTasks}
                renderItem={(task) => (
                  <List.Item>
                    <Space direction="vertical" size={0}>
                      <Text>{task.title}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {task.projectName}
                      </Text>
                    </Space>
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                      进行中
                    </Tag>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="没有待推进的任务，继续保持"
              />
            )}
          </Card>
        </Col>
      </Row>
    </Flex>
  )
}
