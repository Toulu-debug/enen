/**
 * 京东-领现金
 * 兼容panda api和本地sign
 *
 * 使用panda sign
 * export PANDA_TOKEN=""
 * 本地sign算法 import {getSign} from './test/sign'
 */

import USER_AGENT, {post, getCookie, wait} from './TS_USER_AGENTS'
import {existsSync} from "fs";

let cookie: string = '', res: any = '', data: any, UserName: string, PANDA_TOKEN: string = undefined, getSign: any = undefined

if (existsSync('./test/sign.ts')) {
  getSign = require('./test/sign').getSign
  console.log('使用本地sign')
} else {
  console.log('未找到本地sign')
  PANDA_TOKEN = process.env.PANDA_TOKEN
  if (PANDA_TOKEN) {
    console.log('使用panda api')
    getSign = async (fn: string, body: object) => {
      let {data} = await post('https://api.jds.codes/jd/sign', {'fn': fn, 'body': body}, {
        'Authorization': `Bearer ${PANDA_TOKEN}`
      })
      return data.sign
    }
  } else {
    console.log('未设置PANDA_TOKEN\n脚本退出')
    process.exit(0)
  }
}

!(async () => {
  let cookiesArr: string[] = await getCookie()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    res = await api('cash_homePage', {})
    if (res.data.result.signedStatus !== 1) {
      console.log('今日未签到')
      data = await api('cash_sign', {"remind": 0, "inviteCode": "", "type": 0, "breakReward": 0})
      await wait(1000)
      console.log('签到成功')
    }
    res = await api('cash_homePage', {})

    await wait(1000)
    let type: number[] = [2, 4, 31, 16, 3, 5, 17, 21]
    let otherTaskNum = res.data.result.taskInfos.filter(item => !type.includes(item.type)).length
    let taskNum = res.data.result.taskInfos.filter(item => type.includes(item.type)).length
    console.log(taskNum, otherTaskNum)

    for (let i = 0; i < 10; i++) {
      res = await api('cash_homePage', {})
      if (res.data.result.taskInfos.filter(item => type.includes(item.type) && item.doTimes === item.times).length === taskNum) {
        console.log('任务全部完成')
        break
      }
      for (let t of res?.data?.result?.taskInfos || []) {
        if (t.doTimes < t.times && t.type !== 7) {
          console.log(t.name)
          data = await api('cash_doTask', {"type": t.type, "taskInfo": t.desc})
          await wait(t.duration * 1000 || 1000)
          if (data.data.bizCode === 0) {
            console.log('任务完成', data.data.result.totalMoney ?? '')
            break
          } else {
            console.log('任务失败', JSON.stringify(data))
            break
          }
        }
      }
      await wait(2000)
    }
  }
})()

async function api(fn: string, body: object) {
  let sign = PANDA_TOKEN ? await getSign(fn, body) : getSign(fn, body)
  return await post(`https://api.m.jd.com/client.action?functionId=${fn}`, sign, {
    'Host': 'api.m.jd.com',
    'Cookie': cookie,
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': USER_AGENT,
    'referer': ''
  })
}
