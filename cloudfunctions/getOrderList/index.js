// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async () => {
	const db = cloud.database()
	const data = await db.collection('orderList').orderBy('_time', 'desc').limit(100).get().then()
	return {
		data
	}
}