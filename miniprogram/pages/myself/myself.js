const app = getApp()

Page({
  data: {
    userInfo: '',
    hasUserInfo: false
  },

  async getUserInfo(){
    let data = wx.getStorageSync('userInfo')
    if(data) {
      // 有数据 表明已经登录 进行数据更新
      let {data: userInfo} = await wx.cloud.database().collection('userInfo').doc(data._id).get()
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
  },
  // 进入页面触发 ，获取最新的用户信息
  onShow () {
    this.getUserInfo()
  },

  // 用户登录
  userLogin () {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const { avatarUrl, nickName } = res.userInfo
        wx.cloud.callFunction({
          // 云函数名称
          name: 'login',
          // 传给云函数的参数
          data: {
            nickName,
            avatarUrl
          },
          success: (resLogin) => {
            const { result: { data } } = resLogin
            console.log(data);
            this.setData({
              userInfo: data,
              hasUserInfo: true
            })
            wx.setStorageSync('userInfo', data)
          }
        })
      }
    })
  },

  loginOut () {
    console.log('退出登录');
    wx.clearStorageSync()
    this.setData({
      hasUserInfo: false
    })
  },

  adminLogin(){
    wx.reLaunch({
      url: '../adminLogin/adminLogin'
    })
  }
})