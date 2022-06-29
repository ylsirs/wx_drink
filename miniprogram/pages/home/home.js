Page({
    data: {
        isLogin: false
    },
    onShow() {
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
    saoma() {
        // res.rawData  二维码源码
        // "MeWPt+ahjA=="
        // "MuWPt+ahjA=="
        // "M+WPt+ahjA=="
        wx.scanCode({
            success(res) {
                console.log(res)
                if (res.rawData === "MeWPt+ahjA==" || res.rawData === "MuWPt+ahjA==" || res.rawData === "M+WPt+ahjA==") {
                    console.log(res.rawData);
                    wx.reLaunch({
                        url: `../index/index?TABLE_NUM=${res.result}`
                    })
                } else {
                    wx.showToast({
                      title: '二维码错误',
                      icon: 'none',
                      duration: 1000
                    })
                }
            }
        })
    },
    goLogin() {
        wx.switchTab({
            url: '../myself/myself'
        })
    }
})