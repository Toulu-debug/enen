/**
 * cron: 15 0,1,6,18 * * *
 * CK1     HW.ts -> 内部
 * CK2～n  内部   -> HW.ts
 */

import axios from 'axios'
import {getshareCodeHW, o2s, randomString, requireConfig, wait} from './TS_USER_AGENTS'
import {geth5st, requestAlgo} from "./utils/V3";
import {SHA256} from 'crypto-js'

let cookie: string = '', res: any = '', UserName: string, data: any

interface INVITE {
  inviter: string,
  inviteCode: string
}

let shareCodes: INVITE[] = [], shareCodesHW = [], shareCodesSelf: INVITE[] = []

!(async () => {
  let cookiesArr: string[] = await requireConfig()

  // 获取助力码
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
      await requestAlgo('ce6c2', 'jdltapp;')
      res = await api('happyDigHome', {"linkId": "pTTvJeSTrpthgk9ASBVGsw"})
      console.log('助力码', res.data.markedPin, res.data.inviteCode)
      shareCodesSelf.push({inviter: res.data.markedPin, inviteCode: res.data.inviteCode})
    } catch (e) {
      console.log('error', e)
    }
    await wait(2000)
  }
  console.log('内部助力')
  o2s(shareCodesSelf)

  // 助力
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
      await requestAlgo('ce6c2', 'jdltapp;')

      if (shareCodesHW.length === 0) {
        shareCodesHW = await getshareCodeHW('fcwb')
      }
      if (index === 0 && cookiesArr.length === 1) {
        shareCodes = Array.from(new Set([...shareCodesHW, ...shareCodesSelf]))
      } else {
        shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW]))
      }

      for (let code of shareCodesSelf) {
        console.log(`去助力 ${code.inviteCode}`)
        res = await api('happyDigHelp', {"linkId": "pTTvJeSTrpthgk9ASBVGsw", "inviter": code.inviter, "inviteCode": code.inviteCode})
        if (res.code === 0) {
          console.log('助力成功')
        } else if (res.code === 16143) {
          console.log('已助力')
        } else if (res.code === 16144) {
          console.log('上限')
          await wait(2000)
          break
        } else {
          o2s(res)
        }
        await wait(2000)
      }
    } catch (e) {
      console.log('error', e)
      await wait(2000)
    }
  }

  // 开挖
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
    await requestAlgo('ce6c2', 'jdltapp;')
    let blood: number = res.data.blood
    for (let i = 0; i < 4; i++) {
      if (blood <= 1) {
        console.log('能量剩余1，跳过 A')
        break
      }
      for (let j = 0; j < 4; j++) {
        if (blood <= 1) {
          console.log('能量剩余1，跳过 B')
          break
        }
        res = await api('happyDigDo', {"round": 1, "rowIdx": i, "colIdx": j, "linkId": "pTTvJeSTrpthgk9ASBVGsw"})
        o2s(res)

        if (res.data.chunk.type === 1) {
          console.log('挖到👎')
        } else if (res.data.chunk.type === 2) {
          console.log('挖到🧧', parseFloat(res.data.chunk.value))
        } else if (res.data.chunk.type === 4) {
          console.log('挖到💣')
        }
        await wait(1000)
        res = await api('happyDigHome', {"linkId": "pTTvJeSTrpthgk9ASBVGsw"})
        if (res.data.blood === 1) {
          blood = 1
          console.log('能量剩余1，退出')
          break
        }
        await wait(2000)
      }
    }

    // 任务
    /*
    res = await api('apTaskList', {"linkId": "pTTvJeSTrpthgk9ASBVGsw"})
    for (let t of res.data) {
      if (t.taskType === 'BROWSE_CHANNEL') {
        console.log(t.taskTitle)
        data = await api('apDoTask', {"linkId": "pTTvJeSTrpthgk9ASBVGsw", "taskType": "BROWSE_CHANNEL", "taskId": t.id, "channel": 4, "itemId": encodeURIComponent(t.taskSourceUrl), "checkVersion": false})
        data.errMsg ? console.log('任务失败', data.errMsg) : console.log('任务成功')
        await wait(2000)
      }
    }
     */
    // for (let t of res.data) {
    //   if (t.taskTitle === '发财挖宝浏览任务') {
    //
    //   }
    // }
    // res = await api('apTaskDetail', {"linkId": "SS55rTBOHtnLCm3n9UMk7Q", "taskType": "BROWSE_CHANNEL", "taskId": 357, "channel": 4})
    // for (let j = res.data.status.userFinishedTimes; j < res.data.status.finishNeed; j++) {
    //   res = await api('apTaskTimeRecord', {"linkId": "SS55rTBOHtnLCm3n9UMk7Q", "taskId": 357})
    //   await wait(20 * 1000)
    //   await api('apTaskList', {"linkId": "SS55rTBOHtnLCm3n9UMk7Q"})
    //   res = await api('apTaskDetail', {"linkId": "SS55rTBOHtnLCm3n9UMk7Q", "taskType": "BROWSE_CHANNEL", "taskId": 357, "channel": 4})
    //   console.log(res)
    // }
  }
})()

async function api(fn: string, body: object) {
  let timestamp: number = Date.now(), t = [
    {key: 'functionId', value: fn},
    {key: 'body', value: SHA256(JSON.stringify(body)).toString()},
    {key: 't', value: timestamp.toString()},
    {key: 'appid', value: 'activities_platform'},
    {key: 'client', value: 'H5'},
    {key: 'clientVersion', value: '1.0.0'},
  ]
  let h5st = geth5st(t, '63d78')
  let {data} = await axios.get(`https://api.m.jd.com/?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&t=${Date.now()}&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=${h5st}`, {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://bnzf.jd.com',
      'User-Agent': `jdapp;iPhone;10.2.2;14.3;${randomString(40)};M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/4199175193;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`,
      'Referer': 'https://bnzf.jd.com/',
      'Cookie': cookie
    }
  })
  return data
}