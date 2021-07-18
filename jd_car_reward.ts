import axios from 'axios';
import {format} from 'date-fns';
import USER_AGENT, {requireConfig, TotalBean, wait} from "./TS_USER_AGENTS";

let UserName: string, index: number;
let cookie: string = '';

async function main() {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    if (!isLogin) {
      continue
    }
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);
    while (1){
      if(new Date().getSeconds() < 30){
        break
      }else {
        await wait(100)
      }
    }
    console.log('exchange()', format(new Date(), 'hh:mm:ss:SSS'))
    let {data} =await axios.get(`https://car-member.jd.com/api/v1/user/exchange/bean/check?timestamp=${Date.now()}`, {
      headers: {
        'Accept-Language': 'zh-cn',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://h5.m.jd.com',
        'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/44bjzCpzH9GpspWeBzYSqBA7jEtP/index.html',
        'User-Agent': USER_AGENT,
        'ActivityId': '39443aee3ff74fcb806a6f755240d127',
        'Host': 'car-member.jd.com',
        'Cookie': cookie
      }
    })
    console.log(data)
  }
}

main().then()
