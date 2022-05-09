import axios from 'axios'
import {getCookie, wait, o2s, randomWord} from './TS_USER_AGENTS'

let cookie: string = '', UserName: string = '', res: any = ''

!(async () => {
  let cookiesArr: string[] = await getCookie()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    res = await api('FavCommQueryFilter')
    let commId: string = ''
    console.log('当前关注商品：', parseInt(res.totalNum))
    res.data.map((item: { commId: string }) => {
      commId += item.commId + ','
    })
    commId = commId.slice(0, -1)
    await wait(1000)

    if (commId) {
      res = await api('FavCommBatchDel', commId)
      if (res.iRet === '0') {
        console.log('取关', commId.split(',').length, '个商品成功')
      } else {
        console.log('取关失败', res.errMsg)
      }
    }

    await wait(2000)
    res = await api('QueryShopFavList')
    console.log('当前关注店铺：', parseInt(res.totalNum))
    await wait(1000)
    commId = ''
    res.data.map((item: { shopId: string }) => {
      commId += item.shopId + ','
    })
    commId = commId.slice(0, -1)
    if (commId) {
      res = await api('batchunfollow', commId)
      if (res.iRet === '0') {
        console.log('取关', commId.split(',').length, '个店铺成功')
      } else {
        console.log('取关失败', res.errMsg)
      }
    }
  }
})()

async function api(fn: string, params: string = '') {
  let url: string, u = `_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
  if (fn === 'FavCommQueryFilter')
    url = `https://wq.jd.com/fav/comm/FavCommQueryFilter?cp=1&pageSize=10&category=0&promote=0&cutPrice=0&coupon=0&stock=0${u}`
  else if (fn === 'FavCommBatchDel')
    url = `https://wq.jd.com/fav/comm/FavCommBatchDel?commId=${params}${u}`
  else if (fn === 'QueryShopFavList')
    url = `https://wq.jd.com/fav/shop/QueryShopFavList?cp=1&pageSize=10&lastlogintime=0${u}`
  else
    url = `https://wq.jd.com/fav/shop/batchunfollow?shopId=${params}${u}`

  let {data} = await axios.get(url, {
    headers: {
      'authority': 'wq.jd.com',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
      'referer': 'https://wqs.jd.com/',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cookie': cookie
    }
  })
  return JSON.parse(data.match(/jsonpCBK.?\(([\w\W]*)\);/)[1])
}