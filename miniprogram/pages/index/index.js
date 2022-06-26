// index.js
const app = getApp()
// const { envList } = require('../../envList.js');
const db = wx.cloud.database()
// 高度累计数组
let heightArr = [0]
//右侧滚动事件  判断navBarHeight的高度的控制阀 防止重复调用
let navBarHeightFlag = true
Page({
  data: {
    myList: '',
    noticeList: '',
    goodsClassList: '',
    goodsArr: '',
    goodsList: '',
    isSearch: false,
    goodsScrollHeight: '',
    menuTop: '',
    leftNum: 0,
    rightId: 'right0',

    // 加购商品弹出层
    cartShow: false,
    cartGoods: '',
    cartGoodsDetail: '',
    cartPirce: '',
    //商品参数
    cartSizeIndex: '',
    cartTemperatureIndex: '',
    cartSweetIndex: '',
    cartGoodsList: [],

    // 底部购物车
    cartState: false,
    cartFlag: false,
    z_index: 0,
    cartGoodsListScroll: '',
    cartTotalPrice: '0.0',
    cartGoodsListNum: 0,

  },

  onLoad: function (options) {
    // 储存桌号
    wx.setStorageSync('TABLE_NUM', options.TABLE_NUM)
    
    db.collection("photo").get({
      success: res => {
        // console.log(res);
        this.setData({
          myList: res.data
        })
      }
    })
    db.collection("notice").get({
      success: res => {
        // console.log(res);
        this.setData({
          noticeList: res.data
        })
      }
    })
    db.collection("goodsClass").get({
      success: res => {
        // console.log(res.data);
        this.setData({
          goodsClassList: res.data
        })
        let arr = []
        let goodsArr = []
        res.data.forEach((item, index) => {
          item.have.forEach(async item1 => {
            let goods = await db.collection('goods').doc(item1).get()
            goodsArr.push(goods.data)
            if (index === res.data.length - 1) {
              res.data.forEach(item2 => {
                let obj = {}
                obj.name = item2.goodsClassName
                let goodsList = []
                item2.have.forEach(item3 => {
                  for (let i = 0; i < goodsArr.length; i++) {
                    if (item3 === goodsArr[i]._id) {
                      goodsList.push(goodsArr[i])
                      break
                    }
                  }
                  obj.list = goodsList
                })
                arr.push(obj)
              })
              this.setData({
                goodsList: arr
              })
            }
          })
        });
      }
    })

    // 高度适配
    // 获取屏幕高度 宽高
    let winHeight = app.globalData.winHeight
    // 适配分辨率高度大于850像素的屏幕
    if (winHeight >= 850) {
      winHeight = 850
    }
    // 适配商品列表和商品分类的scroll-view高度
    this.setData({
      goodsScrollHeight: winHeight - 200 - 35
    })
  },

  onReady (e) {
    const query = wx.createSelectorQuery()
    // 动态数据运行到这不能保证数据一定能渲染到页面上
    //（比如这个goodsList到这就没有加载完，第一时间返回的是[]，页面渲染时间，onLoad > onShow > onReady, 如果页面由动态数据加载渲染，有可能是数据还没有渲染成功。onReady代表页面框架加载完毕，此时数据渲染不一定完成，）
    // 这里是设置了一个定时器，每0.5s判断是否得到goodsList数据，得到再调用选择器获取对应的DOM
    let time = setInterval(() => {
      if (!this.data.goodsList) return
      query.selectAll('.goodsAll').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        // console.log(res);
        res[0].map(item => {
          let result = item.height + heightArr[heightArr.length - 1]
          heightArr.push(result)
        });
        // console.log(heightArr);
      })
      clearInterval(time)
    }, 500);
  },

  // 搜索框跳转事件
  goSearch (e) {
  },


  // 左侧点击事件
  onLeftChange (e) {
    this.setData({
      leftNum: e.currentTarget.dataset.index,
      rightId: 'right' + e.currentTarget.dataset.index
    })
  },

  // 右侧滚动事件
  goodsListScroll (e) {
    if (navBarHeightFlag) {
      // 适配分辨率高度小于850像素的屏幕
      let goodsScrollHeight = app.globalData.winHeight - app.globalData.navBarHeight
      // 适配分辨率高度大于850像素的屏幕
      if (app.globalData.winHeight >= 850) {
        goodsScrollHeight = goodsScrollHeight - (app.globalData.winHeight - 850)
      }
      this.setData({
        // 显示搜索框
        isSearch: !this.data.isSearch,
        // 搜索框位置
        menuTop: app.globalData.menuTop,
        menuHeight: app.globalData.menuHeight,
        goodsScrollHeight: goodsScrollHeight
      })
      navBarHeightFlag = !navBarHeightFlag
    }

    if (e.detail.scrollTop <= 30) {
      this.setData({
        // 隐藏搜索框  显示轮播和公告
        isSearch: !this.data.isSearch,
      })
      navBarHeightFlag = !navBarHeightFlag
    }
    for (let i = 0; i < heightArr.length; i++) {
      if (e.detail.scrollTop >= heightArr[i] && e.detail.scrollTop < heightArr[i + 1]) {
        this.setData({
          leftNum: i
        })
        return
      }
    }
  },



  //商品添加事件
  addShopping (e) {
    // console.log(e.currentTarget.dataset.id);
    let goods = e.currentTarget.dataset.id
    let goodsObj = {}
    goodsObj.size = goods.size[0]
    goodsObj.sweet = goods.sweet[0]
    goodsObj.temperature = goods.temperature[0]
    this.setData({
      cartShow: true,
      cartGoods: goods,
      cartPirce: goods.price[0],
      cartGoodsDetail: goodsObj
    })
  },
  cartCloseBtn () {
    this.setData({
      cartShow: false
    })
  },
  cartAfterleave () {
    // console.log(this.data.cartGoodsDetail);
    this.setData({
      cartSizeIndex: '',
      cartTemperatureIndex: '',
      cartSweetIndex: ''
    })
  },
  cartSizeBtn (e) {
    this.data.cartGoodsDetail.size = this.data.cartGoods.size[e.currentTarget.dataset.sizeindex]
    this.setData({
      cartSizeIndex: e.currentTarget.dataset.sizeindex,
      cartPirce: this.data.cartGoods.price[e.currentTarget.dataset.sizeindex],
      cartGoodsDetail: this.data.cartGoodsDetail
    })
  },
  cartTemperatureBtn (e) {
    this.data.cartGoodsDetail.temperature = this.data.cartGoods.temperature[e.currentTarget.dataset.temperatureindex]
    this.setData({
      cartTemperatureIndex: e.currentTarget.dataset.temperatureindex,
      cartGoodsDetail: this.data.cartGoodsDetail
    })
  },
  cartSweetBtn (e) {
    this.data.cartGoodsDetail.sweet = this.data.cartGoods.sweet[e.currentTarget.dataset.sweetindex]
    this.setData({
      cartSweetIndex: e.currentTarget.dataset.sweetindex,
      cartGoodsDetail: this.data.cartGoodsDetail
    })
  },

  // 加入购物车按钮
  addCartGoods () {
    let obj = {}
    obj.name = this.data.cartGoods.name
    obj.price = this.data.cartPirce
    obj.goodsNum = 1
    obj.detail = this.data.cartGoodsDetail
    this.data.cartGoodsList.push(obj)
    this.setData({
      cartGoodsList: this.data.cartGoodsList,
      cartShow: false
    })
    // 计算总价
    this.totalPrice()
  },



  // 购物车
  // 购物车商品列表
  cartCover () {
    this.setData({
      cartFlag: !this.data.cartFlag,
      z_index: 0
    })
  },
  cartGoodsListBtn () {
    // 判断层级
    if (this.data.z_index === 0) {
      this.data.z_index = 30
    } else {
      this.data.z_index = 0
    }
    this.setData({
      z_index: this.data.z_index,
      cartFlag: !this.data.cartFlag
    })
    // 得到视图高度 判断是否要使用scroll-view（通过设置它的固定高度控制）
    wx.createSelectorQuery().select('.cart_goods').boundingClientRect(res => {
      if (!res) return
      if (res.height > 490) {
        this.setData({
          cartGoodsListScroll: 350
        })
      }
    }).exec()
    // this.totalPrice()
  },

  // 清空购物车按钮
  cartClear () {
    this.setData({
      cartFlag: false,
      z_index: 0,
      cartGoodsList: [],
      cartGoodsListScroll: ''
    })
  },

  cartGoodsListNumtDelete (e) {
    let currentIndex = e.currentTarget.dataset.index
    this.data.cartGoodsList[currentIndex].goodsNum -= 1
    // 判断数量为0从数组中移除， 购物车为空 等价于清空购物车按钮
    if (this.data.cartGoodsList[currentIndex].goodsNum === 0) {
      this.data.cartGoodsList.splice(currentIndex, 1)
      if (this.data.cartGoodsList.length === 0) {
        this.cartClear()
      }
    }
    this.setData({
      cartGoodsList: this.data.cartGoodsList
    })
    this.totalPrice()
    wx.createSelectorQuery().select('.cart_goods').boundingClientRect(res => {
      if (res.height <= 490) {
        this.setData({
          cartGoodsListScroll: ''
        })
      }
    }).exec()
  },

  cartGoodsListNumAdd (e) {
    // console.log( this.data.cartGoodsList[e.currentTarget.dataset.index].goodsNum);
    this.data.cartGoodsList[e.currentTarget.dataset.index].goodsNum += 1
    this.setData({
      cartGoodsList: this.data.cartGoodsList
    })
    this.totalPrice()
  },

  goAccounts () {
    let cart = JSON.stringify(this.data.cartGoodsList)
    wx.navigateTo({
      url: `../accounts/accounts?cartList=${cart}`,
    })
  },

  // 购物车 总价/数量 计算 封装
  totalPrice () {
    // console.log(this.data.cartGoodsList);
    let totalPirce = 0
    let totalNum = 0
    this.data.cartGoodsList.map(item => {
      totalPirce += parseFloat(item.price) * item.goodsNum
      totalNum += item.goodsNum
    })
    this.setData({
      cartTotalPrice: totalPirce,
      cartGoodsListNum: totalNum
    })
  }
})