/**
 * 小程序-赚赚
 * cron: 30 9 * * *
 */

import {JDHelloWorld, User} from "./TS_JDHelloWorld";

class Jdzz extends JDHelloWorld {
  constructor() {
    super();
  }

  async init() {
    await this.run(new Jdzz())
  }

  async main(user: User) {
    let headers: object = {
      'Host': 'api.m.jd.com',
      'wqreferer': 'https://wq.jd.com/wxapp/pages/hd-interaction/task/index',
      'User-Agent': 'MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
      'Referer': 'https://servicewechat.com/wx8830763b00c18ac3/115/page-frame.html',
      'Content-Type': 'application/json',
      'Cookie': user.cookie
    }
    let res: any = await this.get(`https://api.m.jd.com/client.action?functionId=interactTaskIndex&body=%7B%22mpVersion%22%3A%223.4.0%22%7D&appid=wh5&loginWQBiz=interact&g_ty=ls&g_tk=${this.getRandomNumString(9)}`, headers)
    console.log(res.data.cashExpected)

    for (let t of res.data.taskDetailResList) {
      if (t.status === 1) {
        console.log(t.taskName)
        let taskItem: object = {...t, "fullTaskName": `${t.taskName} (0/1)`, "btnText": "去完成"}
        res = await this.get(`https://api.m.jd.com/client.action?functionId=doInteractTask&body=${encodeURIComponent(JSON.stringify({"taskId": t.taskId, "taskItem": taskItem, "actionType": 0, "taskToken": t.taskToken, "mpVersion": "3.4.0"}))}&appid=wh5&loginWQBiz=interact&g_ty=ls&g_tk=${this.getRandomNumString(9)}`, headers)
        console.log(res.message)
        await this.wait(2000)
      }
    }
  }
}

new Jdzz().init().then()
