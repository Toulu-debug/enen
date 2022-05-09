/**
 * 京喜工厂：肯德基、沃尔玛
 * cron: 0 * * * *
 */

import axios from "axios";
import {getCookie, o2s, wait, randomWord} from "./TS_USER_AGENTS";
import {requestAlgo} from "./utils/V3";
import {sendNotify} from './sendNotify'

let cookie: string = '', res: any = '', message: string = '';

!(async () => {
  await requestAlgo('10001')
  let cookiesArr: string[] = await getCookie();
  cookie = cookiesArr[Math.floor(Math.random() * cookiesArr.length)];

  /*
  let exist: string[] = [];
  if (existsSync('json/jxgc_stock.json')) {
    exist = JSON.parse(readFileSync('./json/jxgc_stock.json').toString() || '[]')
  }
  res = await api();
  let current: string[] = []
  for (let t of res.data.commodityList) {
    console.log(t.name)
    current.push(t.name)
    if (!exist.includes(t.name)) {
      message += t.name + '\n'
    }
  }
  writeFileSync('./json/jxgc_stock.json', JSON.stringify(current))
  if (message) {
    console.log('send...')
    sendNotify('京喜工厂可生产', message)
  }
   */
  res = await api();
  await wait(1000)

  let keywords: string[] = ['KFC', 'kfc', '肯德基', '沃尔玛']
  for (let t of res.data.commodityList) {
    let name: string = t.name, commodityId: number = t.commodityId
    res = await api(commodityId)
    await wait(1000)

    let desp: string = res.data.commodityList[0].description
    if (desp.indexOf('红包') > -1) {
      desp = desp.match(/奖[励|品]以(.*)发放/)[1]
      message += `${name} ${desp}\n`
    } else if (desp.indexOf('支付') > -1) {
      desp = desp.match(/完成需(.*元)/)![1]
    } else {
      o2s(res)
    }
    console.log(name, desp)

    for (let keyword of keywords) {
      if (name.indexOf(keyword) > -1) {
        await sendNotify("京喜工厂", name)
        break
      }
    }
  }
  if (message) {
    sendNotify('京喜工厂送红包', message)
  }
})()

async function api(commodityId?: number) {
  let t = Date.now()
  let url: string = commodityId
    ? `https://m.jingxi.com/dreamfactory/diminfo/GetCommodityDetails?zone=dream_factory&commodityId=${commodityId}&_time=${t}&_ts=${t}&_=${t}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
    : `https://m.jingxi.com/dreamfactory/diminfo/GetCommodityList?zone=dream_factory&flag=2&pageNo=1&pageSize=12&_time=${t}&_ts=${t}&_=${t}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
  let {data}: any = await axios.get(url, {
    headers: {
      'Host': 'm.jingxi.com',
      'User-Agent': 'jdpingou;',
      'Referer': 'https://st.jingxi.com/',
      'Cookie': cookie
    }
  })
  return JSON.parse(data.match(/jsonpCBK.?\((.*)/)[1])
}