Page({
  data: {
    orders: '',
    isLogin: false
  },
  onShow () {
    this.isLogin()
  },

  async isLogin () {
    let data = wx.getStorageSync('userInfo')
    console.log(data);
    if (data) {
      // 有数据 表明已经登录 进行数据更新
      let { data: userInfo } = await wx.cloud.database().collection('userInfo').doc(data._id).get()
      // console.log(userInfo);
      console.log(userInfo.orders);
      this.setData({
        orders: userInfo.orders,
        isLogin: true
      })
    } else {
      this.setData({
        isLogin: false
      })
    }
  },
})