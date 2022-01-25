/**
 * 京喜工厂
 * cron: 30 * * * *
 */

import axios from "axios"
import * as path from "path"
import {format} from 'date-fns'
import {sendNotify} from './sendNotify'
import {requireConfig, wait, exceptCookie, randomWord} from "./TS_USER_AGENTS"
import {requestAlgo, geth5st} from "./utils/V3";

let cookie: string = '', res: any = '', UserName: string

interface Params {
  bizCode?: string,
  name?: string,
  pin?: string,
  sharePin?: string,
  shareType?: string,
  materialTuanPin?: string,
  materialTuanId?: string,
  needPickSiteInfo?: number,
  source?: string,
  productionId?: number,
  date?: string,
  taskId?: number,
  configExtra?: string,
  factoryid?: number,
  querytype?: number,
  apptoken?: string,
  pgtimestamp?: string,
  phoneID?: string,
  doubleflag?: number,
  timeStamp?: string,
  showAreaTaskFlag?: number,
}

!(async () => {
  await requestAlgo('c0ff1')
  let cookiesArr: string[] = await requireConfig()
  let except: string[] = exceptCookie(path.basename(__filename))
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    res = await api('userinfo/GetUserInfo', '_time,materialTuanId,materialTuanPin,needPickSiteInfo,pin,sharePin,shareType,source,zone', {pin: '', sharePin: '', shareType: '', materialTuanPin: '', materialTuanId: '', needPickSiteInfo: 0, source: ''})
    let productionId: number = 0, factoryId: number = 0
    await wait(2000)
    try {
      productionId = res.data.productionList[0].productionId
      factoryId = res.data.factoryList[0].factoryId
      let investedElectric: number = res.data.productionList[0].investedElectric, needElectric: number = res.data.productionList[0].needElectric, progress: string = (investedElectric / needElectric * 100).toFixed(2)
      console.log('生产进度：', progress)
      if (progress === '100.00') {
        sendNotify("京喜工厂生产完成", `账号${index + 1} ${UserName}`)
        continue
      }
    } catch (e) {
      console.log('当前没有产品在生产')
      continue
    }

    // 开红包
    if (res.data.productionStage.productionStageAwardStatus === 1) {
      res = await api('userinfo/DrawProductionStagePrize', '_time,productionId,zone', {productionId: productionId})
      console.log('打开红包：', res.data.active)
      await wait(4000)
    }

    // 收发电机
    res = await api('generator/QueryCurrentElectricityQuantity', '_time,factoryid,querytype,zone', {factoryid: factoryId, querytype: 1})
    await wait(2000)
    let flag: number = -1
    if (res.data.nextCollectDoubleFlag === 1) {
      // 下次双倍
      if (res.data.currentElectricityQuantity === res.data.maxElectricityQuantity) {
        // 发电机满
        flag = 1
      } else {
        console.log('发电机可收取双倍，但没满')
      }
    } else {
      // 没有双倍，直接收
      flag = 0
    }
    if (flag !== -1) {
      res = await api('generator/CollectCurrentElectricity', '_time,apptoken,doubleflag,factoryid,pgtimestamp,phoneID,zone', {apptoken: '', pgtimestamp: '', phoneID: '', factoryid: factoryId, doubleflag: flag, timeStamp: 'undefined'})
      res.ret === 0
        ? console.log('发电机收取成功：', res.data.CollectElectricity)
        : console.log('发电机收取失败：', res)
    }
    await wait(4000)

    // 投入电力
    for (let j = 0; j < 2; j++) {
      res = await api('userinfo/InvestElectric', '_time,productionId,zone', {productionId: productionId})
      if (res.ret === 0) {
        console.log('投入电力成功：', res.data.investElectric)
      } else {
        console.log('投入电力失败：', res)
        break
      }
      await wait(3000)
    }

    res = await api('friend/QueryHireReward', '_time,zone')
    await wait(2000)
    for (let t of res.data.hireReward) {
      if (t.date !== format(Date.now(), "yyyyMMdd") && new Date().getHours() >= 6) {
        res = await api('friend/HireAward', '_time,date,type,zone', {date: t.date})
        await wait(2000)
        if (res.ret === 0)
          console.log('收取气泡成功：', t.electricityQuantity)
      }
    }

    console.log('任务列表开始')
    for (let j = 0; j < 30; j++) {
      if (await task() === 0) {
        break
      }
      await wait(5000)
    }
    console.log('任务列表结束')
  }
})()

async function task() {
  res = await api('GetUserTaskStatusList', '_time,bizCode,showAreaTaskFlag,source', {showAreaTaskFlag: 1, bizCode: 'dream_factory'})
  console.log('GetUserTaskStatusList: 刷新任务列表')
  await wait(3000)
  for (let t of res.data.userTaskStatusList) {
    if (t.awardStatus === 2) {
      if (t.completedTimes >= t.targetTimes) {
        console.log('可领奖：', t.taskName)
        res = await api('Award', '_time,bizCode,source,taskId', {taskId: t.taskId, bizCode: t.bizCode})
        if (res.ret === 0) {
          console.log('领奖成功：', res.data.prizeInfo.trim() * 1)
          await wait(4000)
          return 1
        } else {
          console.log('领奖出错')
          return 0
        }
      }

      if (t.dateType === 2 && t.completedTimes < t.targetTimes && [2, 6, 9].indexOf(t.taskType) > -1) {
        console.log('任务开始：', t.taskName)
        res = await api('DoTask', '_time,_ts,bizCode,configExtra,source,taskId', {taskId: t.taskId, bizCode: t.bizCode, configExtra: ''})
        await wait(5000)
        if (res.ret === 0) {
          console.log('任务完成')
          await wait(3000)
          return 1
        } else {
          console.log('任务失败')
          return 0
        }
      }
    }
  }
  return 0
}

async function api(fn: string, stk: string, params: Params = {}) {
  let url: string, timestamp = Date.now()
  let t: { key: string, value: string } [] = [
    {key: '_time', value: timestamp.toString()},
    {key: '_ts', value: timestamp.toString()},
    {key: 'bizCode', value: 'dream_factory'},
    {key: 'source', value: 'dreamfactory'},
  ]

  let w: string = randomWord()
  if (['GetUserTaskStatusList', 'DoTask', 'Award'].includes(fn))
    url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?source=dreamfactory&_time=${timestamp}&_ts=${timestamp}&_stk=${encodeURIComponent(stk)}&_=${timestamp + 3}&sceneval=2&g_login_type=1&callback=jsonpCBK${w}${w}&g_ty=ls`
  else
    url = `https://m.jingxi.com/dreamfactory/${fn}?zone=dream_factory&_time=${timestamp}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${timestamp + 3}&sceneval=2&g_login_type=1&callback=jsonpCBK${w}${w}&g_ty=ls`
  for (let [key, value] of Object.entries(params)) {
    t.push({key, value})
    url += `&${key}=${value}`
  }
  let h5st = geth5st(t, 'c0ff1')
  url += `&h5st=${encodeURIComponent(h5st)}`

  let {data} = await axios.get(url, {
    headers: {
      'Host': 'm.jingxi.com',
      'User-Agent': 'jdpingou;',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Referer': 'https://st.jingxi.com/',
      'Cookie': cookie
    }
  })
  return JSON.parse(data.match(/try.?{jsonpCBK.?.?\((.*)/)[1])
}
