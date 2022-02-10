/**
 * 农场补充任务
 * cron: 0 11,12 * * *
 */

import axios from 'axios'
import USER_AGENT, {requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    for (let k = 0; k < 3; k++) {
      console.log(`round:${k + 1}`)
      res = await api("taskInitForFarm", {"version": 14, "channel": 1, "babelChannel": "120"})
      for (let t of res.gotBrowseTaskAdInit.userBrowseTaskAds) {
        if (t.limit !== t.hadGotTimes) {
          if (t.hadFinishedTimes !== 0) {
            // 领取
            res = await api("browseAdTaskForFarm", {"advertId": t.advertId, "type": 1, "version": 14, "channel": 1, "babelChannel": "120"})
            console.log('领取水滴：', res.amount)
            await wait(2000)
          } else {
            // 做任务
            res = await api("browseAdTaskForFarm", {"advertId": t.advertId, "type": 0, "version": 14, "channel": 1, "babelChannel": "120"})
            if (res.code === '0')
              console.log(`${t.mainTitle}：任务完成`)
            else
              console.log(`${t.mainTitle}：任务失败-${res.code}`)
            await wait((t.time || 3) * 1000)
          }
        }
      }
      await wait(3000)
    }
  }
})()

async function api(fn: string, body: any) {
  let {data}: any = await axios.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${escape(JSON.stringify(body))}&appid=wh5`, {
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