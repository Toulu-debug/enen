/**
 * 京东-下拉
 * cron: 15 8,20 * * *
 */

import USER_AGENT, {getCookie, wait, o2s, getshareCodeHW, post, exceptCookie} from './TS_USER_AGENTS'
import * as path from "path";

interface ShareCode {
  activityId: number,
  encryptProjectId: string,
  encryptAssignmentId: string,
  itemId: string
}

let cookie: string = '', UserName: string = '', res: any = '', message: string = '', shareCodes: ShareCode[] = [], shareCodesSelf: ShareCode[] = [], shareCodesHW: any = [], black: string[] = []
let except: string[] = exceptCookie(path.basename(__filename))

!(async () => {
  let cookiesArr: string[] = await getCookie()
  let activityId: number
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }
    res = await api('showSecondFloorCardInfo', {"source": "card"})
    try {
      activityId = res.data.result.activityBaseInfo.activityId

      let encryptProjectId: string = res.data.result.activityBaseInfo.encryptProjectId
      await wait(1000)
      let divide: boolean = res.data.result.activityCardInfo.divideStatus === 0 && res.data.result.activityCardInfo.cardStatus === 1

      // 任务
      res = await api('superBrandTaskList', {"source": "card", "activityId": activityId, "assistInfoFlag": 1})
      for (let t of res.data.result.taskList) {
        if (t.completionCnt !== t.assignmentTimesLimit) {
          // 浏览、关注
          if (t.ext?.shoppingActivity || t.ext?.followShop) {
            let tp = t.ext?.shoppingActivity || t.ext?.followShop
            tp = tp[0]
            console.log(tp.title || tp.shopName, tp.itemId)
            res = await api('superBrandDoTask', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": t.assignmentType, "itemId": tp.itemId, "actionType": 0})
            console.log(res.data?.bizMsg)
            await wait(2000)
          }

          // 下拉
          if (t.ext?.sign2) {
            for (let sign of t.ext.sign2) {
              if (sign.status === 0 && [10, 18].includes(new Date().getHours())) {
                res = await api('superBrandDoTask', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "encryptAssignmentId": t.encryptAssignmentId, "assignmentType": t.assignmentType, "itemId": t.ext.currentSectionItemId, "actionType": 0})
                console.log(res.data?.bizMsg)
                await wait(2000)
                console.log('下拉任务', t.ext?.sign2)
              } else if (sign.status !== 0) {
                console.log(`${sign.beginTime} 签到完成`)
              }
            }
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
      try {
        if (new Date().getHours() === 20) {
          let sum: number = 0
          res = await api('superBrandSecondFloorMainPage', {"source": "card"})
          let userStarNum: number = res.data.result.activityUserInfo.userStarNum
          console.log('可以抽奖', userStarNum, '次')
          for (let i = 0; i < userStarNum; i++) {
            res = await api('superBrandTaskLottery', {"source": "card", "activityId": activityId})
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
      } catch (e) {
        console.log('error')
      }
      await wait(2000)

      if (divide) {
        console.log('瓜分')
        res = await api('superBrandTaskLottery', {"source": "card", "activityId": activityId, "encryptProjectId": encryptProjectId, "tag": "divide"})
        if (res.data.success) {
          console.log('瓜分成功', res.data.result?.rewardComponent?.beanList[0]?.quantity)
        }
      }
    } catch (e) {
      black.push(UserName)
      await wait(2000)
    }
  }

  o2s(shareCodesSelf)
  shareCodesHW = await getshareCodeHW('tewu')
  shareCodes = [...shareCodesSelf, ...shareCodesHW]

  let full: string[] = []
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }
    if (black.includes(UserName)) {
      console.log('黑号')
      continue
    }
    for (let code of shareCodes) {
      if (full.includes(code.itemId))
        continue
      console.log(`账号${index + 1} ${UserName} 去助力 ${code.itemId}`)
      res = await api('superBrandDoTask', {"source": "card", "activityId": code.activityId, "encryptProjectId": code.encryptProjectId, "encryptAssignmentId": code.encryptAssignmentId, "assignmentType": 2, "itemId": code.itemId, "actionType": 0})
      if (res.data.bizCode === '0') {
        console.log('助力成功')
      } else if (res.data.bizCode === '103') {
        console.log('助力满了')
        full.push(code.itemId)
      } else if (res.data.bizCode === '104') {
        console.log('已助力过')
      } else if (res.data.bizCode === '108') {
        console.log('上限')
        break
      } else if (res.data.bizCode === '109') {
      } else if (res.data.bizCode === '2001') {
        console.log('黑号')
        break
      } else if (res.data.bizCode === '4001') {
        console.log('助力码过期')
        full.push(code.itemId)
      } else {
        o2s(res, 'error')
      }
      await wait(2000)
    }
  }
})()

async function api(fn: string, body: object) {
  return await post(`https://api.m.jd.com/?uuid=&client=wh5&appid=ProductZ4Brand&functionId=${fn}&t=${Date.now()}&body=${encodeURIComponent(JSON.stringify(body))}`, '', {
    'Host': 'api.m.jd.com',
    'Origin': 'https://pro.m.jd.com',
    'User-Agent': USER_AGENT,
    'Referer': 'https://pro.m.jd.com/',
    'Cookie': cookie
  })
}