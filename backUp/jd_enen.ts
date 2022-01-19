/**
 * enen
 * cron: * * * * *
 */

import axios from "axios";
import USER_AGENT, {requireConfig, wait} from "../TS_USER_AGENTS";

let cookie: string = '', UserName: string, index: number;

!(async () => {
  let cookiesArr: string[] = await requireConfig();
  await wait(5000)
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    axios.get('https://plogin.m.jd.com/cgi-bin/ml/mlogout?appid=300&returnurl=https%3A%2F%2Fm.jd.com%2F', {
      headers: {
        'authority': 'plogin.m.jd.com',
        "User-Agent": USER_AGENT,
        'cookie': cookie
      }
    }).then((res: any) => {
      console.log(1)
    }).catch((e: any) => {
      console.log(0)
    })
  }
})()
