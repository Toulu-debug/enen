/**
 * 京东-东东农场-助力
 * 所有CK助力顺序
 * 内部 -> 助力池
 * 和jd_fruit.js同方法自己设置内部码
 * 如果没有添加内部码，直接助力助力池
 * cron: 35 0,3,5 * * *
 */

import {getDate} from "date-fns"
import {H5ST} from "./utils/h5st"
import USER_AGENT, {get, getRandomNumberByRange, getShareCodePool, o2s, requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', data: any, UserName: string
let shareCodeSelf: string[] = [], shareCodePool: string[] = [], shareCode: string[] = [], shareCodeFile: object = require('./jdFruitShareCodes')
let message: string = '', log: { help: string, runTimes: string } = {help: '', runTimes: ''}, h5stTool: H5ST = new H5ST("0c010", USER_AGENT, "8389547038003203")

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
    message += `【账号${index + 1}】  ${UserName}\n`
    log.help += `【账号${index + 1}】  ${UserName}\n`
    log.runTimes += `【账号${index + 1}】  ${UserName}\n`

    await h5stTool.__genAlgo()
    if (Object.keys(shareCodeFile)[index]) {
      shareCodeSelf = shareCodeFile[Object.keys(shareCodeFile)[index]].split('@')
    }
    o2s(shareCodeSelf, `第${index + 1}个账号获取的内部互助`)

    res = await api('initForFarm', {"version": 11, "channel": 3})
    if (res.code !== '0') {
      console.log('初始化失败')
      await wait(2000)
      continue
    }
    try {
      console.log('助力码', res.farmUserPro.shareCode)
      for (let i = 0; i < 5; i++) {
        try {
          let today: number = getDate(new Date())
          res = await get(`https://api.jdsharecode.xyz/api/runTimes0407?activityId=farm&sharecode=${res.farmUserPro.shareCode}&today=${today}`)
          console.log(res)
          log.runTimes += `第${i + 1}次${res}\n`
          break
        } catch (e) {
          console.log(`第${i + 1}次上报失败`, e)
          log.runTimes += `第${i + 1}次上报失败 ${typeof e === 'object' ? JSON.stringify(e) : e}\n`
          await wait(getRandomNumberByRange(10000, 30000))
        }
      }
    } catch (e) {
      console.log('获取助力码失败，黑号？')
      continue
    }
    await wait(1000)

    // 助力
    shareCodePool = await getShareCodePool('farm', 50)
    shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodePool]))

    // for (let code of shareCodeSelf) {
    //   console.log(`账号 ${UserName} 去助力 ${code} ${shareCodeSelf.includes(code) ? '*内部*' : ''}`)
    //   res = await api('initForFarm', {"mpin": "", "utm_campaign": "t_335139774", "utm_medium": "appshare", "shareCode": code, "utm_term": "Wxfriends", "utm_source": "iosapp", "imageUrl": "", "nickName": "", "version": 14, "channel": 2, "babelChannel": 0})
    //   await wait(5000)
    //   if (res.helpResult.code === '7') {
    //     console.log('不给自己助力')
    //   } else if (res.helpResult.code === '0') {
    //     console.log('助力成功,获得', res.helpResult.salveHelpAddWater)
    //     log.help += `助力成功 ${code} ${shareCodeSelf.includes(code) ? '*内部*' : ''}\n`
    //   } else if (res.helpResult.code === '8') {
    //     console.log('上限')
    //     break
    //   } else if (res.helpResult.code === '9') {
    //     console.log('已助力')
    //     log.help += `已助力 ${code} ${shareCodeSelf.includes(code) ? '*内部*' : ''}\n`
    //   } else if (res.helpResult.code === '10') {
    //     console.log('已满')
    //   } else if (res.helpResult.remainTimes === 0) {
    //     console.log('上限')
    //     break
    //   }
    // }
    // await wait(10000)

    // 助力奖励
    res = await api('farmAssistInit', {"version": 14, "channel": 1, "babelChannel": "120"})
    if (res.code !== '0') {
      console.log('farmAssistInit Error')
      await wait(2000)
      continue
    }
    await wait(3000)
    o2s(res, 'farmAssistInit')
    let farmAssistInit_waterEnergy: number = 0
    for (let t of res.assistStageList) {
      if (t.percentage === '100%' && t.stageStaus === 2) {
        data = await api('receiveStageEnergy', {"version": 14, "channel": 1, "babelChannel": "120"})
        await wait(3000)
        farmAssistInit_waterEnergy += t.waterEnergy
      } else if (t.stageStaus === 3) {
        farmAssistInit_waterEnergy += t.waterEnergy
      }
    }
    console.log('收到助力', res.assistFriendList.length)
    console.log('助力已领取', farmAssistInit_waterEnergy)
    message += `【助力已领取】  ${farmAssistInit_waterEnergy}\n`

    message += '\n\n'
    await wait(60000)
  }
  if (message) {
    console.log('===================')
    console.log(message)
    console.log('===================')
  }
  console.log(log.help)
  console.log(log.runTimes)
})()

async function api(fn: string, body: object) {
  let h5st: string = h5stTool.__genH5st({
    'appid': 'wh5',
    'body': JSON.stringify(body),
    'client': 'apple',
    'clientVersion': '10.2.4',
    'functionId': fn,
  })
  return await get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${JSON.stringify(body)}&appid=wh5&client=apple&clientVersion=10.2.4&h5st=${h5st}`, {
    "Host": "api.m.jd.com",
    "Origin": "https://carry.m.jd.com",
    "User-Agent": USER_AGENT,
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "Referer": "https://carry.m.jd.com/",
    "Cookie": cookie
  })
}