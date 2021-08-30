import style from './style.module.less'
import UploadImg from '../../../components/UploadImg'
import userCenterVisible from '../../../userCenterVisible'
import { Editor, Viewer } from '@bytemd/react'
// 引入中文包
import zhHans from 'bytemd/lib/locales/zh_Hans.json'
import gfm from '@bytemd/plugin-gfm'
import gemoji from '@bytemd/plugin-gemoji'
import highlight from '@bytemd/plugin-highlight-ssr'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import 'bytemd/dist/index.min.css'
import 'highlight.js/styles/vs.css'
import ImgUrl from '../../../store'
import * as api from '../../../services/api'
import {
  Button,
  Input,
  Layout,
  Table,
  Space,
  Modal,
  Form,
  Checkbox,
  message,
  Pagination,
  Avatar,
} from 'antd'
import { useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { IArticle } from '../../../types'
import avatarNone from '../../../assets/imgs/avatar-none.png'

const plugins = [gfm(), gemoji(), highlight(), mediumZoom()]
const CheckboxGroup = Checkbox.Group

export default function User() {
  let history = useHistory()
  const { Header, Footer, Sider, Content } = Layout
  // const [userCenterVisible, setUserCenterVisible] = useState(false) // 用户中心的可见性
  const [addOwnerArticleVisible, setAddOwnerArticleVisible] = useState(false) // 添加文章modal的可见性
  const [deleteModalVisible, setDeleteModalVisible] = useState(false) // 删除文章modal的可见性
  const [tableVisible, setTableVisible] = useState(false) // 删除文章modal的可见性
  const [total, setTotal] = useState(10)
  // 加载个人文章的state
  const [ownerArticle, setOwnerArticle] = useState([
    {
      _id: '',
      title: '',
      subTitle: '',
      content: '',
      tags: '',
      banner: '',
      ctime: '',
      preview: 0,
    },
  ])
  // 被删除文章的state
  const [currenArticle, setCurrenArticle] = useState({
    _id: '',
    title: '',
    subTitle: '',
    content: '',
    tags: '',
    banner: '',
    ctime: '',
    preview: 0,
  })
  const tag = ['小记', '影评', '书评', '学习', '代码']
  //添加文章时的state
  const [article, setArticle] = useState({
    title: '',
    subTitle: '',
    content: '',
    tags: [''],
  })
  // 个人信息的state
  const [userinfo, setUserinfo] = useState({
    username: '',
    avatar: '',
    nickname: '',
  })
  //查询个人文章时的分页索引
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    keyword: '',
  })
  const columns = [
    {
      title: '封面',
      dataIndex: 'banner',
      key: 'banner',
      align: 'center' as 'center',
      width: 140,
      render: (value: string) => <Avatar size={64} src={value} />,
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '副标题',
      dataIndex: 'subTitle',
      key: 'subTitle',
      width: 200,
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      ellipsis: true,
    },
    {
      title: '发布日期',
      dataIndex: 'ctime',
      key: 'ctime',
      align: 'center' as 'center',
      width: 140,
      render: (text: string, article: IArticle) => {
        return moment(article.ctime).format('YYYY-MM-DD')
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center' as 'center',
      render: (text: string, article: IArticle) => (
        <Space size="large">
          <Button
            type="primary"
            onClick={() => history.push('/main/user/edit', { article })}>
            编辑
          </Button>
          <Button
            type="default"
            danger
            onClick={() => {
              setDeleteModalVisible(true)
              setCurrenArticle({ ...currenArticle, _id: article._id })
            }}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
  // 检查用户是否登录，禁止未登录进入Main页面
  async function getUserInfo() {
    let result = await api.userInfo()
    if (result.stat === 'ok') {
      if (result.data.avatar === '') {
        setUserinfo({
          ...userinfo,
          username: result.data.account,
          nickname: result.data.nickname,
          avatar: avatarNone,
        })
      } else {
        setUserinfo({
          ...userinfo,
          username: result.data.account,
          nickname: result.data.nickname,
          avatar: result.data.avatar,
        })
      }
    } else {
      message.warning('请先登录')
      history.push('/login')
    }
  }
  // 加载个人文章
  async function loadOwnerArticle() {
    let res = await api.searchOwner(pagination)
    if (res.stat === 'ok') {
      setTotal(res.data.total)
      if (res.data.items.length === 0) {
        message.warning('没有个人文章哦！')
        setTableVisible(false)
      } else {
        setOwnerArticle(res.data.items)
        setTableVisible(true)
      }
    }
  }
  // 仅在挂载和卸载时执行，
  useEffect(() => {
    getUserInfo()
    // loadOwnerArticle()
  }, [])

  // 添加、删除文章时，更新个人文章列表
  useEffect(() => {}, [ownerArticle])

  // 翻页时，更新个人文章列表
  useEffect(() => {
    loadOwnerArticle()
  }, [pagination])
  // 添加文章
  async function handleAddArticle(value: IArticle) {
    value.banner = ImgUrl.imgUrl
    value.content = article.content
    if (value.content === '') {
      message.warning('文章内容不能为空！')
    } else {
      let res = await api.addArticle(value)
      if (res.stat === 'ok') {
        message.success('添加成功')
        setAddOwnerArticleVisible(false)
        setArticle({
          ...article,
          title: '',
          subTitle: '',
          content: '',
          tags: [''],
        })
        ImgUrl.setImgUrl('')
        loadOwnerArticle()
      }
    }
  }
  // 删除文章
  async function handleDelete() {
    let res = await api.deleteArticle(currenArticle)
    if (res.stat === 'ok') {
      message.success('删除成功')
      loadOwnerArticle()
      setDeleteModalVisible(false)
    }
  }

  function pageChange(page: number) {
    setPagination({ ...pagination, pageIndex: page })
  }

  return (
    <>
      <Content className={style.mainContent}>
        <div className={style.articleList}>
          <div className={style.ownerArticle}>
            <div className={style.myArticle}>
              <h2>我的文章</h2>
            </div>
            <Button
              type="default"
              onClick={() => {
                userCenterVisible.setUserCenterVisible(false)
                history.push('/main')
              }}>
              发现广场
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              type="primary"
              onClick={() => {
                setAddOwnerArticleVisible(true)
              }}>
              添加文章
            </Button>
            {tableVisible && (
              <Table
                style={{ marginTop: 10 }}
                pagination={{
                  hideOnSinglePage: true,
                  position: ['bottomCenter'],
                }}
                columns={columns}
                dataSource={ownerArticle}
                rowKey={'_id'}></Table>
            )}
            {tableVisible && (
              <div className={style.pagination}>
                <Pagination
                  defaultCurrent={pagination.pageIndex}
                  onChange={pageChange}
                  pageSize={10}
                  total={total}
                  showSizeChanger={false}
                />
              </div>
            )}
            <Modal
              title="删除个人文章"
              visible={deleteModalVisible}
              onOk={handleDelete}
              onCancel={() => {
                setDeleteModalVisible(false)
              }}
              closable={false}
              okText="确认"
              cancelText="取消">
              <p>确定删除该文章？</p>
            </Modal>
          </div>

          <Modal
            width={1500}
            title="添加文章"
            visible={addOwnerArticleVisible}
            footer={null}
            closable={false}
            destroyOnClose={true}
            maskClosable={true}>
            <Form
              onFinish={handleAddArticle}
              preserve={false}
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 40 }}>
              <Form.Item
                name="title"
                label="文章标题"
                rules={[
                  {
                    required: true,
                    message: '文章标题不能为空!',
                  },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item
                name="subTitle"
                label="副标题"
                rules={[
                  {
                    required: true,
                    message: '副标题不能为空!',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="tags"
                label="标签"
                rules={[
                  {
                    required: true,
                    message: '至少选择一个标签!',
                  },
                ]}>
                <CheckboxGroup
                  options={tag}
                  onChange={(e) => {
                    // console.log(e)
                  }}
                />
              </Form.Item>
              <Editor
                // 语言
                locale={zhHans}
                // 内部的值
                value={article.content}
                // 插件
                plugins={plugins}
                // 动态修改值
                onChange={(v) => {
                  setArticle({ ...article, content: v })
                }}
              />
              <Form.Item
                name="banner"
                label="图片"
                rules={[{ required: false }]}>
                <UploadImg></UploadImg>
              </Form.Item>
              <Form.Item noStyle={true}>
                <div>
                  <Button type="primary" htmlType="submit">
                    确定
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => {
                      setArticle({ ...article, content: '' })
                      setAddOwnerArticleVisible(false)
                    }}>
                    取消
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
    </>
  )
}
