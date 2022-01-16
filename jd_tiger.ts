/**
 * 京东-萌虎摇摇乐
 * https://yearfestival.jd.com
 * cron: 0 0,9,16 * * *
 * 助力顺序
 * CK1    HW.ts -> 内部   -> 助力池
 * CK2~n  内部   -> HW.ts -> 助力池
 */

import axios from 'axios'
import USER_AGENT, {requireConfig, wait, getshareCodeHW, getShareCodePool, o2s} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', shareCodes: string[] = [], UserName: string = '', shareCodesSelf: string[] = [], shareCodesHW: string[] = []

let cards = {}

!(async () => {
  let cookiesArr: any = await requireConfig()
  if (process.argv[2]) {
    cookiesArr = [decodeURIComponent(process.argv[2])];
    console.log(`收到Cookie：${decodeURIComponent(cookiesArr[0])}`)
  }
  /*
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    res = await api({"apiMapping": "/api/card/list"})
    cards[decodeURIComponent(UserName)] = {}
    let flag: boolean = true
    for (let c of res.data.cardList) {
      let cardId: number = c.cardId, cardCount: number = c.count
      console.log(c.cardName, cardId, cardCount)
      let uuid: string = ''
      if (cardCount > 1 && flag) {
        res = await api({"cardId": cardId, "apiMapping": "/api/card/share"})
        res.msg === '您今天赠送卡片次数已用完'
          ? flag = false
          : uuid = res.data
        await wait(1000)
      }
      cards[decodeURIComponent(UserName)][cardId] = {cardCount, uuid}
    }
  }

  console.log(cards)

  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    try {
      let myCards: any = cards[decodeURIComponent(UserName)]
      for (let key in myCards) {
        let cardId: string = key, cardCount: number = myCards[key]["cardCount"]

        console.log(cardId, cardCount)
        if (cardCount === 0) {
          console.log('卡片不足')
          for (let key in cards) {
            if (decodeURIComponent(key) !== UserName && cards[key][cardId]["cardCount"] > 1 && cards[key][cardId]["uuid"]) {
              let haoxinren: string = decodeURIComponent(key)
              console.log('好心人', haoxinren, cardId)
              res = await api({"uuid": cards[haoxinren][cardId]["uuid"], "apiMapping": "/api/card/receiveCard"})
              try{
              console.log(`账号${index + 1} 收到好心人 ${haoxinren} 卡片 ${res.data.cardName} 1张`)
              }catch(e){
                o2s('赠送卡片出错',res)
              }
              await wait(1000)
              cards[encodeURIComponent(UserName)][cardId]["cardCount"]++
              cards[key][cardId]["cardCount"]--
            }
          }
        }
      }
    } catch (e) {
      console.log('黑号？', e)
    }
  }
  console.log(cards)
  */

  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    try {
      res = await api({"apiMapping": "/api/task/support/getShareId"})
      console.log('助力码：', res.data)
      await wait(1000)
      shareCodesSelf.push(res.data)
      res = await api({"apiMapping": "/api/task/support/list"})
      console.log('收到助力：', res.data.supportedNum)
      await wait(1000)

      res = await api({"apiMapping": "/api/task/brand/tabs"})
      await wait(1000)
      for (let tab of res.data) {
        let taskGroupId: number = tab.taskGroupId
        res = await api({"taskGroupId": taskGroupId, "apiMapping": "/api/task/brand/getTaskList"})
        for (let t of res.data) {
          for (let i = t.finishNum; i < t.totalNum; i++) {
            res = await getTaskDetail(taskGroupId)
            if (res) {
              console.log(taskGroupId, res.taskId, res.taskItemId, res.taskType, res.taskItemName)
              let sleep: number = res.browseTime ? res.browseTime * 1000 : 1000
              res = await api({"taskGroupId": taskGroupId, "taskId": res.taskId, "taskItemId": res.taskItemId, "apiMapping": "/api/task/brand/doTask"})
              await wait(sleep)
              if (res.data.taskType === 'BROWSE_TASK') {
                res = await api({"taskGroupId": taskGroupId, "taskId": res.data.taskId, "taskItemId": res.data.taskItemId, "timestamp": res.data.timeStamp, "apiMapping": "/api/task/brand/getReward"})
                console.log('任务完成，积分：', res.data.integral, '，京豆：', res.data.jbean)
                await wait(1000)
              } else if (res.data.taskType === 'FOLLOW_SHOP_TASK') {
                // console.log('任务完成，获得：', res.data.rewardInfoVo?.integral, res.data.rewardInfoVo?.jbean)
                console.log(res.data.rewardInfoVo)
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('黑号？', e)
    }
  }

  // 助力
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])

    try {
      let temp: string[] = await getShareCodePool('tiger', 30)
      if (shareCodesHW.length === 0) {
        shareCodesHW = await getshareCodeHW('tiger')
      }
      index === 0
        ? shareCodes = Array.from(new Set([...shareCodesHW, ...shareCodesSelf, ...temp]))
        : shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW, ...temp]))
      for (let code of shareCodes) {
        console.log(`账号${index + 1} 去助力 ${code} ${shareCodesSelf.includes(code) ? '(内部)' : ''}`)
        res = await api({"shareId": code, "apiMapping": "/api/task/support/doSupport"})
        if (res.data.status === 1) {
          !res.data.supporterPrize
            ? console.log('不助力自己')
            : console.log('助力成功，京豆：', res.data.supporterPrize?.beans, '，积分：', res.data.supporterPrize?.score)
        } else if (res.data.status === 7) {
          console.log('上限')
          break
        } else if (res.data.status === 3) {
          console.log('已助力过')
        } else {
          console.log('其他情况', res.data.status)
        }
        await wait(1000)
      }
    } catch (e) {
      console.log('黑号？', e)
    }
  }

  // 抽奖
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    try {
      res = await api({"apiMapping": "/api/index/indexInfo"})
      let lotteryNum: number = res.data.lotteryNum
      console.log('抽奖次数：', lotteryNum)
      for (let i = 0; i < lotteryNum; i++) {
        res = await api({"apiMapping": "/api/lottery/lottery"})
        console.log('抽奖', i + 1, '/', lotteryNum, res.data.prizeName)
        await wait(4000)
      }
    } catch (e) {
      console.log('黑号？', e)
    }
  }
})()

async function api(body: object) {
  let {data} = await axios.post('https://api.m.jd.com/api', `appid=china-joy&functionId=collect_bliss_cards_prod&body=${JSON.stringify(body)}&t=${Date.now()}&loginType=2`, {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://yearfestival.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': USER_AGENT,
      'Referer': 'https://yearfestival.jd.com/',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Cookie': cookie
    }
  })
  return data
}

async function getTaskDetail(taskGroupId: number) {
  let res = await api({"taskGroupId": taskGroupId, "apiMapping": "/api/task/brand/getTaskList"})
  await wait(1000)
  for (let t of res.data) {
    if (t.finishNum !== t.totalNum) {
      return t
    }
  }
  return ''
}