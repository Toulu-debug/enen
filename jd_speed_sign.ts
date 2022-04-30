/**
 * 极速版-签到+提现
 * cron: 45 0 * * *
 */

import {requireConfig, wait, post, o2s} from './TS_USER_AGENTS'
import {H5ST} from "./utils/h5st"

let cookie: string = '', res: any = '', UserName: string = '', h5stTool: H5ST = new H5ST("15097", "jdltapp;", "8317250570595470");

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    await h5stTool.__genAlgo()
    res = await api('apSignIn_day', {"linkId": "9WA12jYGulArzWS7vcrwhw", "serviceName": "dayDaySignGetRedEnvelopeSignService", "business": 1})
    o2s(res)
    try {
      if (res.data.retCode === 0) {
        console.log('签到成功')
      } else {
        console.log(res.data.retMessage)
      }
      await wait(2000)

      res = await api('signPrizeDetailList', {"linkId": "9WA12jYGulArzWS7vcrwhw", "serviceName": "dayDaySignGetRedEnvelopeSignService", "business": 1, "pageSize": 20, "page": 1})
      for (let t of res.data.prizeDrawBaseVoPageBean.items) {
        if (t.prizeType === 4 && t.prizeStatus === 0) {
          res = await api('apCashWithDraw', {"linkId": "9WA12jYGulArzWS7vcrwhw", "businessSource": "DAY_DAY_RED_PACKET_SIGN", "base": {"prizeType": t.prizeType, "business": t.business, "id": t.id, "poolBaseId": t.poolBaseId, "prizeGroupId": t.prizeGroupId, "prizeBaseId": t.prizeBaseId}})
          console.log(parseFloat(t.prizeValue), res.data.message)
          await wait(2000)
        }
      }
    } catch (e) {
      console.log('error', e)
    }
    await wait(2000)
  }
})()

async function api(fn: string, body: object) {
  let timestamp: number = Date.now()
  let h5st: string = h5stTool.__genH5st({
    appid: 'activities_platform',
    body: JSON.stringify(body),
    client: 'H5',
    clientVersion: '1.0.0',
    functionId: fn,
    t: timestamp.toString()
  })
  return await post('https://api.m.jd.com/', `functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&t=${timestamp}&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=${h5st}`, {
    'Host': 'api.m.jd.com',
    'User-Agent': 'jdltapp;android;3.8.16;',
    'Origin': 'https://daily-redpacket.jd.com',
    'Referer': 'https://daily-redpacket.jd.com/',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': cookie
  })
}
