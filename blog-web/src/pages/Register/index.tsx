import style from './style.module.less'
import * as api from '../../services/api'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'

interface RegisterUserInfo {
  account: string
  // nickname: string
  pwd: string
  // confirm: string
  // avatar: string
}

export default function Register() {
  let history = useHistory<string>()
  const onFinish = async (values: RegisterUserInfo) => {
    let res = await api.register(values)
    if (res.stat === 'ok') {
      message.warning('注册成功')
      history.push('/login')
    } else if (res.stat === 'Err_User_Exist') {
      message.warning('该用户已存在')
    }
  }
  const [form] = Form.useForm()

  return (
    <>
      <div className={style.backgroundColor}>
        <div className={style.registerBody}>
          <div className={style.registerTietle}>
            <h1>加入我们</h1>
          </div>
          <div>
            <Form
              labelCol={{ span: 3 }}
              form={form}
              name="register"
              onFinish={onFinish}>
              <Form.Item
                name="account"
                label="用户名"
                rules={[
                  {
                    required: true,
                    message: '用户名不能为空!',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="pwd"
                label="密码"
                rules={[
                  {
                    required: true,
                    message: '密码不能为空!',
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
                      if (!value || getFieldValue('pwd') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次密码输入不一致!'))
                    },
                  }),
                ]}>
                <Input.Password />
              </Form.Item>

              {/* <Form.Item
                name="nickname"
                label="昵称"
                tooltip="你想要其他人怎么称呼你?"
                rules={[
                  { required: true, message: '请输入昵称!', whitespace: true },
                ]}>
                <Input />
              </Form.Item> */}

              {/* <Form.Item
                name="avatar"
                label="头像"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <UploadImg></UploadImg>
              </Form.Item> */}

              <Form.Item>
                <div className={style.btnDiv}>
                  <Button
                    className={style.btn}
                    type="primary"
                    htmlType="submit">
                    注册
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
