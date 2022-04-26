/**
 * 京东-新品-魔方
 * log自备
 * cron: 10 9,12,15 * * *
 */

import {o2s, requireConfig, wait, post} from './TS_USER_AGENTS'
import {mf_logs} from './test/mf_log';

let cookie: string = '', res: any = '', UserName: string, index: number, log: string = ''

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    res = await api("functionId=getInteractionHomeInfo&body=%7B%22sign%22%3A%22u6vtLQ7ztxgykLEr%22%7D&appid=content_ecology&client=wh5&clientVersion=1.0.0")
    let sign: string = res.result.taskConfig.projectId

    res = await api(`functionId=queryInteractiveInfo&body=%7B%22encryptProjectId%22%3A%22${sign}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
    // o2s(res)
    for (let t of res.assignmentList) {
      if (t.completionCnt < t.assignmentTimesLimit) {
        if (t.ext) {
          if (t.assignmentName === '每日签到') {
            if (t.ext.sign1.status === 1) {
              let signDay: number = t.ext.sign1.signList?.length || 0,
                type: number = t.rewards[signDay].rewardType
              console.log(signDay, type)
              log = getLog()
              res = await api(`functionId=doInteractiveAssignment&body=${JSON.stringify({
                "encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": "1", "actionType": "", "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}
              })}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              o2s(res, '签到成功')
            } else {
              console.log('已签到')
            }
          }

          for (let proInfo of t.ext.productsInfo ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              log = getLog()
              res = await api(`functionId=doInteractiveAssignment&body=${encodeURIComponent(JSON.stringify({"encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}}))}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              o2s(res)
              if (res.msg === '任务已完成') {
                break
              }
            }
          }

          for (let proInfo of t.ext.shoppingActivity ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              log = getLog()
              res = await api(`functionId=doInteractiveAssignment&body=${encodeURIComponent(JSON.stringify({"encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 1, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}}))}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              o2s(res)
              await wait(t.ext.waitDuration * 1000)
              log = getLog()
              res = await api(`functionId=doInteractiveAssignment&body=${encodeURIComponent(JSON.stringify({"encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}}))}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              o2s(res)
            }
          }

          for (let proInfo of t.ext.browseShop ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              log = getLog()
              res = await api(`functionId=doInteractiveAssignment&body=${JSON.stringify({
                "encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 1, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}
              })}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              o2s(res)
              await wait(t.ext.waitDuration * 1000)
              log = getLog()
              res = await api(`functionId=doInteractiveAssignment&body=${JSON.stringify({
                "encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}
              })}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              o2s(res)
            }
          }

          for (let proInfo of t.ext.addCart ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              log = getLog()
              res = await api(`functionId=doInteractiveAssignment&body=${encodeURIComponent(JSON.stringify({"encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": "0", "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFJGh5"}}))}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              o2s(res)
              if (res.msg === '任务已完成') {
                break
              }
            }
          }
        } else if (t.assignmentName === '去新品频道逛逛') {

        }
      }
    }
  }
})()

async function api(params: string) {
  await wait(1000)
  return await post("https://api.m.jd.com/client.action", params, {
    'Content-Type': 'application/x-www-form-urlencoded',
    "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.0.0; zh-cn; Mi Note 2 Build/OPR1.170623.032) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 XiaoMi/MiuiBrowser/10.1.1",
    'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html',
    'Origin': 'https://h5.m.jd.com',
    'Host': 'api.m.jd.com',
    'Cookie': cookie
  })
}

function getLog() {
  return mf_logs[Math.floor(Math.random() * mf_logs.length)]
}