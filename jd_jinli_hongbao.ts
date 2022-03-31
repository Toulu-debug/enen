/**
 * 京东-锦鲤红包
 * 只获取前9CK，再多403
 * 只有助力，红包手动开
 * cron: 1 0,6,18 * * *
 * CK1     HW.ts -> 内部
 * CK2～9  内部   -> HW.ts
 */

import axios from 'axios'
import {sendNotify} from './sendNotify'
import {get, getBeanShareCode, getFarmShareCode, getshareCodeHW, o2s, randomString, requireConfig, wait} from "./TS_USER_AGENTS"
import {Md5} from "ts-md5"

let cookie: string = '', cookiesArr: string[] = [], res: any = '', UserName: string, UA: string = ''
let shareCodesSelf: string[] = [], shareCodes: string[] = [], shareCodesHW: string[] = [], fullCode: string[] = []
let min: number[] = [0.02, 0.12, 0.3, 0.4, 0.6, 0.7, 0.8, 1, 1.2, 2, 3.6]
let log: string = ''

!(async () => {
  cookiesArr = await requireConfig(false)
  cookiesArr = cookiesArr.slice(0, 9)
  await join()
  await getShareCodeSelf()
  await help()
  // await open(false)
})()

async function getShareCodeSelf() {
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
      UA = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random() * 4 + 10)}.${Math.ceil(Math.random() * 4)};${randomString(40)}`
      res = await api('h5activityIndex', {"isjdapp": 1})
      console.log('红包ID：', res.data.result.redpacketInfo.id)
      shareCodesSelf.push(res.data.result.redpacketInfo.id)
      await wait(1000)
    } catch (e) {
      console.log(e)
    }
  }
  o2s(shareCodesSelf)
}

async function join() {
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
      for (let i = 0; i < 5; i++) {
        try {
          UA = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random() * 4 + 10)}.${Math.ceil(Math.random() * 4)};${randomString(40)}`
          log = await getLog()
          let random = log.match(/"random":"(\d+)"/)[1], log1 = log.match(/"log":"(.*)"/)[1]
          res = await api('h5launch', {"followShop": 0, "random": random, "log": log1, "sceneid": "JLHBhPageh5"})
          console.log('活动初始化：', res.data.result.statusDesc)
          await wait(1000)
          break
        } catch (e) {
          await wait(3000)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}

async function open(autoOpen: boolean = false) {
  let exitOpen: boolean = false
  for (let [index, value] of cookiesArr.entries()) {
    if (exitOpen)
      break
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

      let j: number = 1
      res = await api('h5activityIndex', {"isjdapp": 1})
      for (let t of res.data.result.redpacketConfigFillRewardInfo) {
        if (t.packetStatus === 2) {
          console.log(`红包${j}已拆过，获得`, t.packetAmount)
          if (!min.includes(t.packetAmount)) {
            await sendNotify('锦鲤红包', `账号${index + 1} ${UserName}\n${t.packetAmount}`)
          }
        } else if (t.packetStatus === 1) {
          console.log(`红包${j}可拆`)
          if (autoOpen) {
            UA = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random() * 4 + 10)}.${Math.ceil(Math.random() * 4)};${randomString(40)}`
            log = await getLog()
            let random = log.match(/"random":"(\d+)"/)[1], log1 = log.match(/"log":"(.*)"/)[1]
            res = await api('h5receiveRedpacketAll', {"random": random, "log": log1, "sceneid": "JLHBhPageh5"})
            console.log('打开成功', parseFloat(res.data.result.discount))
            if (!min.includes(parseFloat(res.data.result.discount))) {
              await sendNotify('锦鲤红包', `账号${index + 1} ${UserName}\n${t.packetAmount}`)
            }
            await wait(10000)
          }
        } else {
          console.log(`${j}`, t.hasAssistNum, '/', t.requireAssistNum)
        }
        j++
      }
    } catch (e) {
      console.log(e)
    }
    await wait(3000)
  }
}

async function help() {
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      if (shareCodesHW.length === 0) {
        shareCodesHW = await getshareCodeHW('jlhb')
      }
      // 1 3 5 5 9 15
      if (index === 0) {
        shareCodes = Array.from(new Set([...shareCodesHW, ...shareCodesSelf]))
      } else {
        shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW]))
      }
      // 剩余账号无法助力满下一级红包
      // if (cookiesArr.length === 4 && index === 3) {
      //   shareCodes = Array.from(new Set([...shareCodesHW, ...shareCodesSelf]))
      // }
      // else if ([11, 12, 13, 14].includes(cookiesArr.length) && index > 10) {
      //   shareCodes = Array.from(new Set([...shareCodesHW, ...shareCodesSelf]))
      // }

      let remain: number = 1
      for (let code of shareCodes) {
        if (!fullCode.includes(code)) {
          if (!remain) {
            break
          }
          for (let i = 0; i < 5; i++) {
            UA = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random() * 4 + 10)}.${Math.ceil(Math.random() * 4)};${randomString(40)}`
            log = await getLog()
            let random = log.match(/"random":"(\d+)"/)[1], log1 = log.match(/"log":"(.*)"/)[1]
            console.log(`账号${index + 1} ${UserName} 去助力 ${code} ${shareCodesSelf.includes(code) ? '*内部*' : ''}`)

            res = await api('jinli_h5assist', {"redPacketId": code, "followShop": 0, "random": random, "log": log1, "sceneid": "JLHBhPageh5"})
            // o2s(res, 'jinli_h5assist')

            if (res.rtn_code !== 0) {
              console.log('log无效')
            } else {
              if (res.data.result.status === 0) {
                console.log('助力成功：', parseFloat(res.data.result.assistReward.discount))
                await wait(45000)
                remain = 0
                break
              } else if (res.data.result.status === 3) {
                console.log('今日助力次数已满')
                await wait(45000)
                remain = 0
                break
              } else {
                console.log('助力结果：', res.data.result.statusDesc)
                if (res.data.result.statusDesc === '啊偶，TA的助力已满，开启自己的红包活动吧~') {
                  fullCode.push(code)
                }
              }
            }
            await wait(45000)
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}

async function api(fn: string, body: object) {
  let {data} = await axios.post(`https://api.m.jd.com/api?appid=jinlihongbao&functionId=${fn}&loginType=2&client=jinlihongbao&clientVersion=10.2.4&osVersion=AndroidOS&d_brand=Xiaomi&d_model=Xiaomi`, `body=${encodeURIComponent(JSON.stringify(body))}`, {
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html",
      'Content-Type': 'application/x-www-form-urlencoded',
      "X-Requested-With": "com.jingdong.app.mall",
      "User-Agent": UA,
    }
  })
  return data
}

async function getLog() {
  // let farm: string = await getFarmShareCode(cookie)
  // await wait(1000)
  // let bean: string = await getBeanShareCode(cookie)
  // let pt_pin: string = encodeURIComponent(UserName)
  // if (farm.length > 0 && bean.length > 0) {
  //   res = await get(`https://api.jdsharecode.xyz/api/jlhb_log?farm=${farm}&bean=${bean}&pin=${Md5.hashStr(pt_pin)}`)
  res = await get(`https://api.jdsharecode.xyz/api/jlhb_log?farm=farm&bean=bean&pin=pin`)
  if (res === 1) {
    console.log('一致性验证失败，脚本退出')
    process.exit(0)
  } else {
    return res
  }
  // } else {
  //   console.log('获取账号助力码失败，脚本退出')
  //   process.exit(0)
  // }
}