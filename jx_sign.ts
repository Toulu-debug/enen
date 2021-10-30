/**
 * 任务、宝箱
 */

import axios from 'axios'
import * as path from "path"
import {requireConfig, wait, requestAlgo, h5st, exceptCookie, randomString} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, index: number
let shareCodeSelf: string[] = [], shareCode: string[] = [], shareCodeHW: string[] = [
  'aae98a3e3b04d3ac430ee9ee91f4759d',
  'bdf489af86e5021575040fffee407bc2',
  '92a46b6081a955fb4dcea1e56e590b3a',
  '638d77021a1dd4d74cad72d44afd9899',
  'f4dc33716d2551e372fd44f5ac0baca8'
]

!(async () => {
  await requestAlgo()
  let cookiesArr: any = await requireConfig()
  let except: string[] = exceptCookie(path.basename(__filename))

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    res = await api('query', 'signhb_source,smp,type', {})
    console.log('助力码:', res.smp)
    await wait(1000)
    shareCodeSelf.push(res.smp)
  }

  shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodeHW]))
  console.log('内部助力:', shareCodeSelf)
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    for (let code of shareCode) {
      console.log(`${UserName} 去助力 ${code}`)
      res = await api('query', 'signhb_source,smp,type', {signhb_source: 5, smp: code, type: 1})
      console.log('助力', JSON.stringify(res))
      await wait(2000)
    }
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    try {
      res = await api('query', 'signhb_source,smp,type', {signhb_source: 5, smp: '', type: 1})
      let rili: number = res.riliremind_task.status
      console.log(res.riliremind_task.getmoney)
      for (let t of res.commontask) {
        if (t.status === 1) {
          console.log(t.taskname)
          res = await api(`https://m.jingxi.com/fanxiantask/signhb/dotask?task=${t.task}&signhb_source=5&_=${Date.now()}&sceneval=2`, '')
          if (res.ret === 0) {
            console.log('任务完成，获得：', res.sendhb)
          } else {
            console.log('任务失败：', res.errmsg)
          }
          await wait(3000)
        }
      }

      // 日历
      if (rili === 1) {
        res = await api(`https://m.jingxi.com/fanxiantask/signhb/dotask?task=rili_remind&signhb_source=5&ispp=0&sqactive=&tk=&_stk=ispp%2Csignhb_source%2Csqactive%2Ctask%2Ctk&_ste=1&_=${Date.now()}&sceneval=2`, 'ispp,signhb_source,sqactive,task,tk')
        if (res.ret === 0) {
          console.log('日历任务完成')
        } else {
          console.log('日历任务失败', res)
        }
      }

      res = await api('query', 'signhb_source,smp,type', {signhb_source: 5, smp: '', type: 1})
      if (res.baoxiang_left != 0) {
        console.log(res.baoxiang_stage)
        for (let t of res.baoxiang_stage) {
          if (t.status === 1) {
            res = await api(`https://m.jingxi.com/fanxiantask/signhb/bxdraw?_=${Date.now()}&sceneval=2`, '')
            console.log('开宝箱，获得：', res.sendhb)
            await wait(3000)
          }
        }
      }
      res = await doubleSign()
      if (res.retCode === 0) {
        console.log('双签成功')
      } else {
        console.log('双签失败', res)
      }
    } catch (e: any) {
      console.log(e)
    }
    await wait(3000)
  }
})()

interface Params {
  signhb_source?: number,
  type?: number,
  smp?: string,
}

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise(async (resolve, reject) => {
    let url = `https://m.jingxi.com/fanxiantask/signhb/${fn}?_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2`
    if (fn.match(/(dotask|bxdraw)/)) {
      url = fn
    }
    url = h5st(url, stk, params, 10038)
    try {
      let {data}: any = await axios.get(url, {
        headers: {
          'Host': 'm.jingxi.com',
          'User-Agent': `jdpingou;iPhone;5.9.0;12.4.1;${randomString(40)};network/wifi;`,
          'Referer': 'https://st.jingxi.com/',
          'Cookie': cookie,
        }
      })
      if (typeof data === 'string') {
        data = data.replace('try{jsonpCBKB(', '').replace('try{Query(', '').replace('try{BxDraw(', '').replace('try{Dotask(', '').split('\n')[0]
        resolve(JSON.parse(data))
      } else {
        resolve(data)
      }
    } catch (e: any) {
      reject(e)
    }
  })
}

async function doubleSign() {
  try {
    let {data} = await axios.get('https://m.jingxi.com/double_sign/IssueReward?sceneval=2', {
      headers: {
        'Host': 'm.jingxi.com',
        'Origin': 'https://st.jingxi.com',
        'Accept': 'application/json',
        'User-Agent': 'jdpingou;',
        'Referer': 'https://st.jingxi.com/pingou/jxapp_double_signin/index.html',
        'Cookie': cookie
      }
    })
    return data
  } catch (e) {
    console.log(e)
    return ''
  }
}
