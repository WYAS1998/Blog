import style from './style.module.less'
import PreviewImg from '../../../assets/imgs/preview.png'
import { Detail, Info } from '../../../types'
import { UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom'
// 编辑 / 视图
import { Editor, Viewer } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight-ssr'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import gemoji from '@bytemd/plugin-gemoji'
// 引入中文包
import zhHans from 'bytemd/lib/locales/zh_Hans.json'
// 引入基础css
import 'bytemd/dist/index.min.css'
// 引入高亮css
import 'highlight.js/styles/vs.css'
import { useState } from 'react'
import { Avatar, Button } from 'antd'

const plugins = [gfm(), gemoji(), highlight(), mediumZoom()]

export default function Details() {
  let history = useHistory<Info>()
  const [articleDetail, setArticleDetail] = useState({
    author: {
      _id: history.location.state.author._id,
      account: history.location.state.author.account,
      nickname: history.location.state.author.nickname,
      avatar: history.location.state.author.avatar,
      status: history.location.state.author.status,
      ctime: history.location.state.author.ctime,
    },
    _id: history.location.state._id,
    title: history.location.state.title,
    subTitle: history.location.state.subTitle,
    tags: history.location.state.tags,
    content: history.location.state.content,
    banner: history.location.state.banner,
    ctime: history.location.state.ctime,
    preview: history.location.state.preview,
    status: history.location.state.status,
  })

  return (
    <>
      <div className={style.detail}>
        <Button onClick={() => history.push('/main')}>返回</Button>
        <div className={style.articleDetail}>
          <div className={style.articleTitle}>{articleDetail.title}</div>
          <div className={style.subTitle}>
            <div className={style.empty}></div>
            <div className={style.subTitle}>——{articleDetail.subTitle}</div>
          </div>

          <div className={style.articleContent}>
            <Viewer value={articleDetail.content} plugins={plugins}></Viewer>
          </div>
          <div>
            <img className={style.articleBanner} src={articleDetail.banner} />
          </div>
        </div>

        <div className={style.authorDetail}>
          <div className={style.avatarImgDiv}>
            {articleDetail.author.avatar === '' ? (<Avatar size={150} icon={<UserOutlined />} />) : (<Avatar size={150} src={articleDetail.author.avatar} />) }
            {/* <img
              className={style.avatarImg}
              src={articleDetail.author.avatar}
            /> */}
          </div>
          <div className={style.username}>{articleDetail.author.nickname}</div>
        </div>
      </div>
    </>
  )
}
