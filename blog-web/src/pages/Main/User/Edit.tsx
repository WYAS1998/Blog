import style from './style.module.less'
import UploadImg from '../../../components/UploadImg'
import { Editor, Viewer } from '@bytemd/react'
// 引入中文包
import zhHans from 'bytemd/lib/locales/zh_Hans.json'
import highlight from '@bytemd/plugin-highlight-ssr'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import gemoji from '@bytemd/plugin-gemoji'
import gfm from '@bytemd/plugin-gfm'
// import ImgUrl from '../../../store'
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
  Row,
  Col,
} from 'antd'
import { useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { IArticle } from '../../../types'

const plugins = [gfm(), gemoji(), highlight(), mediumZoom()]
interface Article {
  article: IArticle
}
const CheckboxGroup = Checkbox.Group
const tag = ['小记', '影评', '书评', '学习', '代码']
export default function Edit() {
  let history = useHistory<Article>()
  let article = history.location.state
  // 存放编辑文章的state
  const [editArticle, setEditArticle] = useState({
    _id: history.location.state.article._id,
    title: history.location.state.article.title,
    subTitle: history.location.state.article.subTitle,
    tags: history.location.state.article.tags.split(','),
    content: history.location.state.article.content,
    banner: history.location.state.article.banner,
  })
  const [newContent, setNewContent] = useState(
    history.location.state.article.content,
  )
  const { Header, Footer, Sider, Content } = Layout
  async function handleEditArticle(value: IArticle) {
    value._id = editArticle._id
    // value.banner = ImgUrl.imgUrl
    value.content = newContent
    if (value.content === '') {
      message.warning('文章内容不能为空！')
    } else {
      let res = await api.editArticle(value)
      if (res.stat === 'ok') {
        message.success('修改成功')
        // ImgUrl.setImgUrl('')
        history.push('/main/user')
      }
    }
  }
  // 仅在挂载和卸载时执行，
  useEffect(() => {
    // getUserInfo()
    // loadOwnerArticle()
  }, [])

  return (
    <>
      <Content className={style.mainContent}>
        <div className={style.editArticle}>
          <h2>编辑文章</h2>
        </div>
        {/* <Button
          type="primary"
          onClick={() => {
            console.log('修改')
          }}>
          提交编辑
        </Button>
        <Button
          style={{ marginLeft: 10 }}
          onClick={() => {
            console.log('退出修改')
          }}>
          退出编辑
        </Button> */}
        <Form
          initialValues={{
            tags: editArticle.tags,
            title: editArticle.title,
            subTitle: editArticle.subTitle,
          }} // 设置 标签多选框的值
          onFinish={handleEditArticle}
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
          {/* <Form.Item
            name="tags"
            label="标签"
            rules={[
              {
                required: true,
                message: '至少选择一个标签!',
              },
            ]}></Form.Item> */}

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
              // value={editArticle.tags}
              onChange={(e) => {
                // console.log(e)
              }}
            />
          </Form.Item>
          <Form.Item>
            <Editor
              // 语言
              locale={zhHans}
              // 内部的值
              value={newContent}
              // 插件
              plugins={plugins}
              // 动态修改值
              onChange={(v) => {
                setNewContent(v)
              }}
            />
          </Form.Item>
          <Form.Item>
            <div className={style.oldImg}>
              {/* <Form.Item
                name="banner"
                label="图片"
                rules={[{ required: false }]}>
                <UploadImg></UploadImg>
              </Form.Item> */}
              <img style={{ width: 500 }} src={editArticle.banner} />
            </div>
          </Form.Item>
          {/* <Form.Item name="banner" label="图片" rules={[{ required: false }]}>
            <UploadImg></UploadImg>
          </Form.Item> */}
          <Form.Item noStyle={true}>
            <div>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button
                type="dashed"
                onClick={() => {
                  history.push('/main/user')
                }}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Content>
    </>
  )
}
