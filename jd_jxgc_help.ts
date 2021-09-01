/**
 * 这是一个只会助力的脚本，因为没打工仔了。
 * 先内部，再助力池。
 * cron: 0,30 21-23 * * *
 */

import axios from 'axios';
import {requireConfig, wait, requestAlgo, decrypt} from './TS_USER_AGENTS';

let jxfactory: any;
try {
  jxfactory = require('../tools/jd_shareCodesTool').jxfactory
} catch (e) {
  jxfactory = require('./JDHelloWorld_jd_scripts_jd_shareCodesTool').jxfactory
}

let cookie: string = '', res: any = '', UserName: string, index: number;
let shareCodes: string[] = [], shareCodesInternal: string[] = [];

interface Params {
  name?: string,
  sharepin?: string
}

!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    let sharecode = await jxfactory(cookie)
    console.log('助力码:', sharecode)
    shareCodesInternal.push(sharecode)

    res = await api('friend/QueryFriendList', '_time,zone')
    console.log('收到助力:', res.data.hireListToday.length, '/', res.data.hireNumMax)
  }

  console.log('内部助力码:', shareCodesInternal)

  for (let emp of cookiesArr) {
    cookie = emp
    let empName: string = decodeURIComponent(emp.match(/pt_pin=([^;]*)/)![1])
    let sharecode = await jxfactory(emp)

    await getShareCodes()

    for (let boss of shareCodes) {
      if (sharecode === boss) {
        console.log('不给自己助力')
      } else {
        console.log(`${empName}给${boss}助力`)
        res = await api('friend/AssistFriend', '_time,sharepin,zone', {sharepin: boss})
        if (res.ret === 0) {
          console.log('助力成功')
          break
        } else if (res.ret === 11009) {
          console.log('助力失败:', res.msg)
          break
        } else {
          console.log('助力失败:', res.msg)
        }
        await wait(3000)
      }
    }
    console.log('')
  }
})()

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise(async (resolve, reject) => {
    let url = `https://m.jingxi.com/dreamfactory/${fn}?zone=dream_factory&_time=${Date.now()}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2`
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
          'Referer': 'https://actst.jingxi.com/pingou/dream_factory/index.html',
        }
      })
      resolve(data)
    } catch (e) {
      reject(401)
    }
  })
}

async function getShareCodes() {
  try {
    let {data} = await axios.get("https://api.sharecode.ga/api/jxfactory/30")
    console.log(`从助力池获取到30个:${JSON.stringify(data.data)}`)
    shareCodes = [...shareCodesInternal, ...data.data]
  } catch (e) {
    shareCodes = [...shareCodesInternal]
  }
}