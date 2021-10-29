/**
 * 单独收牛牛
 * cron: 0,30 * * * *
 */

import axios from 'axios';
import * as path from 'path';
import {sendNotify} from './sendNotify';
import {requireConfig, wait, requestAlgo, h5st, exceptCookie, resetHosts, randomString} from './TS_USER_AGENTS';

const cow = require('./utils/jd_jxmc.js').cow;
const token = require('./utils/jd_jxmc.js').token;

let cookie: string = '', res: any = '', homePageInfo: any, jxToken: any, UserName: string, index: number;

!(async () => {
  try {
    resetHosts();
  } catch (e) {
  }

  await requestAlgo();
  let cookiesArr: any = await requireConfig();
  if (process.argv[2]) {
    console.log('收到命令行cookie')
    cookiesArr = [unescape(process.argv[2])]
  }
  let except: string[] = exceptCookie(path.basename(__filename));

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    jxToken = await token(cookie);
    homePageInfo = await api('queryservice/GetHomePageInfo', 'activeid,activekey,channel,isgift,isqueryinviteicon,isquerypicksite,jxmc_jstoken,phoneid,sceneid,timestamp', {
      isgift: 1,
      isquerypicksite: 1,
      isqueryinviteicon: 1
    })
    let lastgettime: number
    if (homePageInfo.data?.cow?.lastgettime) {
      lastgettime = homePageInfo.data.cow.lastgettime
    } else {
      continue
    }

    let food: number = 0
    try {
      food = homePageInfo.data.materialinfo[0].value;
    } catch (e: any) {
      console.log('未开通？黑号？')
      continue
    }

    // 收牛牛
    let cowToken = await cow(lastgettime);
    res = await api('operservice/GetCoin', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,token', {token: cowToken})
    if (res.ret === 0)
      console.log('收牛牛:', res.data.addcoin)
    else
      console.log('收牛牛:', res)
    await wait(1000)
  }
})()

async function api(fn: string, stk: string, params: object) {
  let url: string;
  if (['GetUserTaskStatusList', 'DoTask', 'Award'].indexOf(fn) > -1) {
    url = h5st(`https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?_=${Date.now()}&source=jxmc&bizCode=jxmc&_stk=${encodeURIComponent(stk)}&_ste=1&sceneval=2`, stk, params, 10028)
  } else {
    url = h5st(`https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activeid=jxmc_active_0001&activekey=null&jxmc_jstoken=${jxToken['farm_jstoken']}&timestamp=${jxToken['timestamp']}&phoneid=${jxToken['phoneid']}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now() + 2}&sceneval=2`, stk, params, 10028)
  }
  try {
    let {data}: any = await axios.get(url, {
      headers: {
        'Host': 'm.jingxi.com',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'User-Agent': `jdpingou;iPhone;5.9.0;12.4.1;${randomString(40)};network/wifi;`,
        'Referer': 'https://st.jingxi.com/pingou/jxmc/index.html',
        'Cookie': cookie
      }
    })
    if (typeof data === 'string')
      return JSON.parse(data.replace(/jsonpCBK.?\(/, '').split('\n')[0])
    return data
  } catch (e: any) {
    console.log('api Error:', e)
    return {}
  }
}