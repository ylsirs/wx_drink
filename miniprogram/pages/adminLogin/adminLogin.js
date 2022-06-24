Page({
    adminLogin(e) {
        wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'adminLogin',
            // 传递给云函数的参数
            data: {
                admin: e.detail.value.name,
                possword: e.detail.value.possword
            },
            success: res => {
                if (res.result.res.total) {
                    // 登录成功  跳转页面
                    wx.redirectTo({
                        url: '../admin/admin'
                    })
                } else {
                    wx.showToast({
                        title: '账号 密码错误',
                        icon: 'error',
                        duration: 1000
                    })
                }
            }
        })
    }
})
