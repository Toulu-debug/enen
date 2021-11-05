/**
 * 京东快递更新通知
 * cron: 0 0-23/4 * * *
 */

import axios from "axios"
import * as path from "path"
import {sendNotify} from './sendNotify'
import {accessSync, readFileSync, writeFileSync} from "fs"
import {requireConfig, exceptCookie, wait} from "./TS_USER_AGENTS"

let cookie: string = '', UserName: string, index: number, allMessage: string = '', res: any = '', message: string = ''

!(async () => {
  let cookiesArr: any = await requireConfig()
  let except: string[] = exceptCookie(path.basename(__filename))
  let orders: any
  try {
    accessSync('./json/jd_track.json')
    orders = JSON.parse(readFileSync('./json/jd_track.json').toString() || '{}')
  } catch (e) {
    orders = {}
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    message = ''
    res = await getOrderList()
    for (let order of res.orderList) {
      let orderId: string = order['orderId']
      let title: string = order['productList'][0]['title']
      let t: string = order.progressInfo?.tip || null
      let status: string = order.progressInfo?.content || null
      if (t && status) {
        if (status.match(/(?=签收|已取走|已暂存)/)) continue
        console.log(title)
        console.log('\t', t, status)
        console.log()
        if (Object.keys(orders).indexOf(orderId) > -1 && orders[orderId]['status'] !== status) {
          message += `${title}\n${t}  ${status}\n\n`
        }
        orders[orderId] = {
          user: UserName, title, t, status
        }
      }
    }
    if (message) {
      message = `<京东账号${i + 1}>  ${UserName}\n\n${message}`
      allMessage += message
    }
    await wait(1000)
  }
  orders = JSON.stringify(orders, null, 2)
  let account: { pt_pin: string, remarks: string, wxpusher_uid?: string }[] = JSON.parse(readFileSync('./utils/account.json').toString() || '[]') || []
  for (let acc of account) {
    orders = orders.replace(new RegExp(decodeURIComponent(acc['pt_pin']), 'g'), acc['remarks'])
  }
  writeFileSync('./json/jd_track.json', orders)
  if (allMessage)
    await sendNotify('京东快递更新', allMessage)
})()

async function getOrderList() {
  let t: number = Date.now()
  let {data} = await axios.get(`https://wq.jd.com/bases/orderlist/list?order_type=2&start_page=1&last_page=0&page_size=10&callersource=mainorder&t=${t}&sceneval=2&_=${t + 1}&sceneval=2`, {
    headers: {
      'authority': 'wq.jd.com',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      'referer': 'https://wqs.jd.com/',
      'cookie': cookie
    }
  })
  return data
}