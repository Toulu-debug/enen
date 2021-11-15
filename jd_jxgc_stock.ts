/**
 * 京喜工厂：肯德基、沃尔玛
 * cron: 0 * * * *
 */

import axios from "axios";
import USER_AGENT, {h5st, requireConfig, requestAlgo} from "./TS_USER_AGENTS";
import {sendNotify} from './sendNotify'
import {existsSync, readFileSync, writeFileSync} from "fs";

let cookie: string = '', res: any = '', message: string = '';


!(async () => {
  await requestAlgo(10001)
  let cookiesArr: any = await requireConfig();
  cookie = cookiesArr[0];

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
  let keywords: string[] = ['KFC', 'kfc', '肯德基', '沃尔玛']
  for (let t of res.data.commodityList) {
    let name: string = t.name
    console.log(name)
    for (let keyword of keywords) {
      if (name.indexOf(keyword) > -1) {
        await sendNotify("京喜工厂", name)
        break
      }
    }
  }
})()

async function api() {
  let url: string = h5st(`https://wq.jd.com/dreamfactory/diminfo/GetCommodityList?zone=dream_factory&flag=2&pageNo=1&pageSize=12&_time=${Date.now()}&_stk=_time%2Cflag%2CpageNo%2CpageSize%2Czone&_ste=1&_=${Date.now()}&sceneval=2`, '_time,flag,pageNo,pageSize,zone', {}, 10001)
  let {data}: any = await axios.get(url, {
    headers: {
      'Host': 'wq.jd.com',
      "User-Agent": USER_AGENT,
      'accept-language': 'zh-cn',
      'referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html',
      'cookie': cookie
    }
  })
  return data
}