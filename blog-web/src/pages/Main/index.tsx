import style from './style.module.less'
import UploadImg from '../../components/UploadImg'
import ImgUrl from '../../store'
import userCenterVisible from '../../userCenterVisible'
import User from './User'
import Article from './Article'
import Details from './Article/Details'
import cookie from 'react-cookies'
import Edit from './User/Edit'
import * as api from '../../services/api'
import { Button, Input, Layout, Modal, Form, message, Avatar } from 'antd'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'
import avatarNone from '../../assets/imgs/avatar-none.png'

interface UpdataInfo {
  avatar: string
  nickname: string
}
interface UpdataPwd {
  oldPwd: string
  newPwd: string
}

export default function Main() {
  let history = useHistory()
  const { Header, Footer, Sider, Content } = Layout
  // const [userCenterVisible, setUserCenterVisible] = useState(false) // 用户中心的可见性
  const [editUserinfoVisible, setEditUserinfoVisible] = useState(false) // 修改信息modal的可见性
  const [editUserPwdVisible, setEditUserPwdVisible] = useState(false) // 修改密码modal的可见性
  // 个人信息的state
  const [userinfo, setUserinfo] = useState({
    username: '',
    avatar: '',
    nickname: '',
  })
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
  // 仅在挂载和卸载时执行，
  useEffect(() => {
    getUserInfo()
  }, [])
  // 头像点击事件：进入个人中心
  async function intoUserInfo() {
    userCenterVisible.setUserCenterVisible(true)
    history.push('/main/user')
    // if (userCenterVisible) {
    //   setUserCenterVisible(false)
    //   history.push('/main')
    // } else {
    //   setUserCenterVisible(true)
    //   history.push('/main/user')
    // }
  }
  // 修改个人信息
  async function handleEditUserinfo(values: UpdataInfo) {
    values.avatar = ImgUrl.imgUrl
    let res = await api.updateUserInfo(values)
    if (res.stat === 'ok') {
      message.success('个人信息修改成功')
      setEditUserinfoVisible(false)
      setUserinfo({
        ...userinfo,
        nickname: values.nickname,
        avatar: values.avatar,
      })
    }
  }
  //编辑密码
  async function handleEditPwd(values: UpdataPwd) {
    let res = await api.updatePwd(values)
    // console.log(userinfo.username);
    cookie.remove(userinfo.username)
    if (res.stat === 'ok') {
      message.success('密码修改成功')
      setEditUserPwdVisible(false)
      message.warning('密码已修改，请重新登录')
      history.push('/login')
    }
    if (res.stat === 'Err_Pwd_Not_Right') {
      message.warning('旧密码错误')
    }
  }
  // 退出登录
  async function logout() {
    let res = await api.logout()
    if (res.stat === 'ok') {
      message.success('您已退出')
      history.push('/login')
    }
    if (res.stat === 'Err_Token_Not_Found') {
      message.warning('未找到用户信息，请先登录')
      history.push('/login')
    }
  }

  return (
    <>
      <Layout>
        <Header className={style.mainHeader}>
          <div className={style.headerTitle}>
            {/* <h1>简笔话</h1> */}
            简笔话
          </div>
          <Button
            size="large"
            type="dashed"
            onClick={() => {
              logout()
            }}>
            退出登录
          </Button>
        </Header>
        <Layout>
          <Sider width={300} className={style.antdSider}>
            <div className={style.userInfoDiv}>
              <div className={style.userInfo}>
                <div className={style.avatarImgDiv}>
                <Avatar size={150} src={userinfo.avatar} />
                  {/* <img className={style.avatarImg}  /> */}
                </div>
                <div className={style.username}>{userinfo.username}</div>
                <Button type="primary" onClick={intoUserInfo}>
                  个人中心
                </Button>
              </div>
              {userCenterVisible.userCenterVisible && (
                <div className={style.userCenter}>
                  <div className={style.userNickname}>
                    昵称：{userinfo.nickname}
                  </div>
                  <div className={style.EditBtnDiv}>
                    <Button onClick={() => setEditUserinfoVisible(true)}>
                      修改个人信息
                    </Button>
                    <Button onClick={() => setEditUserPwdVisible(true)}>
                      修改密码
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Sider>
          <Content
            style={{ overflow: 'auto', backgroundColor: 'white', padding: 10 }}>
            <Modal
              title="修改个人信息"
              visible={editUserinfoVisible}
              footer={null}
              closable={false}
              destroyOnClose={true}
              maskClosable={true}>
              <Form
                onFinish={handleEditUserinfo}
                preserve={false}
                // initialValues={initialValue}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}>
                <Form.Item
                  name="nickname"
                  label="昵称"
                  rules={[
                    { required: true, message: '名称必须填写' },
                    { min: 2, message: '名称不能少于2个字符' },
                    { max: 32, message: '名称不能多余32个字符' },
                  ]}>
                  <Input value={userinfo.nickname} />
                </Form.Item>
                <Form.Item
                  name="avatar"
                  label="头像"
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
                        setEditUserinfoVisible(false)
                      }}>
                      取消
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="修改密码"
              visible={editUserPwdVisible}
              footer={null}
              closable={false}
              destroyOnClose={true}
              maskClosable={true}>
              <Form
                onFinish={handleEditPwd}
                preserve={false}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}>
                <Form.Item
                  name="oldPwd"
                  label="旧密码"
                  rules={[
                    {
                      required: true,
                      message: '旧密码不能为空!',
                    },
                  ]}
                  hasFeedback>
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="newPwd"
                  label="新密码"
                  rules={[
                    {
                      required: true,
                      message: '新密码不能为空!',
                    },
                  ]}
                  hasFeedback>
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="确认密码"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: '请确认密码!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPwd') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('两次密码输入不一致!'))
                      },
                    }),
                  ]}>
                  <Input.Password />
                </Form.Item>

                <Form.Item noStyle={true}>
                  <div>
                    <Button type="primary" htmlType="submit">
                      确定
                    </Button>
                    <Button
                      type="dashed"
                      onClick={() => {
                        setEditUserPwdVisible(false)
                      }}>
                      取消
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
            <Switch>
              <Route path="/main" exact component={Article}></Route>
              <Route path="/main/user" exact component={User}></Route>
              <Route path="/main/details" exact component={Details}></Route>
              <Route path="/main/user/edit" exact component={Edit}></Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}
