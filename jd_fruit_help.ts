/**
 * 京东-东东农场-助力
 * 所有CK助力顺序
 * 内部 -> 助力池
 * 和jd_fruit.js同方法自己设置内部码
 * 如果没有添加内部码，直接助力助力池
 * cron: 35 0,3,5 * * *
 */

import {get, getCookie, wait, o2s, getShareCodePool, getRandomNumberByRange} from './TS_USER_AGENTS'
import {H5ST} from "./utils/h5st"
import {sendNotify} from './sendNotify'
import {getDate} from 'date-fns'

let cookie: string = '', res: any = '', UserName: string, h5stTool: H5ST
let shareCodeSelf: string[] = [], log: { help: string, runTimes: string } = {help: '', runTimes: ''}, message: string = '', ua: string = '', fp: string = process.env.FP_8A2AF || process.env.FP_0C010 || ''

async function api(fn: string, body: object) {
  let h5st: string = h5stTool.__genH5st({
    'appid': 'signed_wh5',
    'body': JSON.stringify(body),
    'client': 'iOS',
    'clientVersion': '10.2.4',
    'functionId': fn,
  })
  return await get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${JSON.stringify(body)}&appid=signed_wh5&client=iOS&clientVersion=10.2.4&timestamp=${Date.now()}&h5st=${h5st}`, {
    "Host": "api.m.jd.com",
    "Origin": "https://carry.m.jd.com",
    "User-Agent": ua,
    "Referer": "https://carry.m.jd.com/",
    "Cookie": cookie
  })
}

!(async () => {
  let cookiesArr: string[] = await getCookie()
  if (!(process.env.FP_8A2AF || process.env.FP_0C010)) {
    console.log('环境变量FP_8A2AF或FP_0C010未设置，抓包关键词8a2af或0c010')
  }
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${getRandomNumberByRange(12, 16)}_${getRandomNumberByRange(0, 5)} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac`
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

      h5stTool = new H5ST("8a2af", ua, fp)
      await h5stTool.__genAlgo()

      res = await api('initForFarm', {"babelChannel": "121", "sid": "", "un_area": "", "version": 18, "channel": 1})
      if (res.code === '6') {
        o2s(res, '初始化失败')
        await sendNotify('jd_fruit_help.ts error', '环境变量FP_8A2AF或FP_0C010未设置\n抓包关键词8a2af或0c010')
        await wait(3000)
        continue
      }
      console.log('助力码', res.farmUserPro.shareCode)
      shareCodeSelf.push(res.farmUserPro.shareCode)

      for (let i = 0; i < 5; i++) {
        try {
          let today: number = getDate(new Date())
          res = await get(`https://sharecodepool.cnmb.win/api/runTimes0917?activityId=farm&sharecode=${res.farmUserPro.shareCode}&today=${today}`)
          console.log(res)
          log.runTimes += `第${i + 1}次${res}\n`
          break
        } catch (e) {
          console.log(`第${i + 1}次上报失败`, e.message)
          log.runTimes += `第${i + 1}次上报失败 ${typeof e === 'object' ? JSON.stringify(e) : e}\n`
          await wait(getRandomNumberByRange(10000, 30000))
        }
      }
    } catch (e) {
      console.log('error', e.message)
    }
    await wait(2000)
  }

  o2s(shareCodeSelf, '内部互助')
  let full: string[] = []
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${getRandomNumberByRange(12, 16)}_${getRandomNumberByRange(0, 5)} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac`
      h5stTool = new H5ST("235ec", ua, fp)
      await h5stTool.__genAlgo()

      let shareCodePool: string[] = await getShareCodePool('farm', 50)
      let shareCode: string[] = Array.from(new Set([...shareCodeSelf, ...shareCodePool]))

      for (let code of shareCode) {
        console.log(`账号${index + 1} ${UserName} 去助力 ${code} ${shareCodeSelf.includes(code) ? "*内部*" : ""}`)
        if (full.includes(code)) {
          console.log('full contains')
          continue
        }
        res = await api('initForFarm', {"shareCode": code, "mpin": "", "utm_term": "Wxfriends", "ad_od": "share", "utm_campaign": "t_335139774", "utm_medium": "appshare", "utm_source": "iosapp", "imageUrl": "", "nickName": "", "version": 18, "channel": 2, "babelChannel": 0})
        if (!(res.helpResult && res.helpResult.code)) {
          o2s(res, 'initForFarm+sharecode error')
        } else if (res.helpResult.code === '7') {
          console.log('不给自己助力')
        } else if (res.helpResult.code === '0') {
          console.log('助力成功,获得', res.helpResult.salveHelpAddWater)
          log.help += `助力成功 ${code} ${shareCodeSelf.includes(code) ? '*内部*' : ''}\n`
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
      }
    } catch (e) {
      console.log('error', e.message)
    }
    await wait(5000)
  }

  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${getRandomNumberByRange(12, 16)}_${getRandomNumberByRange(0, 5)} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac`
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

      h5stTool = new H5ST("92354", ua, fp)
      await h5stTool.__genAlgo()

      res = await api('farmAssistInit', {"version": 18, "channel": 1, "babelChannel": "121"})
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
      console.log('error', e.message)
    }
    await wait(10000)
  }
  message && await sendNotify("农场助力", message)
})()