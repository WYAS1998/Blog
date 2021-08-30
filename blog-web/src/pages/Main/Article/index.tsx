import style from './style.module.less'
import ArticleItem from './ArticleItem'
import { useState, useEffect } from 'react'
import * as api from '../../../services/api'
import { Button, Layout, message, Pagination } from 'antd'
import { useHistory } from 'react-router-dom'
import { Detail, IArticle, Info } from '../../../types'
import Search from 'antd/lib/input/Search'

const { Content } = Layout

export default function Article() {
  // 分页加载所有文章
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 9,
    keyword: '',
    sort: 'ctime',
  })
  // 文章总数
  const [total, setTotal] = useState(9)
  // 所有文章的state
  const [allArticle, setAllArticle] = useState([
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
  // 文章列表可见性，当没有文章时，不显示
  const [allArticleVisible, setAllArticleVisible] = useState(false)
  let history = useHistory<Info>()
  // 检查用户是否登录，禁止未登录进入Main页面
  async function getUserInfo() {
    let result = await api.userInfo()
    if (result.stat === 'ok') {
      // message.warning('您已登录')
    } else {
      message.warning('请先登录')
      history.push('/login')
    }
  }
  // 初始加载所有文章
  async function loadAllArticle() {
    let res = await api.searchAll(pagination)
    if (res.stat === 'ok') {
      setTotal(res.data.total)
      if (res.data.items.length === 0) {
        setAllArticleVisible(false)
        message.warning('还没有人发表文章！')
      } else {
        setAllArticle(res.data.items)
        setAllArticleVisible(true)
      }
    }
  }
  // 仅在挂载和卸载时执行，
  useEffect(() => {
    getUserInfo()
    // loadAllArticle()
  }, [])

  // 翻页时，更新所有文章列表
  useEffect(() => {
    loadAllArticle()
  }, [pagination])
  // 翻页
  function pageChange(page: number) {
    setPagination({ ...pagination, pageIndex: page })
  }
  // 点击文章查看详情，并增加preview
  async function onClick(article: IArticle) {
    let res = await api.preview(article)
    if (res.stat === 'ok') {
      history.push({
        pathname: '/main/details',
        state: res.data.info,
      })
    }
  }
  // 按创建时间排序
  function sortByCtime() {
    setPagination({ ...pagination, sort: 'ctime' })
    // loadAllArticle()
  }
  // 按浏览量排序
  function sortByPreview() {
    setPagination({ ...pagination, sort: 'preview' })
    // loadAllArticle()
  }
  function search(keyword: string) {
    setPagination({ ...pagination, keyword: keyword })
    // loadAllArticle()
  }
  return (
    <>
      {/* <Content style={{ overflow: 'auto' }} className={style.mainContent}> */}
      <div className={style.allArticleHeader}>
        <h1>发现广场</h1>
      </div>
      <div className={style.searchAndSort}>
        <div className={style.sortBtn}>
          <Button size="large" onClick={sortByCtime}>
            按创建时间排序
          </Button>
          <Button style={{marginLeft:10}} size="large" onClick={sortByPreview}>
            按浏览量排序
          </Button>
        </div>
        <div className={style.empty}></div>
        <div className={style.searchInput}>
          <Search
            placeholder="输入关键词"
            allowClear
            enterButton="搜索"
            size="large"
            onSearch={search}
          />
        </div>
      </div>
      {allArticleVisible && (
        <div className={style.mainBody}>
          <div className={style.allArticleList}>
            {allArticle.map((article: IArticle, index: number) => (
              <ArticleItem
                article={article}
                key={index}
                onClick={() => onClick(article)}></ArticleItem>
            ))}
          </div>
          <div className={style.pagination}>
            <Pagination
              defaultCurrent={1}
              onChange={pageChange}
              total={total}
              defaultPageSize={9}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}
      {/* </Content> */}
    </>
  )
}
