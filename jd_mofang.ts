import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {logs} from "./test/2000jinli_log";
import {getRandomNumberByRange} from "./TS_USER_AGENTS";

class Mofang extends JDHelloWorld {
  user: User
  random: string
  log: string

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
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://h5.m.jd.com/pb/010631430/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html',
      'Cookie': this.user.cookie
    })
  }

  async api2(body: string) {
    await this.wait(1000)
    return await this.post('https://api.m.jd.com/client.action?functionId=doInteractiveAssignment', body, {
      'Host': 'api.m.jd.com',
      'Cookie': this.user.cookie,
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'JD4iPhone'
    })
  }

  getLog() {
    let n: number = getRandomNumberByRange(0, logs.length)
    this.log = logs[n].match(/"log":"(.*)"/)[1]
    this.random = logs[n].match(/"random":"(\d+)"/)[1]
  }

  async main(user: User) {
    if (!user.cookie.includes('app_open')) {
      return
    }
    this.user = user
    let res: any
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
            this.getLog()
            res = await this.api('doInteractiveAssignment', {"encryptProjectId": taskConfig_projectId, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": "1", "actionType": "", "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": this.random}, "signStr": this.log, "sceneid": "XMFhPageh5"}})
            console.log('签到成功')
          } else {
            console.log('已签到')
          }
        }

        for (let proInfo of t.ext.shoppingActivity || t.ext.browseShop || []) {
          if (proInfo.status === 1) {
            console.log(t.assignmentName)
            this.getLog()
            res = await this.api('doInteractiveAssignment', {"encryptProjectId": taskConfig_projectId, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 1, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": this.random}, "signStr": this.log, "sceneid": "XMFhPageh5"}})
            console.log(res.msg)
            await this.wait(t.ext.waitDuration * 1000 || 1000)
            this.getLog()
            res = await this.api('doInteractiveAssignment', {"encryptProjectId": taskConfig_projectId, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": this.random}, "signStr": this.log, "sceneid": "XMFhPageh5"}})
            console.log(res.msg)
          }
        }

        for (let proInfo of t.ext.productsInfo || t.ext.addCart || []) {
          if (proInfo.status === 1) {
            console.log(t.assignmentName)
            this.getLog()
            res = await this.api('doInteractiveAssignment', {"encryptProjectId": taskConfig_projectId, "encryptAssignmentId": t.encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": proInfo.itemId, "actionType": 0, "completionFlag": "", "ext": {}, "extParam": {"businessData": {"random": this.random}, "signStr": this.log, "sceneid": "XMFhPageh5"}})
            console.log(res.msg)
            if (res.msg === '任务已完成') {
              break
            }
          }
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      res = await this.getSign('doInteractiveAssignment', {"encryptProjectId": taskConfig_projectId, "completionFlag": true, "encryptAssignmentId": "44M5m7wZs5vDAMkaTmYXeppqTsZR", "sourceCode": "acexinpin0823"})
      res = await this.api2(res)
      this.o2s(res)
    }

    res = await this.api('queryInteractiveRewardInfo', {"encryptProjectId": giftConfig_projectId, "sourceCode": "acexinpin0823", "ext": {"needExchangeRestScore": "1"}})
    console.log('当前魔方', res.exchangeRestScoreMap["367"])

    res = await this.api('queryInteractiveRewardInfo', {"encryptProjectPoolId": projectPoolId, "sourceCode": "acexinpin0823", "ext": {"needPoolRewards": 1, "needExchangeRestScore": 1}})
    console.log('碎片进度', res.exchangeRestScoreMap["368"])
    let exchangeRestScoreMap368: number = res.exchangeRestScoreMap["368"]
    for (let i = 1; i < Math.floor(exchangeRestScoreMap368 / 6); i++) {
      this.getLog()
      res = await this.api('doInteractiveAssignment', {"encryptProjectId": giftConfig_projectId, "encryptAssignmentId": "wE62TwscdA52Z4WkpTJq7NaMvfw", "sourceCode": "acexinpin0823", "itemId": "", "actionType": "", "completionFlag": "", "ext": {"exchangeNum": 1}, "extParam": {"businessData": {"random": this.random}, "signStr": this.log, "sceneid": "XMFhPageh5"}})
      console.log('合成魔方', res.rewardsInfo.successRewards['1'].quantity)
      if (i === 20) break
    }

    res = await this.api('queryInteractiveRewardInfo', {"encryptProjectId": giftConfig_projectId, "sourceCode": "acexinpin0823", "ext": {"needExchangeRestScore": "1"}})
    console.log('当前魔方', res.exchangeRestScoreMap["367"])

    let exchangeRestScoreMap367: number = res.exchangeRestScoreMap["367"], arr: string[] = []
    exchangeRestScoreMap367 >= 1 ? arr.push('2VUEMo9KjtktsQNvb2yHED2m2oCh') : ''
    exchangeRestScoreMap367 >= 4 ? arr.push('khdCzL9YRdYjh3dWFXfZLteUTYu') : ''
    exchangeRestScoreMap367 >= 24 ? arr.push('JkfeMeE5JGmkXiTeJZGzcAWv5cr') : ''

    // for (let encryptAssignmentId of arr) {
    //    this.getLog()
    //   res = await this.api('doInteractiveAssignment', {"encryptProjectId": giftConfig_projectId, "encryptAssignmentId": encryptAssignmentId, "sourceCode": "acexinpin0823", "itemId": "", "actionType": "", "completionFlag": "", "ext": {"exchangeNum": 1}, "extParam": {"businessData": {"random": this.random}, "signStr": this.log, "sceneid": "XMFDHh5"}})
    //   if (res.subCode === '0') {
    //     console.log('兑换成功', res.rewardsInfo.successRewards['3'][0].rewardName)
    //   } else {
    //     console.log('兑换失败', res.msg)
    //     break
    //   }
    // }
  }
}

new Mofang().init().then()