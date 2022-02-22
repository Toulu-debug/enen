/**
 * 京东-汽车-签到
 * cron: 15 1 * * *
 */

import axios from 'axios'
import {requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
    try {
      res = await api()
      console.log(res.data?.dailyAward?.title || res.data?.continuityAward?.title)
      console.log('获得京豆', res.data?.dailyAward?.beanAward?.beanCount * 1 || res.data?.continuityAward?.beanAward?.beanCount * 1)

      await wait(2000)

      // res = await cgame()
      // console.log('获得京豆', res.data.beanNum)
    } catch (e) {
      console.log(e)
    }
  }
})()

async function api() {
  let {data} = await axios.post('https://api.m.jd.com/client.action', 'functionId=signBeanIndex&appid=ld', {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Host': 'api.m.jd.com',
      'Origin': 'https://api.m.jd.com',
      'Referer': 'https://api.m.jd.com',
      'Cookie': cookie
    }
  })
  return data
}

async function cgame() {
  let {data} = await axios.post('https://cgame-stadium.jd.com/api/v1/sign', '', {
    headers: {
      'Connection': 'keep-alive',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      'Origin': 'https://pro.m.jd.com',
      'ActivityId': '7c51826be9f241c1ad9733df34d242c5',
      'Host': 'cgame-stadium.jd.com',
      'Referer': 'https://pro.m.jd.com/mall/active/dj6us2JJRLMMBb4iDaSK4wxvBMt/index.html',
      'Accept-Language': 'zh-cn',
      'Accept': 'application/json',
      'Cookie': cookie
    }
  })
  return data
}