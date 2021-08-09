/**
 * cron: 0 23 * * *
 * 查看助力码和助力次数
 */

import axios from 'axios';
import USER_AGENT, {requireConfig, TotalBean} from '../TS_USER_AGENTS';

const notify = require('../sendNotify')
let cookie: string = '', res: any = '', UserName: string, index: number;

!(async () => {
  let cookiesArr: any = await requireConfig();

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    if (!isLogin) {
      notify.sendNotify(__filename.split('/').pop(), `cookie已失效\n京东账号${index}：${nickName || UserName}`)
      continue
    }
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

    await carnivalcity()
  }
})()

async function carnivalcity() {
  res = await axios.post('https://api.m.jd.com/api',
    `appid=guardian-starjd&functionId=carnivalcity_jd_prod&body=${escape(JSON.stringify({apiMapping: "/khc/task/getSupport"}))}&t=${Date.now()}&loginType=2`, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://carnivalcity.m.jd.com",
        "Referer": "https://carnivalcity.m.jd.com/",
        "Cookie": cookie,
        "User-Agent": USER_AGENT,
      }
    })
  console.log('carnivalcity:', res.data.data.shareId)

  res = await axios.post('https://api.m.jd.com/api',
    `appid=guardian-starjd&functionId=carnivalcity_jd_prod&body=${escape(JSON.stringify({apiMapping: "/khc/index/supportList"}))}&t=${Date.now()}&loginType=2`, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://carnivalcity.m.jd.com",
        "Referer": "https://carnivalcity.m.jd.com/",
        "Cookie": cookie,
        "User-Agent": USER_AGENT,
      }
    })
  console.log('被助力：', res.data.data.supportedNums, '/', res.data.data.supportNeedNums)
}