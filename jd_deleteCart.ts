/**
 * process.env.deleteCart="true"
 */

import axios from 'axios'
import {getRandomNumberByRange, requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, index: number
let UA: string = `jdapp;JD4iPhone/167724 (iPhone; iOS ${getRandomNumberByRange(12, 16)}.${getRandomNumberByRange(0, 4)}; Scale/3.00)`

process.env.deleteCart = 'true'

!(async () => {
  if (process.env.deleteCart === 'true') {
    let cookiesArr: string[] = await requireConfig()
    for (let i = 0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i]
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      index = i + 1
      console.log(`\n开始【京东账号${index}】${UserName}\n`)

      res = await getCartData();
      let areaId: string = res.areaId, traceId: string = res.traceId, delCount: number = 0, cartCount: number = parseInt(res.cartJson.num), venderCart: any = res.cart.venderCart

      console.log('购物车有', cartCount, '件商品')

      if (cartCount > 0) {
        for (let vender of venderCart) {
          for (let sortedItem of vender.sortedItems) {
            let pid: string = sortedItem.polyItem?.promotion?.pid, postBody: string = ''

            for (let p of sortedItem.polyItem.products) {
              let commlist: string = p.mainSku.id, name: string = p.mainSku.name, skuUuid: string = p.skuUuid
              console.log('开始删除', name)

              if (pid)
                postBody = `pingouchannel=0&commlist=${commlist},,1,${commlist},11,${pid},0,skuUuid:${skuUuid}@@useUuid:0&type=0&checked=0&locationid=1-72-2819-0&templete=1&reg=1&scene=0&version=20190418&traceid=1382552434001752779&tabMenuType=1&sceneval=2`
              else
                postBody = `pingouchannel=0&commlist=${commlist},,1,${commlist},1,,0,skuUuid:${skuUuid}@@useUuid:0&type=0&checked=0&locationid=${areaId}&templete=1&reg=1&scene=0&version=20190418&traceid=${traceId}&tabMenuType=1&sceneval=2`;
            }

            res = await rmvCmdy(postBody)
            if (res.errId === '0') {
              console.log('删除成功✅')
              delCount++
              await wait(1000)
            } else {
              console.log(res.errMsg)
              break
            }
          }
        }
        console.log('删除完成，共删除', delCount, '件商品')
        if (delCount === cartCount)
          console.log('购物车已清空')
      }
    }
  }
})()

async function getCartData() {
  let {data} = await axios.get('https://p.m.jd.com/cart/cart.action?fromnav=1', {
    headers: {
      'Host': 'p.m.jd.com',
      'User-Agent': UA,
      'Referer': 'https://m.jd.com/',
      cookie: cookie
    }
  })
  data = data.match(/window\.cartData =([\s\S]*)window\._PFM_TIMING\[2] /)[1].replace(/\s*/g, '')
  return JSON.parse(data)
}

async function rmvCmdy(body: string) {
  let {data} = await axios.post('https://wq.jd.com/deal/mshopcart/rmvCmdy?sceneval=2&g_login_type=1&g_ty=ajax', body, {
    headers: {
      'authority': 'wq.jd.com',
      'accept': 'application/json',
      'user-agent': UA,
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://p.m.jd.com',
      'referer': 'https://p.m.jd.com/',
      'cookie': cookie
    }
  })
  return data
}