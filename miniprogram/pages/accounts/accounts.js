let notesContent = ''
// 节流阀
let flag = true
const util = require('../../utils/util.js')
Page({
    data: {
        cartGoodsList: '',
        cartTotalPrice: '',
        cartTotalNum: '',
        notesValueLength: 0,
        TABLE_NUM: ''
    },
    onLoad (options) {
        let TABLE_NUM = wx.getStorageSync('TABLE_NUM')
        console.log(TABLE_NUM);
        let cartGoodsList = JSON.parse(options.cartList)
        let cartTotalNum = 0
        let cartTotalPrice = 0
        // console.log(cartGoodsList);
        cartGoodsList.map(item => {
            cartTotalNum += item.goodsNum
            cartTotalPrice += item.price * item.goodsNum
        })
        this.setData({
            cartGoodsList: cartGoodsList,
            cartTotalPrice: cartTotalPrice,
            cartTotalNum: cartTotalNum,
            TABLE_NUM: TABLE_NUM
        })
    },

    onUnload () {
        notesContent = ''
    },

    notesValueLength (e) {
        let notesValueLength = e.detail.value.length
        this.setData({
            notesValueLength: notesValueLength
        })
        notesContent = e.detail.value
    },

    //  结账按钮
    goAccounts () {
        console.log('去结账');
        let accountsContent = {}
        accountsContent.price = this.data.cartTotalPrice
        accountsContent.notesContent = notesContent
        accountsContent.goodsList = this.data.cartGoodsList
        accountsContent.TABLE_NUM = this.data.TABLE_NUM
        accountsContent.time = util.formatTime(new Date())
        let data = wx.getStorageSync('userInfo')
        console.log(accountsContent);
        // 下单  调用云函数"addOrder"
        if (data) {
            if (flag) {
                flag = !flag
                wx.cloud.callFunction({
                    name: "addOrder",
                    data: {
                        _id: data._id,
                        accountsContent
                    },
                    success (res) {
                        // 下单成功，数据库已更新
                        // console.log(res);
                        wx.showToast({
                            title: '下单成功',
                            icon: 'success',
                            duration: 2000,
                            success () {
                                flag = !flag
                            }
                        })
                        wx.removeStorageSync('TABLE_NUM')
                    },
                    fail: console.error
                })
            }
            // 返回点餐页
            wx.switchTab({
                url: '../home/home'
            })
        } else {
            wx.showToast({
                title: '未登录',
                icon: 'error',
                duration: 2000
            })
        }
    }
})