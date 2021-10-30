/**
 * 京喜-首页-牛牛福利
 * 1 0,9,19,23 * * *
 */

import axios from "axios"
import {requireConfig, wait, h5st, o2s} from "./TS_USER_AGENTS"

let cookie: string = '', UserName: string, index: number, allMessage: string = '', res: any = '', message: string = ''
let shareCodeSelf: string[] = [], shareCode: string[] = [], shareCodeHW: string[] = [
  'XGxI73R4Uu88cRIL2AqoJqA6ARbMr6sd61N5WAIe0uE=',
  'XGxI73R4Uu88cRIL2AqoJqgNuwWuQGNjLRJIFY-3_rxsWB2PWldeVlSv7mzjupaI',
  'XGxI73R4Uu88cRIL2AqoJgWJCtAg_6Zac104GwpC7iu1iLBi33sHk8tz9b3Oc8w5',
  'XGxI73R4Uu88cRIL2AqoJngB6FxQhXeTexN8lMu0ejY=',
  'XGxI73R4Uu88cRIL2AqoJmZUOjq-1DhZURMBZYdfxv3hG1P_qnrIyxaEmseHd2aL'
]

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    res = await api('sign/UserSignNew', 'sceneval,source', {source: ''})
    console.log('签到', JSON.stringify(res))
    console.log('助力码', res.data.token)
    shareCodeSelf.push(res.data.token)
    let coin: number = res.data.pgAmountTotal
    console.log('金币', coin)

    res = await api('task/QueryUserTask', 'sceneval,taskType', {taskType: 0})

    let tasks: number[] = []
    for (let t of res.datas ?? []) {
      if (t.state !== 2)
        tasks.push(t.taskid)
    }
    await wait(2000)

    res = await api('task/QueryPgTaskCfg', 'sceneval', {})
    if (tasks.length === 0) {
      for (let t of res.data.tasks) {
        tasks.push(t.taskid)
      }
    }
    for (let t of res.data.tasks) {
      if (tasks.includes(t.taskid)) {
        console.log(t.taskName)
        res = await api('task/drawUserTask', 'sceneval,taskid', {taskid: t.taskId})
        await wait(1000)
        res = await api('task/UserTaskFinish', 'sceneval,taskid', {taskid: t.taskId})
        await wait(2000)
      }
    }

    res = await api('active/LuckyTwistUserInfo', 'sceneval', {})
    let surplusTimes: number = res.data.surplusTimes
    console.log('剩余抽奖次数', surplusTimes)
    for (let j = 0; j < surplusTimes && coin >= 10; j++) {
      res = await api('active/LuckyTwistDraw', 'active,activedesc,sceneval', {active: 'rwjs_fk1111', activedesc: encodeURIComponent('幸运扭蛋机抽奖')})
      console.log('抽奖成功', JSON.stringify(res))
      coin -= 10
      await wait(5000)
    }
    await wait(2000)
  }

  console.log('内部助力', shareCodeSelf)
  shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodeHW]))
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])

    for (let code of shareCode) {
      console.log(`${UserName} 去助力 ${code}`)
      res = await api('sign/helpSign', 'flag,sceneval,token', {flag: 0, token: code})
      console.log('助力结果', JSON.stringify(res))
      await wait(2000)
    }
  }
})()

async function api(fn: string, stk: string, params: any) {
  let url = h5st(`https://m.jingxi.com/pgcenter/${fn}?sceneval=2&_stk=sceneval&_ste=1&_=${Date.now()}&sceneval=2`, stk, params, 10012)
  let {data} = await axios.get(url, {
    headers: {
      'Host': 'm.jingxi.com',
      'User-Agent': 'jdpingou;',
      'Referer': 'https://st.jingxi.com/pingou/taskcenter/index.html',
      'Cookie': cookie
    }
  })
  return data
}