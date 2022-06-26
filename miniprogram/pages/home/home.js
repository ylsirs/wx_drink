Page({
  data: {
    isLogin: false
  },
  onShow () {
    let data = wx.getStorageSync('userInfo')
    if (data) {
      this.setData({
        isLogin: false
      })
    } else {
      this.setData({
        isLogin: true
      })
    }
  },
  saoma () {
    // res.rawData  二维码源码
    // "MeWPt+ahjA=="
    // "MuWPt+ahjA=="
    // "M+WPt+ahjA=="
    wx.scanCode({
      success (res) {
        console.log(res)
        if (res.rawData === "MeWPt+ahjA==" || "MuWPt+ahjA==" || "M+WPt+ahjA==") {
          wx.reLaunch({
            url: `../index/index?TABLE_NUM=${res.result}`
          })
        }
      }
    })
  },
  goLogin () {
    wx.switchTab({
      url: '../myself/myself'
    })
  }
})