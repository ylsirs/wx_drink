## 茶饮扫码点单小程序

1.云开发

2.项目笔记

（1）需求：右侧列表滑动到相应区域，左侧对应的菜单名显示为选中状态。

​		解决：获取所有goods（商品）的高度，累加创建成数组，判断scrollTop值（类似于头部卷曲的距离）处于哪个高度范围，对应的序号就是左侧的当前需要选中的序号。	

​		问题：首次获取selector 的所有节点为null，

​		原因：这次为动态数据加载较慢，运行到这（onReady生命周期：页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。）不能保证数据一定能渲染到页面上，加一个定时器判断数据是否获取到，获取到后在进行节点获取。

​		备：评论中学到，将它放在一个加载较慢的异步任务后获取。 

```js
let time = setInterval(() => {
	if (!this.data.goodsList) return
	//返回一个 SelectorQuery 对象实例。
	const query = wx.createSelectorQuery()
	//在当前页面下选择匹配选择器 selector 的所有节点。返回一个 NodesRef （用于获取 WXML 	节点信息的对象）对象实例，可以用于获取节点信息。
	query.selectAll('.goodsAll').boundingClientRect()
    //执行所有的请求。请求结果按请求次序构成数组，在 callback 的第一个参数中返回
 	query.exec(function (res) {
        res[0].map(item => {
          let result = item.height + heigh tArr[heightArr.length - 1]
          // 高度累计数组
          heightArr.push(result)
        });
    })
	clearInterval(time)
}, 500);

for (let i = 0; i < heightArr.length; i++) {
      if (e.detail.scrollTop >= heightArr[i] && e.detail.scrollTop < heightArr[i + 1]) {
        this.setData({
          leftNum: i
        })
        return
      }
 }
```









