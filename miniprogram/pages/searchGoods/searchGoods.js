
let app = getApp()
Page({
  data: {
    menuTop: '',
    navHeight: ''
  },
  onLoad (options) {
    // 适配值  胶囊的top值  -16(胶囊高度/2) -8(胶囊上方到通知栏为8像素)
    let menuTop = app.globalData.menuTop
    let navHeight = app.globalData.navBarHeight - 8
    // console.log(menuTop, navHeight);
    this.setData({
      menuTop: menuTop,
      navHeight: navHeight
    })
  },

  backTo(){
    wx.navigateBack({
        delta: 1
    })
  }
})