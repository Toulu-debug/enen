/**
 * 健康能量收集
 * cron: 5-45/20 * * * *
 */

import axios from "axios";
import * as path from "path"
import USER_AGENT, {getCookie, exceptCookie, wait, o2s} from "./TS_USER_AGENTS"

let cookie: string = '', UserName: string, res: any = ''

!(async () => {
  let cookiesArr: string[] = await getCookie()
  let except: string[] = exceptCookie(path.basename(__filename))

  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    res = await api('jdhealth_collectProduceScore', {})
    o2s(res)

    await wait(1000)
  }
})()

async function api(fn: string, body: object) {
  let {data} = await axios.post('https://api.m.jd.com/', `functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&uuid=`, {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': USER_AGENT,
      'Referer': 'https://h5.m.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  })
  return data
}