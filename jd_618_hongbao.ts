/**
 * 20点开奖的🧧
 */

import axios from 'axios'
import USER_AGENT, {getCookie, getshareCodeHW, o2s, wait} from './TS_USER_AGENTS'
import {Log_618} from "./utils/log_618"

let cookie: string = '', res: any = '', UserName: string, index: number, log: { log: string, random: string }, secretp: string = ''
let shareCodeHW: string[] = [], shareCodeSelf: string  [] = [], shareCode: string[] = []

!(async () => {
  let cookiesArr: string[] = await getCookie()
  let tool: Log_618 = new Log_618()

  for (let i = 0; i < cookiesArr.length; i++) {
    try {
      cookie = cookiesArr[i]
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      index = i + 1
      console.log(`\n开始【京东账号${index}】${UserName}\n`)

      res = await api('promote_getHomeData', {})
      secretp = res.data.result.homeMainInfo.secretp

      res = await api('promote_pk_getAmountForecast', {})
      console.log('🧧', parseFloat(res.data.result.userAward))

      log = await tool.main()
      await wait(3000)

      res = await api('promote_pk_getExpandDetail', {"ss": JSON.stringify({extraData: {log: encodeURIComponent(log.log), sceneid: 'RAhomePageh5'}, secretp: secretp, random: log.random})})
      console.log('助力码', res.data.result.inviteId)
      shareCodeSelf.push(res.data.result.inviteId)
    } catch (e) {
      console.log('error', e)
    } finally {
      await wait(1000)
    }
  }

  console.log('内部互助')
  o2s(shareCodeSelf)

  for (let i = 0; i < cookiesArr.length; i++) {
    try {
      cookie = cookiesArr[i]
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      index = i + 1
      console.log(`\n开始【京东账号${index}】${UserName}\n`)
      res = await api('promote_getHomeData', {})
      secretp = res.data.result.homeMainInfo.secretp

      if (shareCodeHW.length === 0) {
        shareCodeHW = await getshareCodeHW('lyb_pz')
      }
      if (i === 0) {
        shareCode = Array.from(new Set([...shareCodeHW, ...shareCodeSelf]))
      } else {
        shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodeHW]))
      }
      for (let code of shareCode) {
        console.log('去助力', code)
        log = await tool.main()
        res = await api('promote_pk_collectPkExpandScore', {
          "ss": JSON.stringify({extraData: {log: encodeURIComponent(log.log), sceneid: 'RAhomePageh5'}, secretp: secretp, random: log.random}),
          "actionType": "0",
          "inviteId": code
        })
        console.log(res.data.bizMsg)
        await wait(3000)
      }
    } catch (e) {
      console.log('error', e)
    } finally {
      await wait(1000)
    }
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