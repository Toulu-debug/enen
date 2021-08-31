/**
 * 检测cookie是否有效
 * cron: 0 * * * *
 */
import axios from "axios";
import USER_AGENT, {requireConfig} from "./TS_USER_AGENTS";

const notify = require('./sendNotify')
let cookie: string = '', UserName: string, index: number, errMsg: string = '';

!(async () => {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;

    await api(index, cookie, UserName)
  }
  if (errMsg)
    await notify.sendNotify("Cookie失效", errMsg, '', '你好，世界！')
})()

async function api(index: number, cookie: string, username: string) {
  let {data} = await axios.get(`https://wq.jd.com/user/info/QueryJDUserInfo?sceneid=80027&_=${Date.now()}&sceneval=2`, {
    headers: {
      "Accept": "application/json,text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookie,
      "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
      "User-Agent": USER_AGENT
    }
  })
  if (data.retcode === 0) {
    console.log(index, '✅', username)
  } else {
    console.log(index, '❌', username)
    errMsg += `${index} ${username}\n`
  }
  // console.log(data.base.jdNum)
}
