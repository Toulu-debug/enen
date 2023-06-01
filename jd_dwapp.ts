/**
 * 京东-生活积分
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"

class Jd_dwapp extends JDHelloWorld {
  cookie: string

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object = {}) {
    if (['dwList', 'dwRecord', 'dwReceive'].includes(fn))
      fn = `task/${fn}`
    body = this.getEncStr(fn, body)
    await this.wait(2000)
    return await this.post(`https://dwapp.jd.com/user/${fn}`, JSON.stringify(body), {
      'Host': 'dwapp.jd.com',
      'Cookie': this.cookie,
      'content-type': 'application/json',
      'origin': 'https://prodev.m.jd.com',
      'user-agent': 'jdapp;',
      'referer': 'https://prodev.m.jd.com/'
    })
  }

  async main(user: User) {
    this.cookie = user.cookie
    let res: any
    res = await this.api('dwSignInfo')

    if (res.data.signInfo.signStatus === 0) {
      res = await this.api('dwSign')
      console.log('签到成功', res.data.signInfo.signNum)
    } else {
      console.log('已签到')
    }

    res = await this.api('dwList')
    for (let t of res.data) {
      if (t.viewStatus === 0) {
        res = await this.api('dwRecord', {id: t.id, "taskType": t.taskType, "agentNum": "m", "followChannelStatus": "",})
        console.log(res.msg)
        res = await this.api('dwReceive', {id: t.id})
        console.log(res?.data?.giveScoreNum)
      }
    }

    res = await this.api('dwList')
    for (let t of res.data) {
      if (t.viewStatus === 2) {
        res = await this.api('dwReceive', {id: t.id})
        console.log(res?.data?.giveScoreNum)
      }
    }
  }
}

new Jd_dwapp().init().then()