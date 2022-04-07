import USER_AGENT, {getRandomNumberByRange, o2s, post, requireConfig, wait} from './TS_USER_AGENTS'
import 'dotenv/config'

let cookie: string = '', res: any = '', data: any, UserName: string
let message: string = '', pandaToken: string[] = process.env.PANDA_TOKEN ? process.env.PANDA_TOKEN.split('&') : []

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
    message += `【账号${index + 1}】  ${UserName}\n`

    res = await api('cash_homePage', {})

    o2s(res)
    if (res.data.result.signedStatus !== 1) {
      console.log('今日未签到')
      data = await api('cash_sign', {"remind": 0, "inviteCode": "", "type": 0, "breakReward": 0})
      await wait(1000)
      o2s(data, '签到成功')
    }
    res = await api('cash_homePage', {})
    await wait(1000)
    let type: number[] = [2, 4, 31, 16, 3, 5, 17, 21]
    let otherTaskNum = res.data.result.taskInfos.filter(item => !type.includes(item.type)).length
    let taskNum = res.data.result.taskInfos.filter(item => type.includes(item.type)).length
    console.log(taskNum, otherTaskNum)

    for (let i = 0; i < 10; i++) {
      res = await api('cash_homePage', {})
      o2s(res)
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
            o2s(data, '任务失败')
            break
          }
        }
      }
      await wait(2000)
    }
    const fs = require('fs')
    fs.writeFileSync('.env', 'PANDA_TOKEN=""\n')
  }
})()

async function api(fn: string, body: object) {
  let sign = await post('https://api.jds.codes/jd/sign', {fn, body}, {'Authorization': `Bearer ${pandaToken[getRandomNumberByRange(0, pandaToken.length - 1)]}`})
  if (!sign?.data?.sign) {
    o2s(sign, 'getSign Error')
    return {}
  }
  return await post(`https://api.m.jd.com/client.action?functionId=${fn}`, sign.data.sign, {
    'Host': 'api.m.jd.com',
    'Cookie': cookie,
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': USER_AGENT,
    'referer': ''
  })
}
