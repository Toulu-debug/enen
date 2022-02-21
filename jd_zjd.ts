/**
 * jd_zjd
 * Cookie >= 4 内部
 * Cookie <  4 HW.ts -> 内部
 * cron: 15 0,1,23 * * *
 */

import axios from 'axios'
import {getshareCodeHW, o2s, requireConfig, wait} from './TS_USER_AGENTS'
import {requestAlgo} from "./utils/V3";
import {init, zjdTool} from "./utils/zjd";

let cookie: string = '', res: any = '', UserName: string
let USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat'
let shareCodeSelf: Tuan[] = [], shareCode: Tuan[] = [], shareCodeHW: any = [], encPin: string[] = []

interface Tuan {
  activityIdEncrypted: string, // id
  assistStartRecordId: string, // assistStartRecordId
  assistedPinEncrypted: string, // encPin
}

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    try {
      let {fp, tk, genKey} = await requestAlgo('d8ac0', USER_AGENT)
      init(fp, tk, genKey)

      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

      res = await api('distributeBeanActivityInfo', {"paramData": {"channel": "FISSION_BEAN"}})
      o2s(res)
      await wait(2000)

      if (res.data.assistStatus === 1) {
        // 已开，没满
        console.log('已开团，', res.data.assistedRecords.length, '/', res.data.assistNum, '，剩余', Math.round(res.data.assistValidMilliseconds / 1000 / 60), '分钟')
        shareCodeSelf.push({
          activityIdEncrypted: res.data.id,
          assistStartRecordId: res.data.assistStartRecordId,
          assistedPinEncrypted: res.data.encPin,
        })
      } else if (res.data.assistStatus === 2 && res.data.canStartNewAssist) {
        // 没开团
        res = await api('vvipclub_distributeBean_startAssist', {"activityIdEncrypted": res.data.id, "channel": "FISSION_BEAN"})
        o2s(res)
        await wait(1000)
        if (res.success) {
          console.log(`开团成功，结束时间：${res.data.endTime}`)
          res = await api('distributeBeanActivityInfo', {"paramData": {"channel": "FISSION_BEAN"}})
          shareCodeSelf.push({
            activityIdEncrypted: res.data.id,
            assistStartRecordId: res.data.assistStartRecordId,
            assistedPinEncrypted: res.data.encPin,
          })
          await wait(1000)
        }
      } else if (res.data.assistedRecords.length === res.data.assistNum) {
        console.log('已成团', JSON.stringify(res))
        if (res.data.canStartNewAssist) {
          res = await api('vvipclub_distributeBean_startAssist', {"activityIdEncrypted": res.data.id, "channel": "FISSION_BEAN"})
          console.log('4', res)
          await wait(2000)
          if (res.success) {
            console.log(`开团成功，结束时间：${res.data.endTime}`)
            res = await api('distributeBeanActivityInfo', {"paramData": {"channel": "FISSION_BEAN"}})
            shareCodeSelf.push({
              activityIdEncrypted: res.data.id,
              assistStartRecordId: res.data.assistStartRecordId,
              assistedPinEncrypted: res.data.encPin,
            })
            await wait(1000)
          }
        }
      } else if (!res.data.canStartNewAssist) {
        console.log('不可开团')
      }
    } catch (e) {
      continue
    }
    await wait(2000)
  }

  o2s(shareCodeSelf)
  for (let [index, value] of cookiesArr.entries()) {
    if (shareCodeHW.length === 0) {
      shareCodeHW = await getshareCodeHW('zjd');
    }
    shareCode = index === 0
      ? Array.from(new Set([...shareCodeHW, ...shareCodeSelf]))
      : Array.from(new Set([...shareCodeSelf, ...shareCodeHW]))

    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    let {fp, tk, genKey} = await requestAlgo('d8ac0', USER_AGENT)
    init(fp, tk, genKey)

    for (let code of shareCode) {
      try {
        console.log(`账号${index + 1} ${UserName} 去助力 ${code.assistedPinEncrypted.replace('\n', '')}`)
        res = await api('vvipclub_distributeBean_assist', {"activityIdEncrypted": code.activityIdEncrypted, "assistStartRecordId": code.assistStartRecordId, "assistedPinEncrypted": code.assistedPinEncrypted, "channel": "FISSION_BEAN", "launchChannel": "undefined"})

        if (res.resultCode === '9200008') {
          console.log('不能助力自己')
        } else if (res.resultCode === '2400203') {
          console.log('上限')
          break
        } else if (res.resultCode === '2400205') {
          console.log('对方已成团')
        } else if (res.success) {
          console.log('助力成功')
        } else {
          console.log('error', JSON.stringify(res))
        }
      } catch (e) {
        console.log(e)
        break
      }
      await wait(2000)
    }
    console.log()
    await wait(2000)
  }
})()

async function api(fn: string, params: any) {
  let h5st
  if (fn === 'vvipclub_distributeBean_assist') {
    h5st = zjdTool({"activityIdEncrypted": params.activityIdEncrypted, "channel": "FISSION_BEAN"})
  } else {
    h5st = zjdTool(params)
  }
  let {data} = await axios.post(`https://api.m.jd.com/api?functionId=${fn}&fromType=wxapp&timestamp=${Date.now()}`,
    `body=${decodeURIComponent(JSON.stringify(params))}&appid=swat_miniprogram&h5st=${h5st}&client=tjj_m&clientVersion=3.1.3`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; Charset=UTF-8",
        "Host": "api.m.jd.com",
        "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/182/page-frame.html",
        "Cookie": cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
      }
    })
  return data
}