/**
 * 京东-新品-魔方
 * cron: 10 9,12,15 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"

class Mofang extends JDHelloWorld {
  user: User

  constructor() {
    super()
  }

  async init() {
    await this.run(new Mofang())
  }

  async api(params: string) {
    await this.wait(1000)
    return await this.post("https://api.m.jd.com/client.action", params, {
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": this.user.UserAgent,
      'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html',
      'Origin': 'https://h5.m.jd.com',
      'Host': 'api.m.jd.com',
      'Cookie': this.user.cookie
    })
  }

  async getLog(): Promise<string> {
    let data = await this.get(`http://127.0.0.1:10007?fn=doInteractiveAssignment&uid=${encodeURIComponent(this.user.UserName)}`)
    if (data !== 1 && data !== '1') {
      return data.toString()
    } else {
      console.log('No log')
      process.exit(0)
    }
  }

  async main(user: User) {
    this.user = user
    let log: string = ''
    let res: any = await this.api("functionId=getInteractionHomeInfo&body=%7B%22sign%22%3A%22u6vtLQ7ztxgykLEr%22%7D&appid=content_ecology&client=wh5&clientVersion=1.0.0")
    let sign: string = res.result.taskConfig.projectId

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
  }
}

new Mofang().init().then()
