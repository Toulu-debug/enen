/**
 * 每天检测cookie是否有效
 * cron: 10 * * * *
 */
import axios from "axios"
import USER_AGENT, {requireConfig} from "./TS_USER_AGENTS"

const notify = require('./sendNotify')
let cookie: string = '', UserName: string, index: number, errMsg: string = ''

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1

    await api(index, cookie, UserName)
  }
  if (errMsg)
    await notify.sendNotify("Cookie失效", errMsg, '', '你好，世界！')
})()

async function api(index: number, cookie: string, username: string) {
  let {data}: any = await axios.get(`https://me-api.jd.com/user_new/info/GetJDUserInfoUnion`, {
    headers: {
      Host: "me-api.jd.com",
      Connection: "keep-alive",
      Cookie: cookie,
      "User-Agent": USER_AGENT,
      "Accept-Language": "zh-cn",
      "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
      "Accept-Encoding": "gzip, deflate, br"
    }
  })
  if (data.retcode === '0') {
    console.log(index, '✅', username)
  } else {
    console.log(index, '❌', username)
    errMsg += `${index} ${username}\n`
  }
}
