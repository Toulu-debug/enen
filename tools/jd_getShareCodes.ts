import axios from 'axios';
import USER_AGENT, {requireConfig, TotalBean} from './TS_USER_AGENTS';

let cookie: string = '', res: any = '', UserName: string, index: number;

!(async () => {
  let cookiesArr: any = await requireConfig();

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

    res = await api()
    console.log('互助码：', res.data.shareId)
  }
})()

async function api() {
  let {data} = await axios.post('https://api.m.jd.com/api',
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
  return data
}