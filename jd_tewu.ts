/**
 * 京东-下拉
 * cron: 15 1,22 * * *
 */

import axios from 'axios'
import {requireConfig, wait, o2s, getshareCodeHW} from './TS_USER_AGENTS'

interface ShareCode {
  activityId: number,
  encryptProjectId: string,
  encryptAssignmentId: string,
  itemId: string
}

let cookie: string = '', UserName: string = '', res: any = '', shareCodes: ShareCode[] = [], shareCodesSelf: ShareCode[] = [], shareCodesHW: any = []


!(async () => {
  let cookiesArr: any = await requireConfig()
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
        if (t.ext?.shoppingActivity) {
          let tp = t.ext.shoppingActivity[0]
          console.log(tp.title, tp.itemId)
          res = await api('superBrandDoTask', {"source": "secondfloor", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": 1, "itemId": tp.advId, "actionType": 0})
          console.log(res.data?.bizMsg)
          await wait(2000)
        }
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
    res = await api('superBrandSecondFloorMainPage', {"source": "secondfloor"})
    let userStarNum: number = res.data.result.activityUserInfo.userStarNum
    console.log('可以抽奖', userStarNum, '次')
    for (let i = 0; i < userStarNum; i++) {
      res = await api('superBrandTaskLottery', {"source": "secondfloor", "activityId": activityId})
      o2s(res)
      if (res.data.result?.rewardComponent?.beanList?.length) {
        console.log('抽奖获得京豆：', res.data.result.rewardComponent.beanList[0].quantity)
      }

      await wait(2000)
    }
  }
  shareCodesHW = await getshareCodeHW('tewu')
  shareCodes = [...shareCodesSelf, ...shareCodesHW]
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
      if (code.itemId !== mine) {
        console.log(`账号${index + 1} 去助力 ${code.itemId} ${shareCodesSelf.some(self => self.itemId === code.itemId) ? '*内部*' : ''}`)
        res = await api('superBrandDoTask', {"source": "secondfloor", "activityId": code.activityId, "encryptProjectId": code.encryptProjectId, "encryptAssignmentId": code.encryptAssignmentId, "assignmentType": 2, "itemId": code.itemId, "actionType": 0})
        if (res.data.bizCode === '0') {
          console.log('助力成功')
        } else if (res.data.bizCode === '103') {
          console.log('助力满了')
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