/**
 * 京喜-首页-牛牛福利
 * 助力 内部 -> HW.ts
 * 1 0,9,19,23 * * *
 */

import axios from "axios"
import {requireConfig, wait, h5st, o2s, getshareCodeHW} from "./TS_USER_AGENTS"

let cookie: string = '', UserName: string, index: number, res: any = ''
let shareCodeSelf: string[] = [], shareCode: string[] = [], shareCodeHW: string[] = []

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    res = await api('sign/UserSignNew', 'sceneval,source', {source: ''})
    console.log('签到')
    console.log('助力码', res.data.token)
    shareCodeSelf.push(res.data.token)
    let coin: number = res.data.pgAmountTotal
    console.log('金币', coin)

    /*
    res = await api('task/QueryUserTask', 'sceneval,taskType', {taskType: 0})
    let tasks: number[] = []
    if (res.datas) {
      for (let t of res.datas) {
        if (t.state !== 2)
          tasks.push(t.taskid)
      }
    } else {
      res = await api('task/QueryPgTaskCfg', 'sceneval', {})
      if (tasks.length === 0) {
        for (let t of res.data.tasks) {
          tasks.push(t.taskid)
        }
      }
    }
    console.log('tasks:', tasks)
    await wait(2000)

     */

    res = await api('task/QueryPgTaskCfg', 'sceneval', {})

    for (let t of res.data.tasks) {
      console.log(t.taskName)
      res = await api('task/drawUserTask', 'sceneval,taskid', {taskid: t.taskId})
      await wait(t.param7 * 1000 + 1000)
      res = await api('task/UserTaskFinish', 'sceneval,taskid', {taskid: t.taskId})
      o2s(res)
      await wait(2000)
    }

    res = await api('active/LuckyTwistUserInfo', 'sceneval', {})
    let surplusTimes: number = res.data.surplusTimes
    console.log('剩余抽奖次数', surplusTimes)
    for (let j = 0; j < surplusTimes && coin >= 10; j++) {
      res = await api('active/LuckyTwistDraw', 'active,activedesc,sceneval', {active: 'rwjs_fk1111', activedesc: encodeURIComponent('幸运扭蛋机抽奖')})
      console.log('抽奖成功', res.data)
      coin -= 10
      await wait(5000)
    }
    await wait(2000)
  }

  console.log('内部助力', shareCodeSelf)
  for (let i = 0; i < cookiesArr.length; i++) {
    if (shareCodeHW.length === 0) {
      shareCodeHW = await getshareCodeHW('nnfls')
    }
    shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodeHW]))
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])

    for (let code of shareCode) {
      console.log(`${UserName} 去助力 ${code}`)
      res = await api('sign/helpSign', 'flag,sceneval,token', {flag: 0, token: code})
      await wait(3000)
      res = await api('sign/helpSign', 'flag,sceneval,token', {flag: 1, token: code})
      console.log('助力结果', res.errMsg)
      if (res.errMsg === 'help day limit')
        break
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
