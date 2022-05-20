/**
 * 🐢魔方
 * cron: 10 9,12,15 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {Log} from "./utils/mf_log";

class Mofang extends JDHelloWorld {
  user: User
  mfTool: Log

  constructor() {
    super()
    this.mfTool = new Log()
  }

  async init() {
    await this.run(this)
  }

  async api(params: string) {
    await this.wait(1000)
    return await this.post("https://api.m.jd.com/client.action", params, {
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": "MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
      'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html',
      'Origin': 'https://h5.m.jd.com',
      'Host': 'api.m.jd.com',
      'Cookie': this.user.cookie
    })
  }

  async getLog(): Promise<string> {
    return await this.mfTool.main()
  }

  async main(user: User) {
    this.user = user
    let log: string = '', res: any
    res = await this.api("functionId=getInteractionHomeInfo&body=%7B%22sign%22%3A%22u6vtLQ7ztxgykLEr%22%7D&appid=content_ecology&client=wh5&clientVersion=1.0.0")

    let sign: string = res.result.taskConfig.projectId, rewardSign: string = res.result.giftConfig.projectId

    res = await this.api(`functionId=queryInteractiveInfo&body=%7B%22encryptProjectId%22%3A%22${sign}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
    for (let t of res.assignmentList) {
      if (t.completionCnt < t.assignmentTimesLimit) {
        if (t.ext) {
          if (t.assignmentName === '每日签到') {
            if (t.ext.sign1.status === 1) {
              let signDay: number = t.ext.sign1.signList?.length || 0, type: number = t.rewards[signDay].rewardType
              console.log(signDay, type)
              log = await this.getLog()
              res = await this.api(`functionId=doInteractiveAssignment&body=${JSON.stringify({
                "encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": "1", "actionType": "", "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}
              })}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log('签到成功')
            } else {
              console.log('已签到')
            }
          }
          for (let proInfo of t.ext.productsInfo ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              log = await this.getLog()
              res = await this.api(`functionId=doInteractiveAssignment&body=${encodeURIComponent(JSON.stringify({"encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}}))}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res.msg)
              if (res.msg === '任务已完成') {
                break
              }
            }
          }

          for (let proInfo of t.ext.shoppingActivity ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              log = await this.getLog()
              res = await this.api(`functionId=doInteractiveAssignment&body=${encodeURIComponent(JSON.stringify({"encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 1, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}}))}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res.msg)
              await this.wait(t.ext.waitDuration * 1000)
              log = await this.getLog()
              res = await this.api(`functionId=doInteractiveAssignment&body=${encodeURIComponent(JSON.stringify({"encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}}))}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res.msg)
            }
          }

          for (let proInfo of t.ext.browseShop ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              log = await this.getLog()
              res = await this.api(`functionId=doInteractiveAssignment&body=${JSON.stringify({
                "encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 1, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}
              })}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res.msg)
              await this.wait(t.ext.waitDuration * 1000)
              log = await this.getLog()
              res = await this.api(`functionId=doInteractiveAssignment&body=${JSON.stringify({
                "encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}
              })}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res.msg)
            }
          }

          for (let proInfo of t.ext.addCart ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              log = await this.getLog()
              res = await this.api(`functionId=doInteractiveAssignment&body=${encodeURIComponent(JSON.stringify({"encryptProjectId": sign, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": "0", "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFJGh5"}}))}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res.msg)
              if (res.msg === '任务已完成') {
                break
              }
            }
          }
        }
      }
    }

    res = await this.api(`functionId=queryInteractiveRewardInfo&body=${encodeURIComponent(JSON.stringify({"encryptProjectId": rewardSign, "sourceCode": "acexinpin0823", "ext": {"needExchangeRestScore": "1"}}))}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
    let score: number = res.exchangeRestScoreMap["367"]
    console.log('当前碎片', score)

    if (score >= 3) {
      log = await this.getLog()
      res = await this.api(`functionId=doInteractiveAssignment&body=${JSON.stringify({"encryptProjectId": rewardSign, "encryptAssignmentId": "khdCzL9YRdYjh3dWFXfZLteUTYu", "sourceCode": "acexinpin0823", "itemId": "", "actionType": "", "completionFlag": "", "ext": {"exchangeNum": 1}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFDHh5"}})}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
      if (res.subCode === '0') {
        console.log('兑换成功', res.rewardsInfo.successRewards['3'][0].rewardName)
        score -= 3
      } else {
        console.log('兑换失败', res.msg)
      }
    }
    if (score >= 1) {
      log = await this.getLog()
      res = await this.api(`functionId=doInteractiveAssignment&body=${JSON.stringify({"encryptProjectId": rewardSign, "encryptAssignmentId": "2VUEMo9KjtktsQNvb2yHED2m2oCh", "sourceCode": "acexinpin0823", "itemId": "", "actionType": "", "completionFlag": "", "ext": {"exchangeNum": 1}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFDHh5"}})}&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
      if (res.subCode === '0') {
        console.log('兑换成功', res.rewardsInfo.successRewards['3'][0].rewardName)
        score -= 1
      } else {
        console.log('兑换失败', res.msg)
      }
    }
    console.log('当前碎片', score)
  }
}

new Mofang().init().then()
