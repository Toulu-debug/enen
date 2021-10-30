/**
 * 京喜app->领88元红包
 * 先内部，后助力HW.ts
 * cron: 5 0,6,18 * * *
 */

import {requireConfig, wait, h5st, getBeanShareCode, getFarmShareCode} from "./TS_USER_AGENTS"
import axios from "axios"
import {Md5} from "ts-md5"
import {format} from 'date-fns'

const token = require('./utils/jd_jxmc.js').token

let cookie: string = '', res: any = '', UserName: string, index: number, UA: string = ''
let shareCodesSelf: string[] = [], shareCodes: string[] = [], shareCodesHW: string[] = [], jxToken: any

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)
    jxToken = await token(cookie)

    res = await api('GetUserInfo', 'activeId,channel,phoneid,publishFlag,stepreward_jstoken,timestamp,userDraw', {})
    let strUserPin: string = res.Data.strUserPin, dwHelpedTimes: number = res.Data.dwHelpedTimes
    console.log('收到助力:', dwHelpedTimes)
    console.log('助力码：', strUserPin)
    shareCodesSelf.push(strUserPin)
    await makeShareCodes(strUserPin)
    await wait(2000)
    res = await api('JoinActive', 'activeId,channel,phoneid,publishFlag,stepreward_jstoken,timestamp')
    res.iRet === 0 ? console.log('JoinActive: 成功') : console.log('JoinActive:', res.sErrMsg)
    await wait(1000)
  }

  console.log('内部助力码：', shareCodesSelf)

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    jxToken = await token(cookie)
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])

    await getCodesHW()
    shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW]))
    if (shareCodesHW.length !== 0) {
      console.log('获取随机助力码')
      res = await getCodesPool()
      shareCodes = Array.from(new Set([...shareCodes, ...res]))
    }
    console.log('助力排队:', shareCodes)

    for (let j = 0; j < shareCodes.length; j++) {
      console.log(`账号${i + 1} ${UserName} 去助力 ${shareCodes[j]}`)
      res = await api('EnrollFriend', 'activeId,channel,joinDate,phoneid,publishFlag,strPin,timestamp', {joinDate: format(Date.now(), 'yyyyMMdd'), strPin: shareCodes[j]})
      await wait(5000)
      if (res.iRet === 0) {
        console.log('成功')
      } else if (res.iRet === 2015) {
        console.log('上限')
        break
      } else if (res.iRet === 2016) {
        console.log('火爆')
        break
      } else {
        console.log('其他错误:', res)
      }
    }
  }

  // 拆红包
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    jxToken = await token(cookie)
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName} 拆红包\n`)

    res = await api('GetUserInfo', 'activeId,channel,phoneid,publishFlag,stepreward_jstoken,timestamp,userDraw', {userDraw: 1})
    let strUserPin: string = res.Data.strUserPin, dwHelpedTimes: number = res.Data.dwHelpedTimes
    await wait(2000)

    for (let t of res.Data.gradeConfig) {
      if (dwHelpedTimes >= t.dwHelpTimes) {
        res = await api('DoGradeDraw', 'activeId,channel,grade,phoneid,publishFlag,stepreward_jstoken,strPin,timestamp', {grade: t.dwGrade, strPin: strUserPin})
        if (res.iRet === 2018)
          console.log(`等级${t.dwGrade}红包已打开过`)
        else if (res.iRet === 0)
          console.log(`等级${t.dwGrade}红包打开成功`)
        else {
          console.log('其他错误', res.sErrMsg ?? JSON.stringify(res))
          break
        }
        await wait(15000)
      } else {
        break
      }
    }
  }
})()

interface Params {
  userDraw?: number,
  grade?: number,
  joinDate?: string,
  strPin?: string,
}

async function api(fn: string, stk: string, params: Params = {}) {
  let url: string = `https://m.jingxi.com/cubeactive/steprewardv3/${fn}?activeId=525597&publishFlag=1&channel=7&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&stepreward_jstoken=${jxToken['farm_jstoken']}&timestamp=${jxToken['timestamp']}&phoneid=${jxToken['phoneid']}`
  UA = `jdpingou;iPhone;4.13.0;14.4.2;${randomString(40)};network/wifi;model/iPhone10,2;appBuild/100609;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/${Math.random() * 98 + 1};pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`
  url = h5st(url, stk, params, 10010)
  try {
    let {data}: any = await axios.get(url, {
      headers: {
        'User-Agent': UA,
        'Referer': 'https://st.jingxi.com/pingou/jxmc/index.html',
        'Host': 'm.jingxi.com',
        'Cookie': cookie
      }
    })
    if (typeof data === 'string')
      return JSON.parse(data.replace(/jsonpCBK.?\(/, '').split('\n')[0])
    return data
  } catch (e: any) {
    return {}
  }
}

async function getCodesHW() {
  try {
    let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/HW_CODES`, {timeout: 10000})
    console.log('获取HW_CODES成功(api)')
    shareCodesHW = data['88hb']
  } catch (e: any) {
    console.log('获取HW_CODES失败(api)')
  }
}

async function getCodesPool() {
  try {
    let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/hb88/30`, {timeout: 10000})
    return data.data
  } catch (e: any) {
    console.log('获取助力池出错')
    return []
  }
}

async function makeShareCodes(code: string) {
  let bean: string = await getBeanShareCode(cookie)
  let farm: string = await getFarmShareCode(cookie)
  let pin: string = cookie.match(/pt_pin=([^;]*)/)![1]
  pin = Md5.hashStr(pin)
  try {
    let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/autoInsert/hb88?sharecode=${code}&bean=${bean}&farm=${farm}&pin=${pin}`, {timeout: 10000})
    if (data.code === 200)
      console.log('自动提交助力码成功')
    else
      console.log('自动提交助力码失败！已提交farm的cookie才可提交88hb')
  } catch (e: any) {
    console.log('自动提交助力码出错')
  }
}

function randomString(e: number) {
  e = e || 32
  let t = "0123456789abcdef", a = t.length, n = ""
  for (let i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a))
  return n
}
