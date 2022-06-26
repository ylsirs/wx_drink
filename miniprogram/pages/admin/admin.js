// pages/admin/admin.js
let app = getApp()
const db = wx.cloud.database()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        menuTop: '',
        navHeight: '',
        tabbarState: false,
        orderList: [],
        completeOrderList: [],
        incompleteOrderList: []
    },

    getOrderList () {
        let completeOrderList = []
        let incompleteOrderList = []
        wx.cloud.callFunction({
            name: 'getOrderList',
            success: res => {
                // console.log(res.result.data.data);
                let orderList = res.result.data.data
                orderList.forEach(item => {
                    if (item.complete) {
                        incompleteOrderList.push(item)
                        this.setData({
                            incompleteOrderList: incompleteOrderList
                        })
                    } else {
                        completeOrderList.push(item)
                        this.setData({
                            completeOrderList: completeOrderList
                        })
                    }
                });
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        // 适配值  胶囊的top值  -16(胶囊高度/2) -8(胶囊上方到通知栏为8像素)
        let menuTop = app.globalData.menuTop - 24
        let navHeight = app.globalData.navBarHeight - 8
        this.setData({
            menuTop: menuTop,
            navHeight: navHeight
        })

        this.getOrderList()
        let that = this
        db.collection('orderList').watch({
            onChange: function (snapshot) {
                // console.log('snapshot', snapshot)
                if (snapshot.docChanges[0].dataType === "add") {
                    wx.showToast({
                        title: '新订单来了',
                        icon: 'success',
                        duration: 2000
                    })
                    that.getOrderList()
                }
            },
            onError: function (err) {
                console.error('the watch closed because of error', err)
            }
        })
    },

    orderState (e) {
        let _id = e.currentTarget.dataset._id
        let that = this
        wx.showModal({
            title: '提示',
            content: '订单完成提交',
            success (res) {
                if (res.confirm) {
                    db.collection('orderList').doc(_id).update({
                        data: {
                            complete: true
                        }
                    }).then(res => {
                        // console.log(that.data.completeOrderList);
                        for (let i = 0; i < that.data.completeOrderList.length; i++) {
                            if (that.data.completeOrderList[i]._id === _id) {
                                that.data.completeOrderList.splice(i, 1)
                                that.setData({
                                    completeOrderList: that.data.completeOrderList
                                })
                                return
                            }
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },

    inCompleteOrder () {
        if (this.data.tabbarState) {
            this.setData({
                tabbarState: !this.data.tabbarState,
            })
        }

    },

    completeOrder () {
        if (!this.data.tabbarState) {
            this.getOrderList()
            this.setData({
                tabbarState: !this.data.tabbarState
            })
        }

    }
})