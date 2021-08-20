/**
 * 农场补充任务
 * cron: 0 11,12 * * *
 */
import axios from 'axios';
import USER_AGENT, {requireConfig, TotalBean, wait} from './TS_USER_AGENTS';
import * as dotenv from 'dotenv';

const notify = require('./sendNotify')
dotenv.config()
let cookie: string = '', res: any = '';

let UserName: string, index: number;
!(async () => {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    if (!isLogin) {
      notify.sendNotify(__filename.split('/').pop(), `cookie已失效\n京东账号${index}：${nickName || UserName}`)
      continue
    }
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

    for (let k = 0; k < 3; k++) {
      console.log(`round:${k + 1}`)
      res = await api("taskInitForFarm", {"version": 14, "channel": 1, "babelChannel": "120"})
      for (let t of res.gotBrowseTaskAdInit.userBrowseTaskAds) {
        if (t.limit !== t.hadGotTimes) {
          if (t.hadFinishedTimes !== 0) {
            // 领取
            res = await api("browseAdTaskForFarm", {"advertId": t.advertId, "type": 1, "version": 14, "channel": 1, "babelChannel": "120"})
            console.log('领取水滴：', res.amount)
          } else {
            // 做任务
            res = await api("browseAdTaskForFarm", {"advertId": t.advertId, "type": 0, "version": 14, "channel": 1, "babelChannel": "120"})
            if (res.code === '0')
              console.log(`${t.mainTitle}：任务完成`)
            else
              console.log(`${t.mainTitle}：任务失败-${res.code}`)
          }
          await wait(2000)
        }
      }
      await wait(3000)
    }
  }
})()

async function api(fn: string, body: any) {
  let {data} = await axios.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${escape(JSON.stringify(body))}&appid=wh5`, {
    headers: {
      'Referer': 'https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html',
      'Connection': 'keep-alive',
      'Origin': 'https://carry.m.jd.com',
      'Host': 'api.m.jd.com',
      'User-Agent': USER_AGENT,
      'Cookie': cookie
    }
  })
  return data
}