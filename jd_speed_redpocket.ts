/**
 * 极速版-领红包
 */

import {requireConfig, wait, get, o2s} from './TS_USER_AGENTS'
import {H5ST} from "./utils/h5st"

let cookie: string = '', res: any = '', UserName: string = '', h5stTool: any = new H5ST("07244", "jdltapp;", "5817062902662730")

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
    try {
      await h5stTool.__genAlgo()
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
    } catch (e) {
      console.log('火爆')
    }
    await wait(5000)
  }
})()

async function api(fn: string, body: object) {
  let timestamp: number = Date.now()
  let h5st: string = h5stTool.__genH5st({
    appid: 'activities_platform',
    body: JSON.stringify(body),
    client: 'H5',
    clientVersion: '1.0.0',
    functionId: fn,
    t: timestamp.toString(),
  })
  return await get(`https://api.m.jd.com/?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&t=${timestamp}&appid=activities_platform&h5st=${h5st}`, {
    'Host': 'api.m.jd.com',
    'Origin': 'https://prodev.m.jd.com',
    'User-Agent': 'jdltapp;',
    'Referer': 'https://prodev.m.jd.com/',
    'Cookie': cookie
  })
}