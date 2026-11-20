import { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Space,
  Empty,
  Popconfirm,
  message
} from 'antd'
import {
  PlusOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'

// 项目管理页组件（第六课：补齐项目编辑与删除功能）
export default function Projects({
  projectList = [],
  onAddProject,
  onUpdateProject,
  onDeleteProject
}) {
  // 控制“新建 / 编辑项目”弹窗的显示与隐藏
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 当前正在编辑的项目（为 null 表示“新建”模式）
  const [editingProject, setEditingProject] = useState(null)

  // Ant Design 表单实例（用于手动重置与回填表单字段）
  const [form] = Form.useForm()

  // 点击“新建项目”按钮
  const handleOpenModal = () => {
    setEditingProject(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  // 点击“编辑”按钮，回填当前项目数据
  const handleEditProject = (item) => {
    console.log('-------', '点击编辑项目：', item)
    setEditingProject(item)
    form.setFieldsValue({
      name: item.name,
      course: item.course,
      folderPath:
        item.folderPath && item.folderPath !== '待关联本地文件夹' ? item.folderPath : '',
      description: item.description === '暂无简介描述' ? '' : item.description
    })
    setIsModalOpen(true)
  }

  // 删除项目（二次确认后回调父组件）
  const handleDeleteProject = (item) => {
    console.log('-------', '删除项目：', item.id)
    if (onDeleteProject) {
      onDeleteProject(item.id)
    }
    message.success(`项目「${item.name}」已删除`)
  }

  // 取消关闭弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    form.resetFields()
  }

  // 调用 Electron 原生窗口选择本地文件夹
  const handleXuanzeMulu = async () => {
    if (!window.api?.selectFolder) {
      message.warning('当前环境不支持原生文件夹选择')
      return
    }
    const xuanzhongLujing = await window.api.selectFolder()
    console.log('+++++++', '选择本地项目文件夹返回：', xuanzhongLujing)
    if (xuanzhongLujing) {
      form.setFieldsValue({ folderPath: xuanzhongLujing })
    }
  }

  // 调用 Electron 在 Windows 资源管理器中打开项目目录
  const handleDakaiMulu = async (mubiaoLujing) => {
    console.log('*-*-*-*', '点击打开本地项目目录：', mubiaoLujing)
    if (!window.api?.openFolder) {
      message.warning('当前环境不支持打开本地目录')
      return
    }
    const jieguo = await window.api.openFolder(mubiaoLujing)
    if (!jieguo?.success) {
      message.warning(jieguo?.message || '打开目录失败，请检查文件夹路径是否存在')
    }
  }

  // 弹窗表单校验通过，点击“确定”提交（新建 / 编辑两种模式）
  const handleFormFinish = (values) => {
    console.log('-------', '项目表单数据：', values)

    const muluLujing = values.folderPath ? values.folderPath.trim() : ''
    const biaodanShuju = {
      name: values.name,
      course: values.course,
      description: values.description || '暂无简介描述',
      folderPath: muluLujing || '待关联本地文件夹'
    }

    if (editingProject) {
      // 编辑模式：保留原有 id、创建时间与任务列表
      if (onUpdateProject) {
        onUpdateProject({ ...editingProject, ...biaodanShuju })
      }
      message.success('项目信息已更新')
    } else {
      // 新建模式：组装新项目数据对象
      const newProject = {
        id: `p_${Date.now()}`,
        ...biaodanShuju,
        createdAt: new Date().toISOString().split('T')[0]
      }
      if (onAddProject) {
        onAddProject(newProject)
      }
    }

    // 关闭弹窗并清空输入框
    setIsModalOpen(false)
    setEditingProject(null)
    form.resetFields()
  }

  return (
    <div className="xiangmuguanli">
      {/* 1. 顶部操作栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>我的教学项目</h2>
          <span style={{ color: '#8c8c8c', fontSize: '13px' }}>
            共管理 {projectList.length} 个进行中的实训项目
          </span>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
          新建项目
        </Button>
      </div>

      {/* 2. 项目卡片网格列表（无数据时展示友好空状态引导） */}
      {projectList.length === 0 ? (
        <Empty
          style={{ marginTop: 60 }}
          description="暂无教学实训项目，点击右上角「新建项目」创建第一个项目！"
        />
      ) : (
        <Row gutter={[16, 16]}>
          {projectList.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card
                hoverable
                title={<span style={{ fontWeight: 'bold' }}>{item.name}</span>}
                extra={<Tag color="blue">{item.course}</Tag>}
                style={{ height: '100%' }}
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditProject(item)}
                  >
                    编辑
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="确认删除该项目？"
                    description="删除后，该项目下的所有任务也会一并移除"
                    okText="删除"
                    okButtonProps={{ danger: true }}
                    cancelText="取消"
                    onConfirm={() => handleDeleteProject(item)}
                  >
                    <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>
                ]}
              >
                {/* 项目简介 */}
                <p
                  style={{
                    color: '#595959',
                    minHeight: '42px',
                    lineHeight: '21px',
                    margin: '0 0 12px 0'
                  }}
                >
                  {item.description}
                </p>

                {/* 本地目录展示与一键打开按钮 */}
                <div
                  className="xiangmumuluqu"
                  style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      overflow: 'hidden',
                      flex: 1
                    }}
                  >
                    <FolderOutlined />
                    <span
                      title={item.folderPath}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.folderPath}
                    </span>
                  </div>

                  <Button
                    type="link"
                    size="small"
                    icon={<FolderOpenOutlined />}
                    onClick={() => handleDakaiMulu(item.folderPath)}
                    style={{ padding: '0 4px', flexShrink: 0 }}
                  >
                    打开目录
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 3. 新建 / 编辑项目 Modal 对话框 */}
      <Modal
        title={editingProject ? '编辑教学实训项目' : '新建教学实训项目'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingProject ? '保存' : '创建'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: '请输入项目名称！' }]}
          >
            <Input placeholder="例如：金融数据上链存证系统" />
          </Form.Item>

          <Form.Item
            label="所属课程"
            name="course"
            rules={[{ required: true, message: '请输入所属课程名称！' }]}
          >
            <Input placeholder="例如：区块链技术原理及应用" />
          </Form.Item>

          <Form.Item label="本地项目目录">
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="folderPath" noStyle>
                <Input placeholder="请点击右侧按钮选择项目文件夹（选填）" />
              </Form.Item>
              <Button icon={<FolderOpenOutlined />} onClick={handleXuanzeMulu}>
                选择文件夹
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item label="项目简介" name="description">
            <Input.TextArea
              rows={3}
              placeholder="简要描述项目的核心目标、技术栈或成果要求（选填）"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
