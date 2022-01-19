/**
 * 单独收牛牛
 * cron: 0,30 * * * *
 */

import axios from 'axios';
import * as path from 'path';
import {requireConfig, wait, exceptCookie, randomWord} from './TS_USER_AGENTS';
import {requestAlgo, geth5st} from "./utils/V3";
import {existsSync, readFileSync} from "fs";

let cookie: string = '', res: any = '', homePageInfo: any, jxToken: { farm_jstoken: string, phoneid: string, timestamp: number }, UserName: string, index: number;
let {cow, token} = require('./utils/jd_jxmc.js'), ua: string = 'jdpingou;';

!(async () => {
  let account: any[] = [];
  if (existsSync('./utils/account.json')) {
    try {
      account = JSON.parse(readFileSync('./utils/account.json').toString())
    } catch (e) {
      console.log(e)
    }
  }

  await requestAlgo('00df8', 'jdpingou;');
  let cookiesArr: string[] = await requireConfig();
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

    ua = 'jdpingou;'
    for (let acc of account) {
      if (acc?.pt_pin.includes(UserName) && acc?.jdpingou) {
        ua = acc.jdpingou
        console.log('指定UA：', ua)
        break
      }
    }

    jxToken = await token(cookie);
    homePageInfo = await api('queryservice/GetHomePageInfo', 'activeid,activekey,channel,isgift,isqueryinviteicon,isquerypicksite,isregionflag,jxmc_jstoken,phoneid,sceneid,timestamp', {isgift: 1, isquerypicksite: 1, isqueryinviteicon: 1, isregionflag: 0, activeid: null})
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
    res = await api('operservice/GetCoin', 'activeid,activekey,channel,commtype,jxmc_jstoken,phoneid,sceneid,timestamp,token', {token: cowToken, commtype: 0, activeid: 'jxmc_active_0001'})
    if (res.ret === 0)
      console.log('收牛牛:', res.data.addcoin)
    else
      console.log('收牛牛:', res)
    await wait(3000)
  }
})()

async function api(fn: string, stk: string, params: object) {
  let url: string, t: { key: string, value: string } [] = [
    {key: 'activekey', value: 'null'},
    {key: 'channel', value: '7'},
    {key: 'jxmc_jstoken', value: jxToken.farm_jstoken},
    {key: 'phoneid', value: jxToken.phoneid},
    {key: 'sceneid', value: '1001'},
    {key: 'timestamp', value: jxToken.timestamp.toString()},
  ]
  url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activekey=null&jxmc_jstoken=${jxToken['farm_jstoken']}&timestamp=${jxToken.timestamp}&phoneid=${jxToken.phoneid}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`

  for (let [key, value] of Object.entries(params)) {
    t.push({key, value})
    url += `&${key}=${value}`
  }
  url += `&h5st=${encodeURIComponent(geth5st(t, '00df8'))}`
  try {
    let {data}: any = await axios.get(url, {
      headers: {
        'Host': 'm.jingxi.com',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'User-Agent': ua,
        'Referer': 'https://st.jingxi.com/pingou/jxmc/index.html',
        'Cookie': cookie
      }
    })
    return JSON.parse(data.replace(/jsonpCBK.?\(/, '').split('\n')[0])
  } catch (e: any) {
    console.log('api Error:', e)
    return {}
  }
}