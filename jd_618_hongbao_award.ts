/**
 * 运行即领取膨胀红包
 * cron: 5 21 * * *
 */

import axios from 'axios'
import USER_AGENT, {getCookie, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, index: number

!(async () => {
  let cookiesArr: string[] = await getCookie()
  for (let i = 0; i < cookiesArr.length; i++) {
    try {
      cookie = cookiesArr[i]
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      index = i + 1
      console.log(`\n开始【京东账号${index}】${UserName}\n`)

      res = await api('promote_pk_receiveAward', {})
      if (res.data.success) {
        console.log('领取膨胀红包', parseFloat(res.data.result.value))
      } else {
        console.log(res.data.bizMsg)
      }
      await wait(2000)
    } catch (e) {
    }
    await wait(2000)
  }
})()

async function api(fn: string, body: object) {
  let appid: string = fn.includes('promote_') ? 'signed_wh5' : 'wh5'
  let {data} = await axios.post(`https://api.m.jd.com/client.action?functionId=${fn}`, `functionId=${fn}&client=m&clientVersion=1.0.0&appid=${appid}&body=${JSON.stringify(body)}`, {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://wbbny.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': USER_AGENT,
      'Referer': 'https://wbbny.m.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  })
  return data
}