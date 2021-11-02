/**
 * 京东-下拉
 * cron: 0 9,13,16,19,23 * * *
 */

import axios from 'axios'
import USER_AGENT, {getshareCodeHW, o2s, randomString, requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, index: number, uuid: string
let shareCodeSelf: string[] = [], shareCode: string[] = [], shareCodeHW: string[] = []
let activityId: number, encryptProjectId: string, inviteTaskId: string;
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
    } catch (e) {
      console.log(e)
      continue
    }

    res = await api('superBrandTaskList', {"source": "card", "activityId": activityId, "assistInfoFlag": 1})
    o2s(res)
    for (let t of res.data.result.taskList || []) {
      if (!t.completionFlag) {
        if (t.assignmentName !== '邀请好友' && t.assignmentName !== '去首页限时下拉') {
          console.log(t.assignmentName)
          res = await api('superBrandDoTask', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": 1, "itemId": t.ext.shoppingActivity[0].itemId, "actionType": 0})
          if (res.data.bizCode === '0') {
            console.log('任务完成', res.data.result.rewards[1].beanNum)
          }
          await wait(3000)
        }
        if (t.assignmentName === '邀请好友') {
          inviteTaskId = t.encryptAssignmentId
          console.log('助力码', t.ext.assistTaskDetail.itemId)
          shareCodeSelf.push(t.ext.assistTaskDetail.itemId)
          res = await api('superBrandMyVoteFriendList', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assistInfoFlag": 1})
          console.log('收到助力', t.completionCnt, '/', 30)
          if (t.completionCnt >= 10 && t.ext.cardAssistBoxOpen === 0) {
            res = await api('superBrandTaskLottery', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId})
            await wait(2000)
            console.log('打开成功 1号盒子')
          }
          if (t.completionCnt >= 20 && t.ext.cardAssistBoxOpen === 1) {
            res = await api('superBrandTaskLottery', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId})
            await wait(2000)
            console.log('打开成功 2号盒子')
          }
          if (t.completionCnt >= 30 && t.ext.cardAssistBoxOpen === 1) {
            res = await api('superBrandTaskLottery', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId})
            await wait(2000)
            console.log('打开成功 3号盒子')
          }
        }
        if (t.assignmentName === '去首页限时下拉') {
          let arr = {
            9: '090000100000',
            13: '130000140000',
            16: '160000170000',
            19: '190000200000'
          }
          res = await api('superBrandDoTask', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": 5, "itemId": arr[new Date().getHours()], "actionType": 0, "dropDownChannel": 1})
          if (res.data.bizCode === '0') {
            console.log('任务完成', res.data.result.rewards[1].beanNum)
          } else {
            console.log('任务失败', res, res.data.bizMsg)
          }
        }
      }
    }
    await wait(1000)
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
    let {data} = await axios.post(`https://api.m.jd.com/?uuid=${uuid}&client=wh5&appid=ProductZ4Brand&functionId=${fn}&t=${+new Date()}&body=${encodeURIComponent(JSON.stringify(body))}`, '', {
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