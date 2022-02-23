/**
 * 京东-下拉
 * cron: 15 1,15,22 * * *
 */

import axios from 'axios'
import {requireConfig, wait, o2s, getshareCodeHW} from './TS_USER_AGENTS'

interface ShareCode {
  activityId: number,
  encryptProjectId: string,
  encryptAssignmentId: string,
  itemId: string
}

let cookie: string = '', UserName: string = '', res: any = '', message: string = '', shareCodes: ShareCode[] = [], shareCodesSelf: ShareCode[] = [], shareCodesHW: any = []


!(async () => {
  let cookiesArr: string[] = await requireConfig()
  let activityId: number
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    res = await api('superBrandSecondFloorMainPage', {"source": "secondfloor"})
    activityId = res.data.result.activityBaseInfo.activityId
    let encryptProjectId: string = res.data.result.activityBaseInfo.encryptProjectId
    await wait(1000)

    // 任务
    res = await api('superBrandTaskList', {"source": "secondfloor", "activityId": activityId, "assistInfoFlag": 1})
    o2s(res)

    for (let t of res.data.result.taskList) {
      if (t.completionCnt !== t.assignmentTimesLimit) {
        // 浏览、关注
        if (t.ext?.shoppingActivity || t.ext?.followShop) {
          let tp = t.ext?.shoppingActivity || t.ext?.followShop
          tp = tp[0]
          console.log(tp.title || tp.shopName, tp.itemId)
          res = await api('superBrandDoTask', {"source": "secondfloor", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": t.assignmentType, "itemId": tp.itemId, "actionType": 0})
          console.log(res.data?.bizMsg)
          await wait(2000)
        }

        // 下拉
        // if (t.ext?.sign2) {
        //   try {
        //     if (new Date().getHours() >= 14 && new Date().getHours() <= 20) {
        //       res = await api('superBrandDoTask', {"source": "secondfloor", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": t.assignmentType, "itemId": t.ext.sign2[0].itemId, "actionType": 0})
        //       console.log(res.data?.bizMsg)
        //       await wait(2000)
        //     }
        //   } catch (e) {
        //     console.log(t.ext?.sign2)
        //   }
        // }
      }

      // 助力码
      if (t.ext?.assistTaskDetail) {
        console.log('助力码：', t.ext.assistTaskDetail.itemId)
        console.log('收到助力：', t.ext?.assistList?.length ?? 0)
        shareCodesSelf.push({
          activityId: activityId,
          encryptProjectId: encryptProjectId,
          encryptAssignmentId: t.encryptAssignmentId,
          itemId: t.ext.assistTaskDetail.itemId
        })
      }
    }

    // 抽奖
    if (new Date().getHours() === 23) {
      let sum: number = 0
      res = await api('superBrandSecondFloorMainPage', {"source": "secondfloor"})
      let userStarNum: number = res.data.result.activityUserInfo.userStarNum
      console.log('可以抽奖', userStarNum, '次')
      for (let i = 0; i < userStarNum; i++) {
        res = await api('superBrandTaskLottery', {"source": "secondfloor", "activityId": activityId})
        if (res.data.result?.rewardComponent?.beanList?.length) {
          console.log('抽奖获得京豆：', res.data.result.rewardComponent.beanList[0].quantity)
          sum += res.data.result.rewardComponent.beanList[0].quantity
        } else {
          console.log('没抽到？', JSON.stringify(res))
        }
        await wait(2000)
      }
      message += `【京东账号${index + 1}】${UserName}\n抽奖${userStarNum}次，获得京豆${sum}\n\n`
    }
  }
  // await sendNotify('京东-下拉', message)

  console.log(shareCodesSelf)
  await wait(3000)

  shareCodesHW = await getshareCodeHW('tewu')
  shareCodes = [...shareCodesSelf, ...shareCodesHW]
  let full: string[] = []
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    res = await api('superBrandTaskList', {"source": "secondfloor", "activityId": activityId, "assistInfoFlag": 1})
    let mine: string = ''
    for (let t of res.data.result.taskList) {
      if (t.ext?.assistTaskDetail) {
        mine = t.ext.assistTaskDetail.itemId
      }
    }
    for (let code of shareCodes) {
      if (code.itemId !== mine && !full.includes(code.itemId)) {
        console.log(`账号${index + 1} 去助力 ${code.itemId} ${shareCodesSelf.some(self => self.itemId === code.itemId) ? '*内部*' : ''}`)
        res = await api('superBrandDoTask', {"source": "secondfloor", "activityId": code.activityId, "encryptProjectId": code.encryptProjectId, "encryptAssignmentId": code.encryptAssignmentId, "assignmentType": 2, "itemId": code.itemId, "actionType": 0})
        if (res.data.bizCode === '0') {
          console.log('助力成功')
        } else if (res.data.bizCode === '103') {
          console.log('助力满了')
          full.push(code.itemId)
        } else if (res.data.bizCode === '108') {
          console.log('上限')
          break
        } else if (res.data.bizCode === '2001') {
          console.log('黑号')
          break
        } else {
          console.log('其他错误', res.data.bizMsg)
        }
        await wait(2000)
      } else {
        console.log('助力满了，跳过')
      }
    }
  }
})()

async function api(fn: string, body: object) {
  let {data} = await axios.post(`https://api.m.jd.com/api?functionId=${fn}&appid=ProductZ4Brand&client=wh5&t=${Date.now()}&body=${encodeURIComponent(JSON.stringify(body))}`, '', {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://pro.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'jdapp;iPhone;10.3.2;',
      'Referer': 'https://pro.m.jd.com/',
      'Cookie': cookie
    }
  })
  return data
}