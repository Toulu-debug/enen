/**
 * 京喜牧场
 * cron: 10 0,12,18 * * *
 */

import axios from 'axios'
import {Md5} from "ts-md5"
import * as path from 'path'
import {sendNotify} from './sendNotify'
import {requireConfig, getBeanShareCode, getFarmShareCode, wait, requestAlgo, h5st, exceptCookie, resetHosts, randomString, o2s} from './TS_USER_AGENTS'

const cow = require('./utils/jd_jxmc.js').cow
const token = require('./utils/jd_jxmc.js').token

let cookie: string = '', res: any = '', shareCodes: string[] = [], homePageInfo: any, jxToken: any, UserName: string, index: number
let shareCodesHbSelf: string[] = [], shareCodesHbHw: string[] = [], shareCodesSelf: string[] = [], shareCodesHW: string[] = []

!(async () => {
  await requestAlgo()
  let cookiesArr: any = await requireConfig()
  if (process.argv[2]) {
    console.log('收到命令行cookie')
    cookiesArr = [unescape(process.argv[2])]
  }
  let except: string[] = exceptCookie(path.basename(__filename))

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    jxToken = await token(cookie)
    homePageInfo = await api('queryservice/GetHomePageInfo', 'activeid,activekey,channel,isgift,isqueryinviteicon,isquerypicksite,jxmc_jstoken,phoneid,sceneid,timestamp', {isgift: 1, isquerypicksite: 1, isqueryinviteicon: 1})
    if (homePageInfo.data.maintaskId !== 'pause') {
      console.log('init...')
      for (let j = 0; j < 20; j++) {
        res = await api('operservice/DoMainTask', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,step,timestamp', {step: homePageInfo.data.maintaskId})
        if (res.data.maintaskId === 'pause')
          break
        await wait(2000)
      }
    }

    homePageInfo = await api('queryservice/GetHomePageInfo', 'activeid,activekey,channel,isgift,isqueryinviteicon,isquerypicksite,jxmc_jstoken,phoneid,sceneid,timestamp', {isgift: 1, isquerypicksite: 1, isqueryinviteicon: 1})
    let lastgettime: number
    if (homePageInfo.data?.cow?.lastgettime) {
      lastgettime = homePageInfo.data.cow.lastgettime
    } else {
      continue
    }

    let food: number = 0
    try {
      food = homePageInfo.data.materialinfo[0].value
    } catch (e: any) {
      console.log('未开通？黑号？')
      continue
    }
    let petid: string = homePageInfo.data.petinfo[0].petid
    let coins = homePageInfo.data.coins

    console.log('助力码:', homePageInfo.data.sharekey)
    shareCodesSelf.push(homePageInfo.data.sharekey)
    try {
      await makeShareCodes(homePageInfo.data.sharekey)
    } catch (e: any) {
      console.log(e)
    }

    console.log('草草🌿', food)
    console.log('蛋蛋🥚', homePageInfo.data.eggcnt)
    console.log('钱钱💰', coins)

    // 助农
    let tasks: any = await api('GetUserTaskStatusList', 'bizCode,dateType,jxpp_wxapp_type,showAreaTaskFlag,source', {dateType: '2', showAreaTaskFlag: 0, jxpp_wxapp_type: 7}, true)
    for (let t of tasks.data.userTaskStatusList) {
      if (t.awardStatus === 2) {
        console.log(t.taskName)
        if (t.completedTimes < t.targetTimes) {
          for (let j = t.completedTimes; j < t.targetTimes; j++) {
            res = await api('DoTask', 'bizCode,configExtra,source,taskId', {taskId: t.taskId}, true)
            if (res.ret === 0) {
              console.log('任务完成')
            } else {
              console.log('任务失败')
              break
            }
            await wait(5000)
          }
        } else {
          res = await api('Award', 'bizCode,source,taskId', {taskId: t.taskId}, true)
          if (res.ret === 0) {
            console.log('领奖成功', res.data.prizeInfo.match(/:(.*)}/)![1])
          } else {
            console.log('领奖失败')
            break
          }
          await wait(2000)
        }
      }
    }

    // 扭蛋机
    res = await api('queryservice/GetCardInfo', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
    for (let card of res.data.cardinfo) {
      console.log(`card ${card.cardtype}`, card.currnum, '/', card.neednum)
      if (card.currnum >= card.neednum) {
        console.log('可以兑换')
        // TODO 兑换卡片
        await sendNotify('牧场卡片可兑换', UserName)
      }
    }
    let drawTimes = res.data.times
    if (typeof drawTimes === "undefined") {
      await sendNotify("牧场扭蛋机错误", `账号${i + 1} ${UserName}\n手动建造扭蛋机`)
    } else {
      console.log('扭蛋机剩余次数:', drawTimes)
      await wait(1000)
      for (let j = 0; j < drawTimes; j++) {
        res = await api('operservice/DrawCard', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
        if (res.ret === 0) {
          if (res.data.prizetype === 3) {
            console.log('抽奖成功，金币：', res.data.addcoins)
          } else if (res.data.prizetype === 1) {
            console.log('抽奖成功，卡片：', res.data.cardtype)
          } else {
            console.log('抽奖成功，其他：', res)
          }
          await wait(4000)
        } else {
          console.log('抽奖失败:', res)
          break
        }
      }
    }

    // 红包
    res = await api('operservice/GetInviteStatus', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
    console.log('红包助力:', res.data.sharekey)
    shareCodesHbSelf.push(res.data.sharekey)
    try {
      await makeShareCodesHb(res.data.sharekey)
    } catch (e: any) {
    }

    // 收牛牛
    let cowToken = await cow(lastgettime)
    console.log(cowToken)
    res = await api('operservice/GetCoin', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,token', {token: cowToken})
    if (res.ret === 0)
      console.log('收牛牛:', res.data.addcoin)
    else
      console.log('收牛牛:', res)
    await wait(1000)

    // 签到
    res = await api('queryservice/GetSignInfo', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
    if (res.data.signlist) {
      for (let day of res.data.signlist) {
        if (day.fortoday && !day.hasdone) {
          res = await api('operservice/GetSignReward', 'channel,currdate,sceneid', {currdate: res.data.currdate})
          if (res.ret === 0) {
            console.log('签到成功!')
          } else {
            console.log(res)
          }
          break
        }
      }
    } else {
      console.log('没有获取到签到信息！')
    }

    // 登录领白菜
    res = await api('queryservice/GetVisitBackInfo', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
    if (res.iscandraw === 1) {
      res = await api('operservice/GetVisitBackCabbage', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
      if (res.ret === 0) {
        console.log('登录领白菜：', res.data.drawnum)
      }
    }

    console.log('任务列表开始')
    for (let j = 0; j < 30; j++) {
      if (await getTask() === 0) {
        break
      }
      await wait(3000)
    }
    console.log('任务列表结束')

    while (coins >= 5000 && food <= 500) {
      res = await api('operservice/Buy', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,type', {type: '1'})
      if (res.ret === 0) {
        console.log('买草成功:', res.data.newnum)
        coins -= 5000
        food += 100
      } else {
        console.log(res)
        break
      }
      await wait(5000)
    }
    await wait(3000)

    console.log('food:', food, food >= 10)
    while (food >= 10) {
      res = await api('operservice/Feed', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
      if (res.ret === 0) {
        food -= 10
        console.log('剩余草:', res.data.newnum)
      } else if (res.ret === 2020) {
        console.log('收🥚')
        homePageInfo = await api('queryservice/GetHomePageInfo', 'activeid,activekey,channel,isgift,isqueryinviteicon,isquerypicksite,jxmc_jstoken,phoneid,sceneid,timestamp', {
          isgift: 1,
          isquerypicksite: 1,
          isqueryinviteicon: 1
        })
        for (let t of homePageInfo.data.petinfo) {
          if (t.progress === '0') {
            petid = t.petid
            break
          }
        }
        res = await api('operservice/GetSelfResult', 'activeid,activekey,channel,itemid,jxmc_jstoken,phoneid,sceneid,timestamp,type', {itemid: petid, type: '11'})
        if (res.ret === 0) {
          console.log('收🥚成功:', res.data.newnum)
        } else {
          console.log('收🥚失败:', res)
          break
        }
      } else if (res.ret === 2005) {
        console.log('今天吃撑了')
        break
      } else {
        console.log('Feed未知错误:', res)
        break
      }
      await wait(6000)
    }
    await wait(3000)

    while (1) {
      try {
        res = await api('operservice/Action', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,type', {type: '2'})
        if (res.data.addcoins === 0 || JSON.stringify(res.data) === '{}') break
        console.log('锄草:', res.data.addcoins)
        await wait(5000)
        if (res.data.surprise) {
          res = await api("operservice/GetSelfResult", "activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,type", {type: '14', itemid: 'undefined'})
          console.log('锄草奖励:', res.data.prizepool)
          await wait(5000)
        }
      } catch (e: any) {
        console.log('Error:', e)
        break
      }
    }
    await wait(5000)

    while (1) {
      try {
        res = await api('operservice/Action', 'activeid,activekey,channel,jxmc_jstoken,petid,phoneid,sceneid,timestamp,type', {
          type: '1',
          petid: petid
        })
        if (res.data.addcoins === 0 || JSON.stringify(res.data) === '{}') break
        console.log('挑逗:', res.data.addcoins)
        await wait(5000)
      } catch (e: any) {
        console.log('Error:', e)
        break
      }
    }
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    await getCodes()
    // 获取随机红包码
    try {
      resetHosts()
      let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/jxmchb/30`, {timeout: 10000})
      console.log('获取到30个随机红包码:', data.data)
      shareCodes = Array.from(new Set([...shareCodesHbSelf, ...shareCodesHbHw, ...data.data]))
    } catch (e: any) {
      console.log('获取助力池失败')
      shareCodes = Array.from(new Set([...shareCodesHbSelf, ...shareCodesHbHw]))
    }

    cookie = cookiesArr[i]
    jxToken = await token(cookie)
    for (let j = 0; j < shareCodes.length; j++) {
      console.log(`账号${i + 1}去助力${shareCodes[j]}`)
      res = await api('operservice/InviteEnroll', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,sharekey,timestamp', {sharekey: shareCodes[j]})
      if (res.ret === 0) {
        console.log('成功')
      } else if (res.ret === 2711) {
        console.log('上限')
        break
      } else {
        console.log('失败：', res)
      }
      await wait(8000)
    }
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    await getCodes()
    // 获取随机助力码
    try {
      resetHosts()
      let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/jxmc/30`, {timeout: 10000})
      console.log('获取到30个随机助力码:', data.data)
      shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW, ...data.data]))
    } catch (e: any) {
      console.log('获取助力池失败')
      shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW]))
    }
    cookie = cookiesArr[i]
    jxToken = await token(cookie)
    for (let j = 0; j < shareCodes.length; j++) {
      console.log(`账号${i + 1}去助力${shareCodes[j]}`)
      res = await api('operservice/EnrollFriend', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,sharekey,timestamp', {sharekey: shareCodes[j]})
      if (res.ret === 0) {
        console.log('成功，获得:', res.data.addcoins)
      } else {
        console.log('失败：', res)
      }
      await wait(8000)
    }
  }
})()

interface Params {
  isgift?: number,
  isquerypicksite?: number,
  petid?: string,
  itemid?: string,
  type?: string,
  taskId?: number
  configExtra?: string,
  sharekey?: string,
  currdate?: string,
  token?: string,
  isqueryinviteicon?: number,
  showAreaTaskFlag?: number,
  jxpp_wxapp_type?: number,
  dateType?: string,
  step?: string,
}

async function getTask() {
  console.log('刷新任务列表')
  res = await api('GetUserTaskStatusList', 'bizCode,dateType,jxpp_wxapp_type,showAreaTaskFlag,source', {dateType: '', showAreaTaskFlag: 0, jxpp_wxapp_type: 7})
  for (let t of res.data.userTaskStatusList) {
    if (t.completedTimes == t.targetTimes && t.awardStatus === 2) {
      res = await api('Award', 'bizCode,source,taskId', {taskId: t.taskId})
      if (res.ret === 0) {
        let awardCoin = res.data.prizeInfo.match(/:(.*)}/)![1] * 1
        console.log('领奖成功:', awardCoin)
        await wait(4000)
        return 1
      } else {
        console.log('领奖失败:', res)
        return 0
      }
    }

    if (t.dateType === 2 && t.completedTimes < t.targetTimes && t.awardStatus === 2 && t.taskType === 2) {
      res = await api('DoTask', 'bizCode,configExtra,source,taskId', {taskId: t.taskId, configExtra: ''})
      if (res.ret === 0) {
        console.log('任务完成')
        await wait(5000)
        return 1
      } else {
        console.log('任务失败:', res)
        return 0
      }
    }
  }
  return 0
}

async function api(fn: string, stk: string, params: Params = {}, temporary: boolean = false) {
  let url: string
  if (['GetUserTaskStatusList', 'DoTask', 'Award'].indexOf(fn) > -1) {
    if (temporary)
      url = h5st(`https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?_=${Date.now()}&source=jxmc_zanaixin&bizCode=jxmc_zanaixin&_stk=${encodeURIComponent(stk)}&_ste=1&sceneval=2`, stk, params, 10028)
    else
      url = h5st(`https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?_=${Date.now()}&source=jxmc&bizCode=jxmc&_stk=${encodeURIComponent(stk)}&_ste=1&sceneval=2`, stk, params, 10028)
  } else {
    url = h5st(`https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activeid=jxmc_active_0001&activekey=null&jxmc_jstoken=${jxToken['farm_jstoken']}&timestamp=${jxToken['timestamp']}&phoneid=${jxToken['phoneid']}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now() + 2}&sceneval=2`, stk, params, 10028)
  }
  try {
    let {data}: any = await axios.get(url, {
      headers: {
        'Host': 'm.jingxi.com',
        'User-Agent': `jdpingou;iPhone;5.9.0;12.4.1;${randomString(40)};network/wifi;`,
        'Referer': 'https://st.jingxi.com/pingou/jxmc/index.html',
        'Cookie': cookie
      }
    })
    if (typeof data === 'string')
      return JSON.parse(data.replace(/jsonpCBK.?\(/, '').split('\n')[0])
    return data
  } catch (e: any) {
    console.log('api Error:', e)
    return {}
  }
}

function makeShareCodes(code: string) {
  return new Promise(async (resolve, reject) => {
    let bean: string = await getBeanShareCode(cookie)
    let farm: string = await getFarmShareCode(cookie)
    let pin: string = cookie.match(/pt_pin=([^;]*)/)![1]
    pin = Md5.hashStr(pin)
    resetHosts()
    await axios.get(`https://api.jdsharecode.xyz/api/autoInsert/jxmc?sharecode=${code}&bean=${bean}&farm=${farm}&pin=${pin}`, {timeout: 10000})
      .then((res: any) => {
        if (res.data.code === 200)
          console.log('已自动提交助力码')
        else
          console.log('提交失败！已提交farm的cookie才可提交cfd')
        resolve(200)
      })
      .catch(() => {
        reject('访问助力池出错')
      })
  })
}

function makeShareCodesHb(code: string) {
  return new Promise(async (resolve, reject) => {
    let bean: string = await getBeanShareCode(cookie)
    let farm: string = await getFarmShareCode(cookie)
    let pin: string = cookie.match(/pt_pin=([^;]*)/)![1]
    pin = Md5.hashStr(pin)
    resetHosts()
    await axios.get(`https://api.jdsharecode.xyz/api/autoInsert/jxmchb?sharecode=${code}&bean=${bean}&farm=${farm}&pin=${pin}`, {timeout: 10000})
      .then((res: any) => {
        if (res.data.code === 200)
          console.log('已自动提交红包码')
        else
          console.log('提交失败！已提交farm的cookie才可提交cfd')
        resolve(200)
      })
      .catch(() => {
        reject('访问助力池出错')
      })
  })
}

async function getCodes() {
  try {
    let {data}: any = await axios.get('https://api.jdsharecode.xyz/api/HW_CODES')
    shareCodesHW = data.jxmc || []
    shareCodesHbHw = data.jxmchb || []
  } catch (e) {
  }
}