/**
 * 下单返红包助力
 * demo
 * 仅测试助力池能收集多少助力码
 */

import axios from "axios"
import {requireConfig, wait, randomString, getBeanShareCode, getFarmShareCode} from "./TS_USER_AGENTS"
import {Md5} from "ts-md5";

let cookie: string = '', UserName: string, index: number, res: any = ''
let orders: string[] = [], baoji: string[] = []

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    res = await getOrderList()
    let order: string = '' // 订单号
    for (let t of res.orderList) {
      if (t.parentId !== '0') {
        order = t.parentId
      } else {
        order = t.orderId
      }
      if (!orders.includes(order)) {
        orders.push(order)
        res = await api(`QueryGroupDetail`, order)
        if (res.data.groupinfo && res.data.groupinfo.end_time * 1000 < Date.now()) {
          let remaininghongbaosum = res.data.groupinfo.remaininghongbaosum * 1
          console.log(`订单 ${order} 有暴击：`, res.data.groupinfo.groupid, '剩余：', remaininghongbaosum)
          if (remaininghongbaosum !== 0) {
            await makeShareCodes(res.data.groupinfo.groupid)
            baoji.push(res.data.groupinfo.groupid)
          }
        } else {
          console.log(`订单 ${order} 无暴击`)
        }
        await wait(2000)
      }
    }
  }
})()

async function api(fn: string, orderid: string) {
  let {data} = await axios.get(`https://m.jingxi.com/fanxianzl/zhuli/${fn}?isquerydraw=1&orderid=${orderid}&groupid=&_=${Date.now()}&sceneval=2`, {
    headers: {
      'Host': 'm.jingxi.com',
      'User-Agent': `jdpingou;iPhone;5.12.0;15.1;${randomString(40)};network/wifi;`,
      'Referer': 'https://actst.jingxi.com/',
      'Cookie': cookie
    }
  })
  return data
}

async function getOrderList() {
  let t: number = Date.now()
  let {data} = await axios.get(`https://wq.jd.com/bases/orderlist/list?order_type=2&start_page=1&last_page=0&page_size=10&callersource=mainorder&t=${t}&sceneval=2&_=${t + 1}&sceneval=2`, {
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      'referer': 'https://wqs.jd.com/',
      'cookie': cookie
    }
  })
  return data
}

async function makeShareCodes(code: string) {
  try {
    let bean: string = await getBeanShareCode(cookie)
    let farm: string = await getFarmShareCode(cookie)
    let pin: string = Md5.hashStr(cookie.match(/pt_pin=([^;]*)/)![1])
    let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/autoInsert/baoji?sharecode=${code}&bean=${bean}&farm=${farm}&pin=${pin}`)
    console.log(data.message)
  } catch (e) {
    console.log('自动提交失败')
    console.log(e)
  }
}