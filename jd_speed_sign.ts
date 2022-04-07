import axios from 'axios'
import {requireConfig, wait, o2s} from './TS_USER_AGENTS'
import {requestAlgo, geth5st} from "./utils/V3";
import {SHA256} from "crypto-js";

let cookie: string = '', res: any = '', UserName: string = ''

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    try {
      await requestAlgo('15097', 'jdltapp;')
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

      res = await api('apSignIn_day', {"linkId": "9WA12jYGulArzWS7vcrwhw", "serviceName": "dayDaySignGetRedEnvelopeSignService", "business": 1})
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
      console.log(e)
    }
    await wait(2000)
  }
})()

async function api(fn: string, body: object) {
  let timestamp: number = Date.now(), t: { key: string, value: string } [] = [
    {key: 'functionId', value: fn},
    {key: 'body', value: SHA256(JSON.stringify(body)).toString()},
    {key: 't', value: timestamp.toString()},
    {key: 'appid', value: 'activities_platform'},
    {key: 'client', value: 'H5'},
    {key: 'clientVersion', value: '1.0.0'},
  ]
  let h5st = geth5st(t, '8adfb')
  let {data} = await axios.post('https://api.m.jd.com/', `functionId=${fn}&body=${JSON.stringify(body)}&t=${timestamp}&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=${h5st}`, {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://daily-redpacket.jd.com',
      'User-Agent': 'jdltapp;',
      'Referer': 'https://daily-redpacket.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  })
  return data
}
