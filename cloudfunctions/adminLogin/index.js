// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database()
    const {
        admin,
        possword
    } = event
    const _ = db.command

    const res = await db.collection('admin').where({
      admin,
      possword
    }).count()

    return {
        res
    }
}