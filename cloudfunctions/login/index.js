// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event) => {
    const wxContext = cloud.getWXContext()
    const { nickName, avatarUrl } = event
    const db = cloud.database()
    const userInfo = db.collection('userInfo')
    const { data } = await userInfo.where({
        _openid: wxContext.OPENID
    }).get()

    if (data.length === 0) {
        const { _id } = await userInfo.add({
            data: {
                nickName,
                avatarUrl,
                _openid: wxContext.OPENID,
                orders: [],
                message: []
            }
        })
        const { data } = await userInfo.doc(_id).get()
        return {
            data
        }
    } else {
        return {
            data: data[0]
        }
    }
}