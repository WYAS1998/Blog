import style from './style.module.less'
import PreviewImg from '../../../assets/imgs/preview.png'
import { IArticle } from '../../../types'
import { Avatar } from 'antd'

interface Props {
  article: IArticle
  onClick: () => void
}

export default function ArticleItem(props: Props) {
  let emptyVisible: boolean
  if (props.article.banner === '') {
    emptyVisible = true
  } else {
    emptyVisible = false
  }
  return (
    <>
      <div onClick={props.onClick} className={style.articleItem}>
        <div className={style.banner}>
          { props.article.banner === '' ? (<Avatar size={150} shape="square" >No Banner</Avatar>) : <Avatar size={150} shape="square" src={props.article.banner} />}
          
          {/* <img className={style.articleBannerImg} src={props.article.banner} /> */}
          {/* {emptyVisible && (<div className={style.bannerEmpty}></div>)} */}
        </div>
        <div className={style.articleTitle}>
          {/* <h1 className={style.title}>{props.article.title}</h1> */}
          {props.article.title}
        </div>
        <div className={style.articleSubTitle}>{props.article.subTitle}</div>
        <div className={style.ctimeAndPreview}>
          <div className={style.articleCtime}>
            {moment(props.article.ctime).format('YYYY-MM-DD HH:mm')}
          </div>
          <div>{props.article.tags}</div>
          <div className={style.articlePreview}>
            <img src={PreviewImg} />
            {props.article.preview}
          </div>
        </div>
      </div>
    </>
  )
}
