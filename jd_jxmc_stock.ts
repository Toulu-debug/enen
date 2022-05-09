/**
 * 京喜牧场兑换新品通知
 * 推送新上商品
 * cron: 0 * * * *
 */

import axios from 'axios';
import {readFileSync, writeFileSync, existsSync} from "fs";
import {getCookie, wait, getRandomNumberByRange, randomWord, randomString} from './TS_USER_AGENTS';
import {requestAlgo, geth5st} from "./utils/V3";
import {token} from './utils/jd_jxmc.js'
import {sendNotify} from './sendNotify'

let cookie: string = '', res: any = '', UserName: string, jxToken: { farm_jstoken: string, timestamp: string, phoneid: string };

!(async () => {
  await requestAlgo('00df8');
  let cookiesArr: string[] = await getCookie();
  cookie = cookiesArr[getRandomNumberByRange(0, cookiesArr.length)];
  UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
  if (!existsSync('./json/jxmc_stock.json')) {
    writeFileSync('./json/jxmc_stock.json', '{}', 'utf-8')
  }
  let exist: object
  try {
    exist = JSON.parse(readFileSync('./json/jxmc_stock.json', 'utf-8'))
  } catch (e) {
    exist = {}
  }
  let items: string = '', message: string = ''
  res = await api('queryservice/GetGoodsListV2', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp', {})
  for (let good of res.data.goodslist) {
    if (!Object.keys(exist).includes(good.prizepool)) {
      items += good.prizepool + ','
      exist[good.prizepool] = {
        id: good.prizepool,
        egg: good.neednum
      }
    }
  }
  let allItems: string = items;
  if (items) {
    let arr: string[] = items.split(',');
    arr.pop();
    items = '';
    let result = [];
    for (let i = 0, len = arr.length; i < len; i += 30) {
      result.push(arr.slice(i, i + 30))
    }
    for (let group of result) {
      for (let id of group) {
        items += id + ','
      }
      res = await getEgg(items)
      await wait(1000)
      for (let t of res.result) {
        exist[t.active].name = t.prizes[0].Name
      }
      items = ''
    }
  }
  console.log(exist)
  writeFileSync('./json/jxmc_stock.json', JSON.stringify(exist, null, 2), 'utf-8')
  for (let j of Object.keys(exist)) {
    if (allItems.indexOf(j) > -1) {
      message += exist[j].name + '\t' + exist[j].egg + '\n'
    }
  }
  console.log(message)
  if (message) {
    await sendNotify('京喜牧场兑换', message)
  }
})()

interface Params {
  isgift?: number,
  activeid?: string,
  activekey?: string,
  jxmc_jstoken?: string,
  timestamp?: string,
  phoneid?: string
}

async function api(fn: string, stk: string, params: Params = {}) {
  jxToken = await token(cookie)
  let url: string, t: { key: string, value: string } [] = [
    {key: 'activeid', value: 'jxmc_active_0001'},
    {key: 'activekey', value: 'null'},
    {key: 'channel', value: '7'},
    {key: 'sceneid', value: '1001'},
    {key: 'jxmc_jstoken', value: jxToken.farm_jstoken},
    {key: 'timestamp', value: jxToken.timestamp},
    {key: 'phoneid', value: jxToken.phoneid},
  ]
  url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&_stk=${encodeURIComponent(stk)}&_ste=1&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
  for (let [key, value] of Object.entries(params)) {
    t.push({key, value})
    url += `&${key}=${value}`
  }
  let h5st = geth5st(t, '00df8')
  url += `&h5st=${encodeURIComponent(h5st)}`
  let {data}: any = await axios.get(url, {
    headers: {
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': `jdpingou;iPhone;5.14.2;${getRandomNumberByRange(12, 16)}.${getRandomNumberByRange(0, 3)};${randomString(40)};`,
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Referer': 'https://st.jingxi.com/',
      'Cookie': cookie
    }
  })
  return JSON.parse(data.match(/jsonpCBK.?\((.*)/)[1])
}

async function getEgg(items: string) {
  items = items.substring(0, items.length - 1)
  let {data} = await axios.get(`https://m.jingxi.com/active/queryprizedetails?actives=${items}&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`, {
    headers: {
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': `jdpingou;iPhone;5.14.2;${getRandomNumberByRange(12, 16)}.${getRandomNumberByRange(0, 3)};${randomString(40)};`,
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Referer': 'https://st.jingxi.com/',
      'Cookie': cookie
    }
  })
  return JSON.parse(data.match(/jsonpCBK.?\(([\s\S]*)\);/)[1])
}