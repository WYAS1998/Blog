import { makeAutoObservable } from 'mobx'

class ImgUrl {
  imgUrl: string = ''

  setImgUrl(imgUrl: string) {
    this.imgUrl = imgUrl
  }
  constructor() {
    makeAutoObservable(this)
  }
}

export default new ImgUrl()
