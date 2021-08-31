/**
 * 京喜牧场兑换新品通知
 * 推送新上商品
 * cron: 0 * * * *
 */

import axios from 'axios';
import {requireConfig, requestAlgo, decrypt} from './TS_USER_AGENTS';
import {readFileSync, writeFileSync, accessSync} from "fs";

const notify = require('./sendNotify')

let cookie: string = '', res: any = '', UserName: string;

!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();
  cookie = cookiesArr[0];
  UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
  try {
    accessSync('./jxmc_stock.json')
  } catch (e) {
    writeFileSync('./jxmc_stock.json', '{}', 'utf-8')
  }
  let exist: any = JSON.parse(readFileSync('./jxmc_stock.json', 'utf-8'))
  let items: string = '', message: string = '';
  res = await api('queryservice/GetGoodsListV2', 'channel,sceneid')
  for (let good of res.data.goodslist) {
    if (!Object.keys(exist).includes(good.prizepool)) {
      items += good.prizepool + ','
      exist[good.prizepool] = {
        id: good.prizepool,
        egg: good.neednum
      }
    }
  }
  if (items) {
    res = await getEgg(items)
    for (let t of res.result) {
      exist[t.active].name = t.prizes[0].Name
    }
  }
  writeFileSync('./jxmc_stock.json', JSON.stringify(exist, null, 2), 'utf-8')
  for (let j of Object.keys(exist)) {
    if (items.indexOf(j) > -1) {
      message += exist[j].name + '\t' + exist[j].egg + '\n'
    }
  }
  if (message) {
    await notify.sendNotify('京喜牧场兑换', message, '', '\n\n你好，世界！')
  }
  console.log(exist)
})()

interface Params {
  isgift?: number,

}

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise(async (resolve, reject) => {
    let url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&_stk=${encodeURIComponent(stk)}&_ste=1&sceneval=2`
    if (Object.keys(params).length !== 0) {
      let key: (keyof Params)
      for (key in params) {
        if (params.hasOwnProperty(key))
          url += `&${key}=${params[key]}`
      }
    }
    url += '&h5st=' + decrypt(stk, url)
    try {
      let {data} = await axios.get(url, {
        headers: {
          'Cookie': cookie,
          'Host': 'm.jingxi.com',
          'User-Agent': 'jdpingou;',
          'Referer': 'https://st.jingxi.com/',
        }
      })
      resolve(data)
    } catch (e) {
      reject(401)
    }
  })
}

function getEgg(items: string) {
  return new Promise(async resolve => {
    let {data} = await axios.get(`https://m.jingxi.com/active/queryprizedetails?actives=${items}&_=${Date.now()}&sceneval=2`, {
      headers: {
        'Cookie': cookie,
        'Host': 'm.jingxi.com',
        'User-Agent': 'jdpingou;',
        'Referer': 'https://st.jingxi.com/',
      }
    })
    data = JSON.parse(data.replace('try{ QueryPrizesDetails(', '').replace(');}catch(e){}', ''))
    resolve(data)
  })
}