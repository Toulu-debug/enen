/**
 * 京东-东东农场-助力
 * 所有CK助力顺序
 * 内部 -> 助力池
 * 和jd_fruit.js同方法自己设置内部码
 * 如果没有添加内部码，直接助力助力池
 * cron: 35 0,3,5 * * *
 */

import USER_AGENT, {get, getCookie, wait, o2s, getShareCodePool, getRandomNumberByRange} from './TS_USER_AGENTS'
import {H5ST} from "./utils/h5st"
import {getDate} from "date-fns"
import {sendNotify} from './sendNotify'

let cookie: string = '', res: any = '', UserName: string, h5stTool: H5ST
let shareCodeSelf: string[] = [], log: { help: string, runTimes: string } = {help: '', runTimes: ''}, message: string = ''

!(async () => {
  let cookiesArr: string[] = await getCookie()
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

      h5stTool = new H5ST("0c010", USER_AGENT, process.env.FP_0C010 || "")
      await h5stTool.__genAlgo()

      res = await api('initForFarm', {"version": 11, "channel": 3})
      if (res.code !== '0') {
        console.log('初始化失败')
        continue
      }
      console.log('助力码', res.farmUserPro.shareCode)
      shareCodeSelf.push(res.farmUserPro.shareCode)

      for (let i = 0; i < 5; i++) {
        try {
          let today: number = getDate(new Date())
          res = await get(`https://api.jdsharecode.xyz/api/runTimes0701?activityId=farm&sharecode=${res.farmUserPro.shareCode}&today=${today}`)
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
      console.log('error', e)
      break
    }
    await wait(2000)
  }

  o2s(shareCodeSelf, '内部互助')
  let full: string[] = []
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])

      h5stTool = new H5ST("0c010", USER_AGENT, process.env.FP_0C010 || "")
      await h5stTool.__genAlgo()

      let shareCodePool: string[] = await getShareCodePool('farm', 50)
      let shareCode: string[] = Array.from(new Set([...shareCodeSelf, ...shareCodePool]))

      for (let code of shareCode) {
        console.log(`账号${index + 1} ${UserName} 去助力 ${code} ${shareCodeSelf.includes(code) ? "*内部*" : ""}`)
        if (full.includes(code)) {
          console.log('full contains')
          continue
        }
        res = await api('initForFarm', {"mpin": "", "utm_campaign": "t_335139774", "utm_medium": "appshare", "shareCode": code, "utm_term": "Wxfriends", "utm_source": "iosapp", "imageUrl": "", "nickName": "", "version": 14, "channel": 2, "babelChannel": 0})
        if (res.helpResult.code === '7') {
          console.log('不给自己助力')
        } else if (res.helpResult.code === '0') {
          console.log('助力成功,获得', res.helpResult.salveHelpAddWater)
          log.help += `助力成功 ${code} ${shareCodeSelf.includes(code) ? '*内部*' : ''}\n`
        } else if (res.helpResult.code === '8') {
          console.log('上限')
          await wait(50000)
          break
        } else if (res.helpResult.code === '9') {
          console.log('已助力')
          log.help += `已助力 ${code} ${shareCodeSelf.includes(code) ? '*内部*' : ''}\n`
        } else if (res.helpResult.code === '10') {
          console.log('已满')
          full.push(code)
        } else if (res.helpResult.remainTimes === 0) {
          console.log('上限')
          await wait(10000)
          break
        }
        await wait(10000)
        if (res.helpResult.remainTimes === 0) {
          console.log('上限')
          await wait(5000)
          break
        }
      }
    } catch (e) {
      console.log('error', e)
    }
    await wait(5000)
  }

  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

      h5stTool = new H5ST("0c010", USER_AGENT, process.env.FP_0C010 || "")
      await h5stTool.__genAlgo()

      res = await api('farmAssistInit', {"version": 16, "channel": 1, "babelChannel": "121"})
      let assistFriendList: number = res.assistFriendList.length

      if (res.code !== '0') {
        console.log('farmAssistInit Error')
        continue
      }
      let farmAssistInit_waterEnergy: number = 0
      for (let t of res.assistStageList) {
        if (t.percentage === '100%' && t.stageStaus === 2) {
          res = await api('receiveStageEnergy', {"version": 14, "channel": 1, "babelChannel": "120"})
          await wait(3000)
          farmAssistInit_waterEnergy += t.waterEnergy
        } else if (t.stageStaus === 3) {
          farmAssistInit_waterEnergy += t.waterEnergy
        }
      }
      console.log('收到助力', assistFriendList)
      console.log('助力已领取', farmAssistInit_waterEnergy)

      message += `【助力已领取】  ${farmAssistInit_waterEnergy}\n\n`
      message += '\n\n'
    } catch (e) {
      console.log('error', e)
    }
    await wait(10000)
  }
  message && await sendNotify("农场助力", message)
})()

async function api(fn: string, body: object) {
  let h5st: string = h5stTool.__genH5st({
    'appid': 'wh5',
    'body': JSON.stringify(body),
    'client': 'apple',
    'clientVersion': '10.2.4',
    'functionId': fn,
  })
  return await get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${JSON.stringify(body)}&appid=wh5&client=apple&clientVersion=11.0.4&h5st=${h5st}`, {
    "Host": "api.m.jd.com",
    "Origin": "https://carry.m.jd.com",
    "User-Agent": USER_AGENT,
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "Referer": "https://carry.m.jd.com/",
    "Cookie": cookie
  })
}