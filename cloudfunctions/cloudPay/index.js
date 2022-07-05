// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const res = await cloud.cloudPay.unifiedOrder({
        "body": "茶饮吧",
        "outTradeNo": "1217752501201407033233368018", // 订单号
        "spbillCreateIp": "127.0.0.1",
        "subMchId": "1900009231", //商户号
        "totalFee": 1, // 价格
        "envId": "project-one-8g7drnus4e063df3", //环境id
        "functionName": "pay_cb"
    })
    return res
}