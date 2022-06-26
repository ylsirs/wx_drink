// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const {
        accountsContent,
        _id
    } = event
    const db = cloud.database()
    const _ = db.command
    db.collection('userInfo').doc(_id).update({
        data: {
            orders: _.unshift(accountsContent)
        }
    })

    db.collection('orderList').add({
        data: {
            opendID: wxContext.OPENID,
            order: accountsContent,
            table: 0,
            complete: false,
            _time: +new Date()
        }
    })
    
    return {
        openId: wxContext.OPENID,
    }
}