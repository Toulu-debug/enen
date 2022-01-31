/**
 * 京喜-88红包-宝箱
 * 做任务、开宝箱
 * 每号可收20次助力，出1次助力
 * cron: 5 0,6,12 * * *
 * CK1默认优先助力HW.ts，其余助力CK1
 * HW_Priority: boolean
 * true  HW.ts -> 内部
 * false 内部   -> HW.ts
 */

import axios from 'axios'
import {requireConfig, wait, requestAlgo, h5st, randomWord} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, index: number
let shareCodeSelf: string[] = [], shareCode: string[] = [], shareCodeHW: string[] = ['bdf489af86e5021575040fffee407bc2', '92a46b6081a955fb4dcea1e56e590b3a', '638d77021a1dd4d74cad72d44afd9899', 'f4dc33716d2551e372fd44f5ac0baca8', 'c99659c47858f18fb34427fec4647f17', '34bf741e6bb01c53d879f58b2c1a9205']
let HW_Priority: boolean = true
process.env.HW_Priority === 'false' ? HW_Priority = false : ''

!(async () => {
  await requestAlgo()
  let cookiesArr: string[] = await requireConfig()
  cookie = cookiesArr[0]
  UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
  console.log(`\n开始【京东账号1 ${UserName}\n`)

  res = await api('query', 'signhb_source,smp,type', {})
  console.log('助力码:', res.smp)
  shareCodeSelf.push(res.smp)

  console.log('内部助力:', shareCodeSelf)
  for (let i = 0; i < cookiesArr.length; i++) {
    let HW_Random = shareCodeHW[Math.floor(Math.random() * shareCodeHW.length)]
    if (i === 0 && HW_Priority) {
      shareCode = Array.from(new Set([HW_Random, ...shareCodeSelf]))
    } else {
      shareCode = Array.from(new Set([...shareCodeSelf, HW_Random]))
    }
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    for (let code of shareCode) {
      console.log(`${UserName} 去助力 ${code}`)
      res = await api('query', 'signhb_source,smp,type', {signhb_source: 5, smp: code, type: 1})
      console.log('助力码:', res.smp)
      await wait(2000)
      if (res.autosign_sendhb !== '0' || res.todaysign === 1)
        break
    }
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    try {
      // 宝箱任务
      res = await api('query', 'ispp,signhb_source,smp,tk,type', {signhb_source: 5, smp: '', ispp: 0, tk: '', type: 1})
      try {
        console.log(res.invitesign)
        console.log(parseFloat(res.invitesign.getmoney))
      } catch (e) {
        console.log(res)
      }
      await wait(2000)

      res = await api('query', 'signhb_source,smp,type', {signhb_source: 5, smp: '', type: 1})
      for (let t of res.commontask || []) {
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

      // 开宝箱
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
  ispp?: number,
  tk?: string
}

async function api(fn: string, stk: string, params: Params = {}) {
  let url = `https://m.jingxi.com/fanxiantask/signhb/${fn}?_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
  if (fn.match(/(dotask|bxdraw)/)) {
    url = fn
  }
  url = h5st(url, stk, params, 10038)
  let {data}: any = await axios.get(url, {
    headers: {
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': 'jdpingou;',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Referer': 'https://st.jingxi.com/',
      'Cookie': cookie,
    }
  })
  return JSON.parse(data.match(/\((.*)/)![1])
}