/**
 * 京东快递更新通知
 * cron: 0 0-23/4 * * *
 */

import axios from "axios"
import * as path from "path"
import {sendNotify} from './sendNotify'
import {existsSync, mkdirSync, readFileSync, writeFileSync} from "fs"
import USER_AGENT, {requireConfig, exceptCookie, wait} from "./TS_USER_AGENTS"
import {pushplus} from "./utils/pushplus";

let cookie: string = '', UserName: string, allMessage: string = '', res: any = ''

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  let except: string[] = exceptCookie(path.basename(__filename))
  let orders: any = {}, pushplusArr: { pt_pin: string, pushplus: string }[], pushplusUser: string[] = []
  try {
    pushplusArr = JSON.parse(readFileSync('./utils/account.json').toString())
  } catch (e) {
    console.log('utils/pushplus.json load failed')
  }
  for (let user of pushplusArr) {
    if (user.pushplus)
      pushplusUser.push(decodeURIComponent(user.pt_pin))
  }
  if (existsSync('./json')) {
    if (existsSync('./json/jd_track.json')) {
      orders = JSON.parse(readFileSync('./json/jd_track.json').toString() || '{}')
    } else {
      writeFileSync('./json/jd_track.json', '{}')
    }
  } else {
    mkdirSync('./json')
    writeFileSync('./json/jd_track.json', '{}')
  }
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    let message: string = '', markdown: string = '', i: number = 1

    res = await getOrderList()
    await wait(2000)

    for (let order of res.orderList) {
      let orderId: string = order.orderId
      let orderType: string = order.orderType
      let title: string = order.productList[0].title
      let t: string = order.progressInfo?.tip || null
      let status: string = order.progressInfo?.content || null

      res = await getWuliu(orderId, orderType)
      let carrier: string = res.carrier, carriageId: string = res.carriageId

      if (t && status) {
        if (status.match(/(?=签收|已取走|已暂存)/))
          continue
        if (!pushplusUser.includes(UserName)) {
          console.log(title)
          console.log('\t', t, status)
          console.log()
        } else {
          console.log('隐私保护，不显示日志')
        }
        if (!Object.keys(orders).includes(orderId) || orders[orderId]['status'] !== status) {
          if (pushplusUser.includes(UserName)) {
            console.log('+ pushplus')
            markdown += `${i++}. ${title}\n\t- ${carrier}  ${carriageId}\n\t- ${t}  ${status}\n`
          } else {
            console.log('+ sendNotify')
            message += `${title}\n${carrier}  ${carriageId}\n${t}  ${status}\n\n`
          }
        }
        orders[orderId] = {
          user: UserName, title, t, status, carrier, carriageId
        }
      }
    }

    if (message) {
      message = `<京东账号${index + 1}>  ${UserName}\n\n${message}`
      allMessage += message
    }
    if (markdown) {
      markdown = `#### <${UserName}>\n${markdown}`
      await pushplus('京东快递更新', markdown, 'markdown')
    }
    await wait(1000)
  }


  let account: { pt_pin: string, remarks: string }[] = []
  try {
    account = JSON.parse(readFileSync('./utils/account.json').toString())
  } catch (e) {
    console.log('utils/account.json load failed')
  }

  // 删除已签收
  Object.keys(orders).map(key => {
    if (orders[key].status.match(/(?=签收|已取走|已暂存)/)) {
      delete orders[key]
    }
    if (pushplusUser.includes(orders[key].user)) {
      orders[key].title = '******'
    }
  })

  // 替换通知中的用户名为备注
  orders = JSON.stringify(orders, null, 2)
  for (let acc of account) {
    orders = orders.replace(new RegExp(decodeURIComponent(acc.pt_pin), 'g'), acc.remarks)
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
      'user-agent': USER_AGENT,
      'referer': 'https://wqs.jd.com/',
      'cookie': cookie
    }
  })
  return data
}

async function getWuliu(orderId: string, orderType: string) {
  let {data} = await axios.get(`https://wq.jd.com/bases/wuliudetail/dealloglist?deal_id=${orderId}&orderstate=15&ordertype=${orderType}&t=${Date.now()}&sceneval=2`, {
    headers: {
      'authority': 'wq.jd.com',
      'user-agent': USER_AGENT,
      'referer': 'https://wqs.jd.com/',
      'cookie': cookie
    }
  })
  await wait(1000)
  return data
}