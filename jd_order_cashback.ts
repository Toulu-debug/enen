/**
 * 下单返红包助力
 * 只助力助力池，不助力内部，多次被同账号助力可能会黑
 * cron: 30 0,9,17 * * *
 */

import axios from "axios"
import {requireConfig, wait, randomString, getBeanShareCode, getFarmShareCode, o2s, getShareCodePool} from "./TS_USER_AGENTS"
import {Md5} from "ts-md5";

let cookie: string = '', UserName: string, index: number, res: any = ''
let orders: string[] = [], shareCodeSelf: string[] = [], shareCodes: string[] = []

!(async () => {
  let cookiesArr: string[] = await requireConfig()
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

        if (res.data.groupinfo && res.data.groupinfo.end_time * 1000 > Date.now()) {
          let remaininghongbaosum = res.data.groupinfo.remaininghongbaosum * 1
          console.log(`订单 ${order} ✅`, res.data.groupinfo.groupid, '剩余：', remaininghongbaosum)
          if (remaininghongbaosum !== 0) {
            await makeShareCodes(res.data.groupinfo.groupid)
            shareCodeSelf.push(res.data.groupinfo.groupid)
          }
        } else {
          console.log(`订单 ${order} ❌`)
        }
        await wait(2000)
      }
    }
  }

  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    shareCodes = await getShareCodePool('fanxian', 20)
    for (let code of shareCodes) {
      if (!shareCodeSelf.includes(code)) {
        console.log(`账号${index + 1} ${UserName} 去助力 ${code}`)
        res = await api('Help', code)
        if (res.msg === '') {
          console.log('助力成功，获得：', parseFloat(res.data.prize.discount))
        } else {
          console.log(res.msg)
        }
        await wait(2000)
      } else {
        console.log(`跳过内部账号`)
      }
    }
  }
})()

async function api(fn: string, orderid: string) {
  let url: string = fn === 'Help'
    ? `https://wq.jd.com/fanxianzl/zhuli/Help?groupid=${orderid}&_stk=groupid&_ste=2&sceneval=2`
    : `https://m.jingxi.com/fanxianzl/zhuli/${fn}?isquerydraw=1&orderid=${orderid}&groupid=&_=${Date.now()}&sceneval=2`
  let {data} = await axios.get(url, {
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
    let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/autoInsert/fanxian?sharecode=${code}&bean=${bean}&farm=${farm}&pin=${pin}`)
    console.log(data.message)
  } catch (e) {
    console.log('自动提交失败')
    console.log(e)
  }
}