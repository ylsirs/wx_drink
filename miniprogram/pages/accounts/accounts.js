let notesContent = ''

Page({
  data: {
    cartGoodsList: '',
    cartTotalPrice: '',
    cartTotalNum: '',
    notesValueLength: 0,
  },
  onLoad (options) {
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
      cartTotalNum: cartTotalNum
    })
  },

  onUnload(){
    notesContent = ''
  },

  notesValueLength (e) {
    // e.detail = {value, cursor, keyCode}
    // console.log(e);
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
    console.log(accountsContent);
  }
})