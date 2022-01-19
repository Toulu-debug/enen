/**
 * 京喜-天天压岁钱
 * cron: 5 0,9,18 * * *
 */

import axios from "axios"
import {requireConfig, wait, o2s, obj2str, getshareCodeHW} from "./TS_USER_AGENTS"
import {requestAlgo, geth5st} from "./utils/V3";

let cookie: string = '', res: any = '', UserName: string
let shareCodes: string[] = [], shareCodesSelf: string[] = [], shareCodesHW: string[] = []

interface Params {
  bizCode?: string,
  source?: string,
  configExtra?: string,
  strShareId?: string,
  taskId?: number,
  strInviteId?: string,
  shareId?: string,
  nopopup?: number,
  id?: number,
}

!(async () => {
  await requestAlgo('76a41', 'jdpingou;')
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    // 助力码
    res = await api('GetUserInfo', '__t,dwEnv,nopopup,strInviteId', {strInviteId: '', nopopup: 1})
    console.log('助力码:', res.myInfo.shareId)
    shareCodesSelf.push(res.myInfo.shareId)
    await wait(1000)

    res = await api('GetTaskList', '__t,dwEnv', {})
    for (let t of res.data.taskList) {
      if (t.completedTimes !== t.configTargetTimes) {
        if (t.awardStatus === 2 && [2, 14].includes(t.taskType)) {
          console.log('开始任务:', t.taskName)
          res = await api('DoTask', '__t,bizCode,configExtra,dwEnv,strShareId,taskId', {bizCode: t.bizCode, configExtra: '', strShareId: '', taskId: t.taskId})
          if (res.iRet === 0) {
            console.log('任务完成')
          } else {
            console.log('任务失败', obj2str(res))
            break
          }
          await wait(5000)
        }
      }
      if (t.completedTimes === t.configTargetTimes && t.awardStatus === 2) {
        res = await api('Award', '__t,bizCode,dwEnv,source,taskId', {bizCode: t.bizCode, source: t.bizCode, taskId: t.taskId})
        if (res.ret === 0) {
          res = JSON.parse(res.data.prizeInfo)
          console.log('领奖成功:', res.ddwAward, res.ddwExtAward)
          await wait(1500)
        }
      }
    }
  }

  for (let [index, value] of cookiesArr.entries()) {
    if (shareCodesHW.length === 0) {
      shareCodesHW = await getshareCodeHW('ysq')
    }
    shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW]))
    cookie = value
    for (let code of shareCodes) {
      console.log(`账号${index + 1} 去助力 ${code} ${shareCodesSelf.includes(code) ? '*内部*' : ''}`)
      res = await api('BestWishes', '__t,dwEnv,id,shareId', {id: 1, shareId: code})
      if (res.iRet === 0) {
        if (res.data.toast === '助力失败，活动太火爆，晚点再来试试吧～') {
          console.log('黑号，无法助力别人')
          break
        } else if (res.data.toast === '') {
          console.log('助力成功')
        } else {
          console.log(res.data.toast)
        }
      } else {
        console.log('助力失败', obj2str(res))
        break
      }
      await wait(2000)
    }
  }
})()

async function api(fn: string, stk: string, params: Params) {
  let url: string, timestamp = Date.now()
  let t: { key: string, value: string } [] = [
    {key: '__t', value: timestamp.toString()},
    {key: 'dwEnv', value: '7'},
  ]
  url = fn === 'Award'
    ? `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?__t=${timestamp}&dwEnv=7&_stk=${encodeURIComponent(stk)}&_ste=1&sceneval=2&g_login_type=1&g_ty=ajax`
    : `https://m.jingxi.com/jxnhj/${fn}?__t=${timestamp}&dwEnv=7&_stk=${encodeURIComponent(stk)}&_ste=1&sceneval=2&g_login_type=1&g_ty=ajax`
  for (let [key, value] of Object.entries(params)) {
    t.push({key, value})
    url += `&${key}=${value}`
  }
  let h5st = geth5st(t, '76a41')
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
  return data
}