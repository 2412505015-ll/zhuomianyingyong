import { useState } from 'react'
import { Card, Empty, List, Button, Checkbox, Input, Space, Tag, Select, Progress, Typography, Flex } from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ProjectOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function Tasks({ projectList = [], onAddTask, onToggleTask, onDeleteTask }) {
  const [currentProjectId, setCurrentProjectId] = useState(projectList[0]?.id || '')
  const [taskInput, setTaskInput] = useState('')

  const currentProject =
    projectList.find((item) => item.id === currentProjectId) || projectList[0]
  const tasks = currentProject?.tasks || []
  const totalCount = tasks.length
  const completedCount = tasks.filter((task) => task.completed).length
  const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  const handleProjectChange = (value) => {
    setCurrentProjectId(value)
    setTaskInput('')
  }

  // 如果系统里面没有任何项目，友好提示先去创建
  if (!projectList.length || !currentProject) {
    return (
      <Flex vertical>
        <Title level={4} style={{ margin: 0 }}>
          任务管理清单
        </Title>
        <Empty
          style={{ marginTop: 60 }}
          description="系统暂无可用任务，请先前往左侧【项目管理】创建项目"
        />
      </Flex>
    )
  }

  const handleCreateTask = () => {
    const title = taskInput.trim()
    if (!title) return
    if (onAddTask) {
      onAddTask(currentProject.id, title)
    }
    setTaskInput('')
  }

  const handleToggle = (taskId) => {
    if (onToggleTask) {
      onToggleTask(currentProject.id, taskId)
    }
  }

  const handleDelete = (taskId) => {
    if (onDeleteTask) {
      onDeleteTask(currentProject.id, taskId)
    }
  }

  return (
    <Flex vertical>
      {/* 1. 顶部操作栏与项目选择器 */}
      <Flex
        justify="space-between"
        align="center"
        wrap
        gap={12}
        style={{ marginBottom: '20px' }}
      >
        <Flex vertical>
          <Title level={4} style={{ margin: 0 }}>
            任务管理清单
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            拆解实训阶段目标，标间完成情况并实时统计进度
          </Text>
        </Flex>
        {/* 项目下拉选择器 */}
        <Space>
          <Text style={{ fontSize: '14px', color: '#595959', fontWeight: 500 }}>
            <ProjectOutlined style={{ marginRight: 6 }} />
            切换所属项目:
          </Text>
          <Select
            value={currentProject.id}
            onChange={handleProjectChange}
            style={{ width: 260 }}
            options={projectList.map((item) => ({
              label: item.name,
              value: item.id
            }))}
          />
        </Space>
      </Flex>

      {/* 2. 当前选中项目的基本信息与实时进度看板 */}
      <Card
        style={{ marginBottom: '20px', background: '#fafafa', border: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: '20px' }}
      >
        <Flex
          justify="space-between"
          align="center"
          wrap
          gap={8}
          style={{ marginBottom: '12px' }}
        >
          <Space size={10} align="center">
            <Text strong style={{ fontSize: '16px' }}>
              {currentProject.name}
            </Text>
            <Tag color="blue">{currentProject.course}</Tag>
          </Space>
          <Space size={8} split={<Text type="secondary">|</Text>}>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              总任务: <Text strong>{totalCount}</Text> 项
            </Text>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              已完成:{' '}
              <Text strong style={{ color: '#52c41a' }}>
                {completedCount}
              </Text>{' '}
              项
            </Text>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              待推进:{' '}
              <Text strong style={{ color: '#faad14' }}>
                {totalCount - completedCount}
              </Text>{' '}
              项
            </Text>
          </Space>
        </Flex>
        <Progress
          percent={percent}
          status={percent >= 100 ? 'success' : 'active'}
          strokeColor={{ '0%': '#108ee9', '100%': '#52c41a' }}
        />
      </Card>

      {/* 3. 极简任务快速录入输入框 */}
      <Space.Compact style={{ width: '100%', marginBottom: '20px' }}>
        <Input
          size="large"
          placeholder="输入实训待办任务，例如：完成前端页面开发与组件封装（支持按 Enter 回车键添加）"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onPressEnter={handleCreateTask}
        />
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleCreateTask}>
          添加任务
        </Button>
      </Space.Compact>

      {/* 4. 任务清单列表 */}
      <Card title="实训待办任务列表" style={{ border: '1px solid #f0f0f0' }}>
        {tasks.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="当前项目还没有任何任务，快在上方输入框添加一个吧！"
          />
        ) : (
          <List
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item
                key={task.id}
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(task.id)}
                  >
                    删除
                  </Button>
                ]}
              >
                <Space size={12} align="center">
                  {/* 完成状态勾选框 */}
                  <Checkbox checked={task.completed} onChange={() => handleToggle(task.id)} />

                  {/* 任务名称（已完成添加横线划掉和灰色弱化） */}
                  <Text
                    style={{
                      fontSize: '14px',
                      color: task.completed ? '#8c8c8c' : '#262626',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      transition: 'all 0.25'
                    }}
                  >
                    {task.title}
                  </Text>

                  {/* 状态徽标 Tag */}
                  {task.completed ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      已完成
                    </Tag>
                  ) : (
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                      进行中
                    </Tag>
                  )}
                </Space>
              </List.Item>
            )}
          />
        )}
      </Card>
    </Flex>
  )
}
