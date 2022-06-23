// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'project-one-8g7drnus4e063df3',
        traceUser: true,
      });
    }
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // console.log(menuButtonInfo);
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res);
        this.globalData.winWidth = res.screenWidth;
        this.globalData.winHeight = res.screenHeight;
        // console.log(res.statusBarHeight);
        // 导航栏高度 = 状态栏高度 + 44
        this.globalData.navBarHeight = res.statusBarHeight + 44;
        this.globalData.menuRight = res.screenWidth - menuButtonInfo.right;
        this.globalData.menuTop = menuButtonInfo.top;
        this.globalData.menuHeight = menuButtonInfo.height;
      }
    })
  },
  globalData: {
    winWidth: '',
    winHeight: '',
    navBarHeight: '',
    menuTop: '',
    menuHeight: '',
  }
});
