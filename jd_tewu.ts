/**
 * 京东-下拉
 * cron: 0 9-20/1 * * *
 */

import axios from 'axios'
import USER_AGENT, {getshareCodeHW, o2s, randomString, requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, index: number, uuid: string
let shareCodeSelf: string[] = [], shareCode: string[] = [], shareCodeHW: string[] = []
let activityId: number, encryptProjectId: string, inviteTaskId: string;
let message: string = '', sendNotify = require('./sendNotify').sendNotify

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)
    uuid = randomString(40)
    try {
      res = await api('showSecondFloorCardInfo', {"source": "card"})
      activityId = res.data.result.activityBaseInfo.activityId
      encryptProjectId = res.data.result.activityBaseInfo.encryptProjectId

      // 已收集
      console.log('已收集')
      for (let card of res.data.result.activityCardInfo.cardPackList) {
        console.log(`card-${card.cardType}`, card.num, card.num === 0 ? "!!!" : "")
      }
    } catch (e) {
      console.log(e)
      continue
    }

    let activityCardInfo: any = res.data.result.activityCardInfo
    if (activityCardInfo.divideTimeStatus === 1 && activityCardInfo.divideStatus === 0 && activityCardInfo.cardStatus === 1) {
      res = await api('superBrandTaskLottery', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "tag": "divide"})
      console.log('瓜分', res.data.result.rewards[0].beanNum)
      message += `账号${index}  ${UserName}\n${res.data.result.rewards[0].beanNum}\n\n`
      await wait(2000)
    }

    res = await api('superBrandTaskList', {"source": "card", "activityId": activityId, "assistInfoFlag": 1})
    for (let t of res.data.result.taskList || []) {
      if (!t.completionFlag) {
        if (t.assignmentType === 1) {
          res = await api('superBrandDoTask', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": 1, "itemId": t.ext.shoppingActivity[0].itemId, "actionType": 0})
          o2s(res)
          await wait(2000)
        }

        if (t.assignmentType === 3) {
          res = await api('superBrandDoTask', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": 3, "itemId": t.ext.followShop[0].itemId, "actionType": 0})
          o2s(res)
          await wait(2000)
        }

        if (t.assignmentType === 5) {
          console.log(t.assignmentName)
          for (let sign2 of t.ext.sign2) {
            console.log(sign2.beginTime, sign2.status)
            let beginClock: number = new Date(`2021-01-01 ${sign2.beginTime}`).getHours()
            if (new Date().getHours() === beginClock && sign2.status === 1) {
              console.log('开始下拉任务')
              res = await api('superBrandDoTask', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": 5, "itemId": sign2.itemId, "actionType": 0, "dropDownChannel": 1})
              o2s(res)
            }
          }
        }

        if (t.assignmentType === 7) {
          console.log('开卡  pass')
        }
      }
      if (t.assignmentName === '邀请好友') {
        o2s(t)
        inviteTaskId = t.encryptAssignmentId
        console.log('助力码', t.ext.assistTaskDetail.itemId)
        shareCodeSelf.push(t.ext.assistTaskDetail.itemId)
        console.log('收到助力', t.completionCnt, '/', 30)
        for (let j = 0; j < t.ext.cardAssistBoxRest; j++) {
          res = await api('superBrandTaskLottery', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId})
          console.log('打开盒子', JSON.stringify(res))
          await wait(3000)
        }
      }
    }
    await wait(2000)
  }
  if (message) {
    await sendNotify("特物瓜分", message)
  }

  console.log('内部助力', shareCodeSelf)
  if (shareCodeHW.length === 0) {
    shareCodeHW = await getshareCodeHW('tw')
  }
  shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodeHW]))

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    for (let code of shareCode) {
      console.log(`账号 ${UserName} 去助力 ${code}`)
      res = await api('superBrandDoTask', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": inviteTaskId, "assignmentType": 2, "itemId": code, "actionType": 0})
      if (res.data.bizCode === '0') {
        console.log('成功')
      } else if (res.data.bizCode === '104') {
        console.log('已助力过')
      } else if (res.data.bizCode === '109') {
        console.log('不能自己给自己助力')
      } else {
        console.log('助力失败', res.data.bizMsg)
        await wait(2000)
      }
      await wait(2000)
    }
  }
})()

async function api(fn: string, body: object) {
  try {
    let {data} = await axios.post(`https://api.m.jd.com/?uuid=${uuid}&client=wh5&appid=ProductZ4Brand&functionId=${fn}&t=${Date.now()}&body=${encodeURIComponent(JSON.stringify(body))}`, '', {
      headers: {
        'Host': 'api.m.jd.com',
        'Origin': 'https://prodev.m.jd.com',
        'User-Agent': USER_AGENT,
        'Referer': 'https://prodev.m.jd.com/mall/active/ZskuZGqQMZ2j6L99PM1L8jg2F2a/index.html',
        'Cookie': cookie
      }
    })
    return data
  } catch (e) {
    console.log('Error')
    o2s(e)
    return ''
  }
}