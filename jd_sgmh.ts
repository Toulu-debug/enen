/**
 * 闪购盲盒
 * cron: 20 8 * * *
 */

import {getCookie, getShareCodePool, wait} from "./TS_USER_AGENTS"
import axios from "axios";

let cookie: string = '', UserName: string, res: any
let shareCodeSelf: string[] = [], shareCode: string[] = [], shareCodePool: string[] = []

!(async () => {
  let cookiesArr: string[] = await getCookie()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    res = await api('healthyDay_getHomeData', {"appId": "1EFRXxg", "taskToken": "", "channelId": 1})

    for (let t of res.data.result.taskVos) {
      if (t.taskType === 14) {
        console.log('助力码', t.assistTaskDetailVo?.taskToken)
        shareCodeSelf.push(t.assistTaskDetailVo?.taskToken)
      }
      if ((t.browseShopVo || t.productInfoVos || t.shoppingActivityVos) && t.times < t.maxTimes) {
        for (let i = 0; i < t.maxTimes - t.times; i++) {
          let tp: any[] = []
          if (t.productInfoVos)
            tp = t.productInfoVos
          else if (t.browseShopVo)
            tp = t.browseShopVo
          else if (t.shoppingActivityVos)
            tp = t.shoppingActivityVos
          console.log(tp[i]?.shopName || tp[i]?.skuName || tp[i]?.title)
          if (!t.shoppingActivityVos) {
            res = await api('harmony_collectScore', {"appId": "1EFRXxg", "taskToken": tp[i].taskToken, "taskId": t.taskId, "actionType": 1})
            console.log(res.data.bizMsg)
            await wait(t.waitDuration * 1000 || 2000)
          }
          res = await api('harmony_collectScore', {"appId": "1EFRXxg", "taskToken": tp[i].taskToken, "taskId": t.taskId, "actionType": 0})
          await wait(1000)
          if (res.data.bizMsg === 'success') {
            console.log('任务完成')
          } else {
            break
          }
        }
      }
    }
  }

  // 助力
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    shareCodePool = await getShareCodePool('sgmh', 30)
    shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodePool]))

    for (let code of shareCode) {
      console.log('去助力', code)
      res = await api('harmony_collectScore', {"appId": "1EFRXxg", "taskToken": code, "taskId": 3})
      if (res.data.bizCode === 0) {
        console.log('助力成功')
      } else if (res.data.bizCode === 108) {
        console.log('上限')
        break
      } else {
        console.log('助力失败', res.data.bizMsg)
      }
      await wait(2000)
    }
  }

  // 抽奖
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
    res = await api('healthyDay_getHomeData', {"appId": "1EFRXxg", "taskToken": "", "channelId": 1})
    await wait(1000)
    let lotteryNum: number = parseInt(res.data.result.userInfo.lotteryNum)
    console.log('可以抽奖', lotteryNum, '次')
    for (let i = 0; i < lotteryNum; i++) {
      res = await api('interact_template_getLotteryResult', {"appId": "1EFRXxg"})
      if (res.data.result.userAwardsCacheDto.type === 0) {
        console.log('抽奖成功 空气')
      } else {
        console.log('抽奖成功', res.data.result.userAwardsCacheDto.jBeanAwardVo?.prizeName)
      }
      await wait(1000)
    }
  }
})()

async function api(fn: string, body: object) {
  let {data} = await axios.post('https://api.m.jd.com/client.action',
    `functionId=${fn}&body=${JSON.stringify(body)}&client=wh5&clientVersion=1.0.0`, {
      headers: {
        'Host': 'api.m.jd.com',
        'Origin': 'https://h5.m.jd.com',
        'User-Agent': 'jdapp;iPhone;10.4.3;',
        'Referer': 'https://h5.m.jd.com/',
        'Cookie': cookie
      }
    })
  return data
}