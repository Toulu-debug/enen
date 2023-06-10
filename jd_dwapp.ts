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

  async getTaskList() {
    return await this.post('https://api.m.jd.com/api?functionId=dwapp_task_dwList', new URLSearchParams({
      'appid': 'h5-sep',
      'functionId': 'dwapp_task_dwList',
      'body': JSON.stringify(this.getEncStr('dwapp_task_dwList', {})),
      'client': 'm',
      'clientVersion': '6.0.0'
    }), {
      'Host': 'api.m.jd.com',
      'Cookie': this.user.cookie,
      'Origin': 'https://prodev.m.jd.com',
      'Referer': 'https://prodev.m.jd.com/mall/active/eEcYM32eezJB7YX4SBihziJCiGV/index.html',
      'user-agent': this.user.UserAgent
    })
  }

  async api(fn: string, body: object) {
    if (['dwList', 'dwRecord', 'dwReceive'].includes(fn))
      fn = `task/${fn}`
    body = this.getEncStr(fn, body)
    await this.wait(2000)
    return await this.post(`https://dwapp.jd.com/user/${fn}`, JSON.stringify(body), {
      'Host': 'dwapp.jd.com',
      'Cookie': this.user.cookie,
      'content-type': 'application/json',
      'origin': 'https://prodev.m.jd.com',
      'user-agent': this.user.UserAgent,
      'referer': 'https://prodev.m.jd.com/'
    })
  }

  async main(user: User) {
    this.user = user
    let res: any
    res = await this.api('dwSignInfo', {})

    if (res.data.signInfo.signStatus === 0) {
      res = await this.api('dwSign', {})
      console.log('签到成功', res.data.signInfo.signNum)
    } else {
      console.log('已签到')
    }

    res = await this.getTaskList()
    for (let t of res.data) {
      if (t.viewStatus === 0) {
        res = await this.api('dwRecord', {id: t.id, "taskType": t.taskType, "agentNum": "m", "followChannelStatus": ""})
        console.log(res.msg)
        res = await this.api('dwReceive', {id: t.id})
        console.log(res?.data?.giveScoreNum)
      }
    }

    res = await this.getTaskList()
    for (let t of res.data) {
      if (t.viewStatus === 2) {
        res = await this.api('dwReceive', {id: t.id})
        console.log(res?.data?.giveScoreNum)
      }
    }
  }
}

new Jd_dwapp().init().then()