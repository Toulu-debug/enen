/**
 * 显示京喜工厂当前可生产商品
 * cron: 0 * * * *
 */

import axios from "axios";
import USER_AGENT, {h5st, requireConfig, requestAlgo} from "./TS_USER_AGENTS";
import {sendNotify} from './sendNotify'
import {accessSync, readFileSync, writeFileSync} from "fs";

let cookie: string = '', res: any = '', UserName: string, message: string = '';


!(async () => {
  await requestAlgo(10001)
  let cookiesArr: any = await requireConfig();
  cookie = cookiesArr[0];
  UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
  console.log(`\n开始【京东账号1】${UserName}\n`);

  let exist: string[];
  try {
    accessSync('./json/jxgc_stock.json')
    exist = JSON.parse(readFileSync('./json/jxgc_stock.json').toString())
  } catch (e) {
    exist = []
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
})()

async function api() {
  let url: string = `https://wq.jd.com/dreamfactory/diminfo/GetCommodityList?zone=dream_factory&flag=2&pageNo=1&pageSize=12&_time=${Date.now()}&_stk=_time%2Cflag%2CpageNo%2CpageSize%2Czone&_ste=1&_=${Date.now()}&sceneval=2`
  url = h5st(url, '_time,flag,pageNo,pageSize,zone', {}, 10001)
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