import { useHistory } from 'react-router-dom'
import style from './style.module.less'
import userImg from '../../assets/imgs/user.png'
import pwdImg from '../../assets/imgs/password.png'
import * as api from '../../services/api'
import { Form, Input, Button, message, Checkbox } from 'antd'
import { useEffect, useState } from 'react'
import cookie from 'react-cookies'
interface LoginUser {
  account: string
  pwd: string
  remember: boolean
}

export default function Login() {
  // const [form] = Form.useForm()
  let history = useHistory()
  const [loginUser, setLoginUser] = useState({
    account: '',
    pwd: '',
    remember: false,
  })

  useEffect(() => {
    // console.log('loginUser 改变')
    // if (loginUser.pwd != '') {
      // console.log(loginUser)
      // form.setFieldsValue({
      //   account:loginUser.account,
      //   remember: loginUser.remember,
      //   pwd: loginUser.pwd,
      // })
      // console.log(form);
      // form.resetFields(['pwd',loginUser.pwd])
      // console.log(form.getFieldValue('account'))
      // console.log(form.getFieldValue('pwd'))
    // }
    // form.resetFields()
  }, [])
  const register = () => {
    history.push('/register')
  }
  async function login() {
    let res = await api.login(loginUser)
    let outTime = new Date(new Date().getTime() + 24 * 3600 * 1000) // cookie失效时间：一天
    if (res.stat == 'ok') {
      if (loginUser.remember) {
        cookie.save(
          loginUser.account,
          { pwd: loginUser.pwd, remember: loginUser.remember },
          { path: '/', expires: outTime },
        )
        history.push('/main')
        // console.log('登录成功')
      } else {
        cookie.remove(loginUser.account)
        // console.log('登录成功')
        history.push('/main')
      }
    }
    if (res.stat == 'Err_User_Not_Found') {
      message.warning('用户名或密码错误！')
    }
  }
  return (
    <>
      <div className={style.backgroundColor}>
        <div className={style.welcomeBody}>
          <div className={style.welcome}>
            <h1>简笔话</h1>
            <div className={style.welcomeToUse}>
              <h2>欢迎使用简笔话文章创作平台</h2>
            </div>

            <Button className={style.btn} onClick={register}>
              注册
            </Button>
          </div>
          <div className={style.loginForm}>
            <div className={style.loginTitle}>
              <h1>登录</h1>
            </div>

            <div>
              <form>
                <div className={style.imgIput}>
                  <div>
                    <img src={userImg} />
                  </div>
                  <input
                    name="account"
                    className={style.input}
                    value={loginUser.account}
                    onChange={(e) => {
                      setLoginUser({ ...loginUser, account: e.target.value })
                      if (cookie.load(e.target.value) != undefined) {
                        setLoginUser({
                          ...loginUser,
                          account: e.target.value,
                          pwd: cookie.load(e.target.value).pwd,
                          remember: cookie.load(e.target.value).remember,
                        })
                      }
                    }}
                  />
                </div>
                <div className={style.imgIput}>
                  <div>
                    <img src={pwdImg} />
                  </div>
                  <input
                    name="pwd"
                    type="password"
                    value={loginUser.pwd}
                    className={style.input}
                    onChange={(e) => {
                      setLoginUser({ ...loginUser, pwd: e.target.value })
                    }}
                  />
                </div>
                <div className={style.rememberDiv}>
                  <label className={style.rememberPwd}>
                    <input
                      className={style.checkBox}
                      name="remember"
                      type="checkbox"
                      checked={loginUser.remember}
                      onChange={(e) => {
                        setLoginUser({
                          ...loginUser,
                          remember: e.target.checked,
                        })
                      }}
                    />
                    记住密码
                  </label>
                </div>
              </form>
              <div className={style.btnDiv}>
                <Button className={style.btn} onClick={login} type="primary">
                  登录
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
