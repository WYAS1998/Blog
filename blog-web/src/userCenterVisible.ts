import { makeAutoObservable } from 'mobx'

class userCenterVisible {
  userCenterVisible: boolean = false

  setUserCenterVisible(userCenterVisible: boolean) {
    this.userCenterVisible = userCenterVisible
  }
  constructor() {
    makeAutoObservable(this)
  }
}

export default new userCenterVisible()
