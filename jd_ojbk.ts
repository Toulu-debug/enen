/**
 * jd_ojbk.ts
 * cron: * * * * *
 */

import axios from 'axios';
import USER_AGENT, {requireConfig} from "./TS_USER_AGENTS";

let cookie: string = '', UserName: string

!(async () => {
  if (new Date().getHours() === 25) {
    let cookiesArr: string[] = await requireConfig(false);
    for (let [index, value] of cookiesArr.entries()) {
      cookie = value;
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`);

      axios.get('https://plogin.m.jd.com/cgi-bin/ml/mlogout?appid=300&returnurl=https%3A%2F%2Fm.jd.com%2F', {
        headers: {
          'authority': 'plogin.m.jd.com',
          "User-Agent": USER_AGENT,
          'cookie': cookie
        }
      }).then()
    }
  }
})()
