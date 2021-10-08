// TODO 更新时推送

import axios from "axios";
import {requireConfig, exceptCookie, wait} from "./TS_USER_AGENTS";
import * as path from "path";

let cookie: string = '', UserName: string, index: number;

!(async () => {
  let cookiesArr: any = await requireConfig();
  let except: string[] = exceptCookie(path.basename(__filename));
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    let t: number = Date.now();
    axios.get(`https://wq.jd.com/bases/orderlist/list?order_type=2&start_page=1&last_page=0&page_size=10&callersource=mainorder&t=${t}&sceneval=2&_=${t + 1}&sceneval=2`, {
      headers: {
        'authority': 'wq.jd.com',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'referer': 'https://wqs.jd.com/',
        'cookie': cookie
      }
    }).then((res: object) => {
      for (let order of res['data']['orderList']) {
        let title: string = order['productList'][0]['title'], t: string = order['progressInfo']['tip'], status: string = order['progressInfo']['content']
        console.log(title)
        console.log('\t', t, status)
        console.log()
      }
    })
    await wait(1000)
  }
})()