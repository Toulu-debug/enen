import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {Log} from "./log";

class Mofang extends JDHelloWorld {
  user: User
  mfTool: Log

  constructor() {
    super()
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    await this.wait(1000)
    return await this.post("https://api.m.jd.com/client.action", new URLSearchParams({
      'functionId': fn,
      'body': JSON.stringify(body),
      'client': 'wh5',
      'clientVersion': '1.0.0',
      'appid': 'content_ecology'
    }), {
      'Host': 'api.m.jd.com',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': 'jdapp;',
      'Referer': 'https://h5.m.jd.com/pb/010631430/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html',
      'Cookie': this.user.cookie
    })
  }

  async getLog(): Promise<string> {
    return await this.mfTool.main()
  }

  async main(user: User) {
    this.user = user
    this.mfTool = new Log('50091', 'doInteractiveAssignment', 'XMFhPageh5')
    await this.mfTool.init()

    let log: string = '', res: any
    res = await this.api('getInteractionHomeInfo', {"sign": "u6vtLQ7ztxgykLEr"})
    let taskConfig_projectId: string = res.result.taskConfig.projectId
    let projectPoolId: string = res.result.taskConfig.projectPoolId
    let giftConfig_projectId: string = res.result.giftConfig.projectId

    res = await this.api('queryInteractiveInfo', {"encryptProjectId": taskConfig_projectId, "sourceCode": "acexinpin0823", "ext": {}})
    for (let t of res.assignmentList) {
      if (t.completionCnt < t.assignmentTimesLimit) {
        if (t.assignmentName === '每日签到') {
          if (t.ext.sign1.status === 1) {
            let signDay: number = t.ext.sign1.signList?.length || 0, type: number = t.rewards[signDay].rewardType
            console.log(signDay, type)
            log = await this.getLog()
            res = await this.api('doInteractiveAssignment', {"encryptProjectId": taskConfig_projectId, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": "1", "actionType": "", "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}})
            console.log('签到成功')
          } else {
            console.log('已签到')
          }
        }

        for (let proInfo of t.ext.shoppingActivity || t.ext.browseShop || []) {
          if (proInfo.status === 1) {
            console.log(t.assignmentName)
            log = await this.getLog()
            res = await this.api('doInteractiveAssignment', {"encryptProjectId": taskConfig_projectId, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 1, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}})
            console.log(res.msg)
            await this.wait(t.ext.waitDuration * 1000 || 1000)
            log = await this.getLog()
            res = await this.api('doInteractiveAssignment', {"encryptProjectId": taskConfig_projectId, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}})
            console.log(res.msg)
          }
        }

        for (let proInfo of t.ext.productsInfo || t.ext.addCart || []) {
          if (proInfo.status === 1) {
            console.log(t.assignmentName)
            log = await this.getLog()
            res = await this.api('doInteractiveAssignment', {"encryptProjectId": taskConfig_projectId, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}})
            console.log(res.msg)
            if (res.msg === '任务已完成') {
              break
            }
          }
        }
      }
    }

    res = await this.api('queryInteractiveRewardInfo', {"encryptProjectId": giftConfig_projectId, "sourceCode": "acexinpin0823", "ext": {"needExchangeRestScore": "1"}})
    console.log('当前魔方', res.exchangeRestScoreMap["367"])

    res = await this.api('queryInteractiveRewardInfo', {"encryptProjectPoolId": projectPoolId, "sourceCode": "acexinpin0823", "ext": {"needPoolRewards": 1, "needExchangeRestScore": 1}})
    console.log('碎片进度', res.exchangeRestScoreMap["368"])
    let exchangeRestScoreMap368: number = res.exchangeRestScoreMap["368"]
    for (let i = 1; i < Math.floor(exchangeRestScoreMap368 / 6); i++) {
      log = await this.getLog()
      res = await this.api('doInteractiveAssignment', {"encryptProjectId": giftConfig_projectId, "encryptAssignmentId": "wE62TwscdA52Z4WkpTJq7NaMvfw", "sourceCode": "acexinpin0823", "itemId": "", "actionType": "", "completionFlag": "", "ext": {"exchangeNum": 1}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFhPageh5"}})
      console.log('合成魔方', res.rewardsInfo.successRewards['1'].quantity)
      if (i === 20) break
    }

    res = await this.api('queryInteractiveRewardInfo', {"encryptProjectId": giftConfig_projectId, "sourceCode": "acexinpin0823", "ext": {"needExchangeRestScore": "1"}})
    console.log('当前魔方', res.exchangeRestScoreMap["367"])

    let exchangeRestScoreMap367: number = res.exchangeRestScoreMap["367"], arr: string[] = []
    exchangeRestScoreMap367 >= 1 ? arr.push('2VUEMo9KjtktsQNvb2yHED2m2oCh') : ''
    exchangeRestScoreMap367 >= 4 ? arr.push('khdCzL9YRdYjh3dWFXfZLteUTYu') : ''
    exchangeRestScoreMap367 >= 24 ? arr.push('JkfeMeE5JGmkXiTeJZGzcAWv5cr') : ''

    for (let encryptAssignmentId of arr) {
      log = await this.getLog()
      res = await this.api('doInteractiveAssignment', {"encryptProjectId": giftConfig_projectId, "encryptAssignmentId": encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": "", "actionType": "", "completionFlag": "", "ext": {"exchangeNum": 1}, "extParam": {"businessData": {"random": log.match(/"random":"(\d+)"/)[1]}, "signStr": log.match(/"log":"(.*)"/)[1], "sceneid": "XMFDHh5"}})
      if (res.subCode === '0') {
        console.log('兑换成功', res.rewardsInfo.successRewards['3'][0].rewardName)
      } else {
        console.log('兑换失败', res.msg)
        break
      }
    }
  }
}

new Mofang().init().then()