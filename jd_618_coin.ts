/**
 * 京东骑驴-收金币
 * cron: 15 0-23/2 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld";
import {Log_618} from "./utils/log_618";

class Jd_618 extends JDHelloWorld {
  user: User
  logTool: Log_618 = new Log_618()
  shareCodeSelf: string[] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async getLog(): Promise<{ random: string, log: string }> {
    let data = await this.logTool.main()
    await this.wait(4000)
    return data
  }

  async api(fn: string, body: object) {
    let appid: string = fn.includes('promote_') ? 'signed_wh5' : 'wh5'
    return this.post(`https://api.m.jd.com/client.action?functionId=${fn}`, `functionId=${fn}&client=m&clientVersion=1.0.0&appid=${appid}&body=${JSON.stringify(body)}`, {
      'Host': 'api.m.jd.com',
      'Origin': 'https://wbbny.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://wbbny.m.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    this.user = user
    let res: any, log: { random: string, log: string }
    res = await this.api('promote_getHomeData', {})
    let secretp: string = res.data.result.homeMainInfo.secretp
    let totalScore: number = parseInt(res.data.result.homeMainInfo.raiseInfo.totalScore)
    console.log('当前金币', totalScore)

    log = await this.getLog()
    res = await this.api('promote_collectAutoScore', {ss: JSON.stringify({extraData: {log: encodeURIComponent(log.log), sceneid: 'RAhomePageh5'}, secretp: secretp, random: log.random})})
    console.log('收金币', parseInt(res.data.result.produceScore))
  }
}

new Jd_618().init().then()