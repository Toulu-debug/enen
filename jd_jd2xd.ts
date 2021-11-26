/**
 * 京豆 -> 喜豆
 * cron: 0 6 * * *
 */

import USER_AGENT, {o2s, requireConfig, wait} from "./TS_USER_AGENTS"
import axios from "axios"

let cookie: string = '', res: any = '', UserName: string, index: number

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)
    let total: number = 0
    res = await api()
    for (let j of res.expirejingdou) {
      total += j.expireamount
    }
    console.log('7天内过期', total)
    if (total) {
      res = await api(true, total)
      o2s(res)
      console.log('\n\nAPI有BUG，可能已转换成功，可再次运行查看')
    }
    await wait(2000)
  }
})()

async function api(transfer: boolean = false, total: number = 0) {
  let url: string = transfer
    ? `https://m.jingxi.com/deal/mactionv3/jd2xd?use=${total}&pingouchannel=1&bizkey=pingou&sceneval=2`
    : `https://wq.jd.com/activep3/singjd/queryexpirejingdou?_=${Date.now()}&sceneval=2`
  let {data} = await axios.get(url, {
    headers: {
      'content-type': 'application/json',
      'user-agent': USER_AGENT,
      'referer': 'https://happy.m.jd.com/babelDiy/Zeus/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html',
      'cookie': cookie
    }
  })
  if (!transfer) {
    return JSON.parse(data.match(/try{QueryExpireJingdou\((.*)/)[1])
  } else {
    return data
  }
}