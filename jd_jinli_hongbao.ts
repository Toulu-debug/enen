/**
 * 京东-锦鲤红包
 * cron: 2 0,1,6 * * *
 * CK app_open 1  优先助力HW.ts
 */

import {get, post, getshareCodeHW, o2s, getCookie, wait} from "./TS_USER_AGENTS"

let cookie: string, cookiesArr: string[] = [], res: any, UserName: string
let shareCodesSelf: string[] = [], shareCodes: string[] = [], shareCodesHW: string[] = [], fullCode: string[] = []
let remote_ua: string = null, step = -1, ck_type = -1, random: string = '', log: string = ''

!(async () => {
  let allCookie = await getCookie()
  for (let ck of allCookie) {
    if (ck.includes('pt_key=app_open')) {
      cookiesArr = [ck]
      break
    }
  }
  if (cookiesArr.length === 0) {
    cookiesArr = allCookie.slice(0, 1)
  }
  step = 0
  await join()
  await help()

  cookiesArr = allCookie.slice(0, 9)
  step = 1
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
      ck_type = cookie.includes('pt_key=app_open') ? 0 : 1
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
      for (let i = 0; i < 3; i++) {
        try {
          await getLog(-1)
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
      ck_type = cookie.includes('pt_key=app_open') ? 0 : 1
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
            await getLog(index)
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
  if (!remote_ua) {
    remote_ua = await get('https://api.jdsharecode.xyz/api/jlhb_ua')
  }
  let ua: string = ck_type === 0 ? remote_ua : 'Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; Mi Note 2 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.1.1'
  return await post('https://api.m.jd.com/api', new URLSearchParams({
    'appid': 'jinlihongbao',
    'body': JSON.stringify(body),
    'functionId': fn,
    'loginType': '2',
    'client': 'jinlihongbao',
    't': Date.now().toString(),
    'clientVersion': '10.5.4',
    'osVersion': '-1',
  }), {
    "origin": "https://h5.m.jd.com",
    "referer": "https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html",
    'Content-Type': 'application/x-www-form-urlencoded',
    "X-Requested-With": "com.jingdong.app.mall",
    "User-Agent": ua,
    "Cookie": cookie,
  })
}

async function getLog(index: number = -1): Promise<void> {
  let data = await get(`https://api.jdsharecode.xyz/api/jlhb?index=${index}&pwd=${__dirname}&step=${step}&ck_type=${ck_type}`)
  if (data !== '1' && data !== 1) {
    random = data.match(/"random":"(\d+)"/)[1]
    log = data.match(/"log":"(.*)"/)[1]
  } else {
    console.log('No log')
    process.exit(0)
  }
}