/**
 * 京东-锦鲤红包
 * cron: 2 0,1,6 * * *
 * CK app_open 1  优先助力HW.ts
 */

import {get, getshareCodeHW, o2s, getCookie, wait} from "./TS_USER_AGENTS"
import axios from "axios";

let cookie: string, cookiesArr: string[] = [], res: any, UserName: string
let shareCodesSelf: string[] = [], shareCodes: string[] = [], shareCodesHW: string[] = [], fullCode: string[] = [], random: string = '', log: string = ''

!(async () => {
  let all = (await getCookie()).filter(item => {
    return item.includes('app_open')
  })
  cookiesArr = all.slice(0, 1)
  await join()
  await help()

  cookiesArr = all.slice(0, 9)
  if ([0, 1].includes(new Date().getHours())) {
    await join()
  }
  await getShareCodeSelf()
  await help()
})()

async function join() {
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
      for (let i = 0; i < 3; i++) {
        try {
          await getLog()
          res = await api('h5launch', {followShop: 0, random: random, log: log, sceneid: 'JLHBhPageh5'})
          console.log('活动初始化：', res.data.result.statusDesc)
          if (res.rtn_code === 0) {
            break
          }
        } catch (e) {
          console.log('join error', res?.rtn_code)
          await wait(5000)
        }
      }
    } catch (e) {
      console.log(e)
    }
    await wait(5000)
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
      if (cookiesArr.length === 1) {
        shareCodes = Array.from(new Set([...shareCodesHW, ...shareCodesSelf]))
      } else {
        shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW]))
      }

      let me: string = await getShareCodeSelf(true), remain: boolean = true
      for (let code of shareCodes) {
        if (!remain) break
        let success: boolean = false
        if (!fullCode.includes(code) && code !== me) {
          console.log(`账号${index + 1} ${UserName} 去助力 ${code} ${shareCodesSelf.includes(code) ? '*内部*' : ''}`)
          for (let i = 0; i < 5; i++) {
            if (success) break
            await getLog()
            res = await api('jinli_h5assist', {"redPacketId": code, "followShop": 0, random: random, log: log, sceneid: 'JLHBhPageh5'})
            if (res.rtn_code !== 0) {
              console.log('help error', res.rtn_code)
              await wait(5000)
            } else {
              success = true
              if (res.data.result.status === 0) {
                console.log('助力成功：', parseFloat(res.data.result.assistReward.discount))
                await wait(45000)
                remain = false
                break
              } else if (res.data.result.status === 3) {
                console.log('今日助力次数已满')
                remain = false
                await wait(45000)
                break
              } else {
                console.log('助力结果：', res.data.result.statusDesc)
                if (res.data.result.statusDesc === '啊偶，TA的助力已满，开启自己的红包活动吧~') {
                  fullCode.push(code)
                }
                await wait(45000)
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
    await wait(5000)
  }
}

async function getShareCodeSelf(one: boolean = false) {
  if (one) {
    res = await api('h5activityIndex', {"isjdapp": 1})
    return res?.data?.result?.redpacketInfo?.id
  } else {
    for (let [index, value] of cookiesArr.entries()) {
      try {
        cookie = value
        UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
        console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
        res = await api('h5activityIndex', {"isjdapp": 1})
        console.log('ID：', res.data.result.redpacketInfo.id)
        shareCodesSelf.push(res.data.result.redpacketInfo.id)
      } catch (e) {
        console.log('getShareCodeSelf error', e)
      }
      await wait(1000)
    }
    o2s(shareCodesSelf)
  }
}

async function api(fn: string, body: object) {
  let {data} = await axios.post('https://api.m.jd.com/api', new URLSearchParams({
    'body': JSON.stringify(body)
  }), {
    params: {
      'appid': 'jinlihongbao',
      'functionId': fn,
      'loginType': '2',
      'client': 'jinlihongbao',
      't': Date.now(),
      'clientVersion': '11.1.0',
      'osVersion': '-1'
    },
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://happy.m.jd.com',
      'User-Agent': "jdapp;android;11.1.0;;;appBuild/98139;",
      'Referer': 'https://happy.m.jd.com/',
      'Cookie': cookie
    }
  })
  return data
}

async function getLog(): Promise<void> {
  let data = await get(`https://api.jdsharecode.xyz/api/jlhb?project=${__dirname}`)
  if (data !== '1' && data !== 1) {
    random = data.match(/"random":"(\d+)"/)[1]
    log = data.match(/"log":"(.*)"/)[1]
  } else {
    console.log('No log')
    process.exit(0)
  }
}