/**
 * 极速版-领红包
 */

import {requireConfig, wait, get} from './TS_USER_AGENTS'
import {H5ST} from "./h5st";

let cookie: string = '', res: any = '', UserName: string = ''

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    res = await api('spring_reward_query', {"linkId": "Eu7-E0CUzqYyhZJo9d3YkQ", "inviter": ""})
    let remainChance: number = res.data.remainChance
    console.log('剩余抽奖次数：', remainChance)
    for (let i = 0; i < remainChance; i++) {
      res = await api('spring_reward_receive', {"inviter": "", "linkId": "Eu7-E0CUzqYyhZJo9d3YkQ"})
      try {
        console.log('抽奖成功', res.data.received.prizeDesc)
      } catch (e) {
        console.log('抽奖失败')
        break
      }
      await wait(2000)
    }
  }
})()

async function api(fn: string, body: object) {
  let timestamp: number = Date.now(), t: { key: string, value: string } [] = [
    {key: 'appid', value: 'activities_platform'},
    {key: 'body', value: JSON.stringify(body)},
    {key: 'client', value: 'H5'},
    {key: 'clientVersion', value: '1.0.0'},
    {key: 'functionId', value: fn},
    {key: 't', value: timestamp.toString()},
  ]
  let h5st: string = await new H5ST(t, "07244", "jdltapp;", "5817062902662730").__run()
  return await get(`https://api.m.jd.com/?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&t=${timestamp}&appid=activities_platform&h5st=${h5st}`, {
    'Host': 'api.m.jd.com',
    'Origin': 'https://prodev.m.jd.com',
    'User-Agent': 'jdltapp;',
    'Referer': 'https://prodev.m.jd.com/',
    'Cookie': cookie
  })
}