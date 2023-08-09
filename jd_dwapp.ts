/**
 * 京东-生活积分
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"

class Jd_dwapp extends JDHelloWorld {
  user: User

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    return await this.post(`https://api.m.jd.com/api?functionId=${fn}`, new URLSearchParams({
      'appid': 'h5-sep',
      'functionId': fn,
      'body': JSON.stringify(this.getEncStr(fn, body)),
      'client': 'm',
      'clientVersion': '6.0.0'
    }), {
      'Host': 'api.m.jd.com',
      'Origin': 'https://prodev.m.jd.com',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://prodev.m.jd.com/mall/active/eEcYM32eezJB7YX4SBihziJCiGV/index.html',
      'Cookie': this.user.cookie
    })
  }

  async task(fn: string, body: object) {
    let url: string = fn === 'dwSignInfo' ? fn : `task/${fn}`
    return await this.post(`https://dwapp.jd.com/user/${url}`, this.getEncStr(fn, body), {
      'Host': 'dwapp.jd.com',
      'Origin': 'https://prodev.m.jd.com',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://prodev.m.jd.com/mall/active/eEcYM32eezJB7YX4SBihziJCiGV/index.html',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    this.user = user
    let res: any
    res = await this.task('dwSignInfo', {})
    if (res.data.signInfo.signStatus !== 1) {
      res = await this.api('DATAWALLET_USER_SIGN', {})
      console.log('签到成功', res.data.signInfo.signNum)
    } else {
      console.log('已签到')
    }

    res = await this.api('dwapp_task_dwList', {})
    for (let t of res.data) {
      if (t.viewStatus === 0) {
        console.log(t.name)
        res = await this.task('dwRecord', {id: t.id, "taskType": t.taskType, "agentNum": "m", "followChannelStatus": ""})
        console.log(res.msg)
        await this.wait(4000)
        res = await this.task('dwReceive', {id: t.id})
        console.log(res?.data?.giveScoreNum)
      }
      await this.wait(6000)
    }
    await this.wait(120000)
  }
}

new Jd_dwapp().init().then()