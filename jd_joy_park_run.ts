/**
 * 汪汪乐园-跑步
 * 默认翻倍到0.04红包结束
 * export JD_JOY_PARK_RUN_ASSETS="0.04"
 * cron: 20,50 * * * *
 */

import {get, post, o2s, requireConfig, wait} from './TS_USER_AGENTS'
import {geth5st, requestAlgo} from "./utils/V3";
import {SHA256} from "crypto-js";

let cookie: string = '', res: any = '', data: any, UserName: string
let assets: number = parseFloat(process.env.JD_JOY_PARK_RUN_ASSETS || '0.04')

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    /*
    res = await api('apTaskList', {"linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
    o2s(res)
    for (let t of res.data) {
      if (t.id === 662 && t.taskDoTimes < t.taskLimitTimes) {
        console.log(t.taskShowTitle)
        data = await api('apDoTask', {"taskType": t.taskType, "taskId": t.id, "itemId": t.taskSourceUrl, "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
        await wait(1000)
        o2s(data)
      }
      if (t.canDrawAwardNum === 1) {
        data = await api('apTaskDrawAward', {"taskType": t.taskType, "taskId": t.id, "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
        o2s(data)
        // console.log('任务完成', parseInt(data.data.awardGivenNumber))
        await wait(1000)
      }
    }

     */

    res = await runningPageHome()
    console.log('能量恢复中', secondsToMinutes(res.data.runningHomeInfo.nextRunningTime / 1000), '能量棒', res.data.runningHomeInfo.energy)

    if (res.data.runningHomeInfo.nextRunningTime / 1000 < 300) {
      await wait(res.data.runningHomeInfo.nextRunningTime)
      res = await runningPageHome()
      console.log('能量恢复中', secondsToMinutes(res.data.runningHomeInfo.nextRunningTime / 1000), '能量棒', res.data.runningHomeInfo.energy)
    }

    if (!res.data.runningHomeInfo.nextRunningTime) {
      await requestAlgo('b6ac3', 'jdltapp;')
      console.log('终点目标', assets)
      for (let i = 0; i < 10; i++) {
        res = await api('runningOpenBox', {"linkId": "L-sOanK_5RJCz7I314FpnQ"})
        o2s(res)

        if (parseFloat(res.data.assets) >= assets) {
          res = await api('runningPreserveAssets', {"linkId": "L-sOanK_5RJCz7I314FpnQ"})
          console.log('领取成功', res.data.prizeValue)
          break
        } else {
          if (res.data.doubleSuccess) {
            console.log('翻倍成功', parseFloat(res.data.assets))
          } else if (!res.data.doubleSuccess && !res.data.runningHomeInfo.runningFinish) {
            console.log('开始跑步', parseFloat(res.data.assets))
          } else {
            console.log('翻倍失败')
            break
          }
        }
        await wait(5000)
      }
    }

    await wait(2000)
  }
})()

async function api(fn: string, body: object) {
  let timestamp: number = Date.now(), t: { key: string, value: string } [] = [
    {key: 'functionId', value: fn},
    {key: 'body', value: SHA256(JSON.stringify(body)).toString()},
    {key: 't', value: timestamp.toString()},
    {key: 'client', value: 'ios'},
    {key: 'clientVersion', value: '3.8.16'}
  ]
  let h5st: string = ''
  if (fn === 'runningOpenBox') {
    h5st = geth5st(t, 'b6ac3')
  }
  return post('https://api.m.jd.com/', `functionId=${fn}&body=${JSON.stringify(body)}&_t=${Date.now()}&appid=activities_platform&h5st=${h5st}`, {
    'Host': 'api.m.jd.com',
    'Origin': 'https://joypark.jd.com',
    'User-Agent': 'jdltapp;',
    'Referer': 'https://joypark.jd.com/',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': cookie
  })
}

async function runningPageHome() {
  return get(`https://api.m.jd.com/?functionId=runningPageHome&body=%7B%22linkId%22:%22L-sOanK_5RJCz7I314FpnQ%22,%22isFromJoyPark%22:true,%22joyLinkId%22:%22LsQNxL7iWDlXUs6cFl-AAg%22%7D&t=${Date.now()}&appid=activities_platform&client=ios&clientVersion=3.8.16`, '', {
    'Host': 'api.m.jd.com',
    'Origin': 'https://h5platform.jd.com',
    'User-Agent': 'jdltapp;',
    'Referer': 'https://h5platform.jd.com/',
    'Cookie': cookie
  })
}

// 秒转时分秒
function secondsToMinutes(seconds: number) {
  let minutes: number = Math.floor(seconds / 60)
  let second: number = Math.floor(seconds % 60)
  return `${minutes}分${second}秒`
}