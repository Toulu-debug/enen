/**
 * 微信小程序签到红包
 * FP_9A38A
 * cron: 8 0 * * *
 */

import {H5ST} from "./utils/h5st_3.1"
import {User, JDHelloWorld} from "./TS_JDHelloWorld";

class Jd_wechat_sign extends JDHelloWorld {
  user: User
  h5stTool: H5ST

  constructor() {
    super("微信签到");
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let h5st: string = await this.h5stTool.__genH5st({
      'appid': 'hot_channel',
      'body': JSON.stringify(body),
      'client': 'apple',
      'clientVersion': '7.21.190',
      'functionId': `SignComponent_${fn}`,
    })

    let temp: string = fn !== 'startScanTask' ? 'signTask' : 'scanTask'
    let fnId: string = fn !== 'startScanTask' ? fn : 'doScanTask'
    return this.post(`https://api.m.jd.com/${temp}/${fn}`, `client=apple&clientVersion=7.21.190&functionId=SignComponent_${fnId}&appid=hot_channel&loginType=2&body=${encodeURIComponent(JSON.stringify(body))}&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'wqreferer': 'http://wq.jd.com/wxapp/pages/market/market2/index',
      'referer': 'https://servicewechat.com/wx91d27dbf599dff74/656/page-frame.html',
      'cookie': this.user.cookie,
      'user-agent': this.user.UserAgent
    })
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.28(0x18001c2b) NetType/WIFI Language/zh_CN`
      let res: any

      this.h5stTool = new H5ST("9a38a", this.user.UserAgent, process.env.FP_9A38A, 'http://wq.jd.com/wxapp/pages/market/market2/index', 'http://wq.jd.com', this.user.UserName);
      await this.h5stTool.__genAlgo()

      res = await this.api('querySignStatus', {"activityId": "10004", "activeId": "", "groupId": "", "version": 1})
      this.o2s(res, 'querySignStatus')

      res = await this.api('doSignTask', {"activityId": "10004", "version": 1})
      this.o2s(res, 'doSignTask')

      res = await this.api('querySignList', {"activityId": "10004", "version": 1})
      this.o2s(res, 'querySignList')

      if (!res.data.scanTaskInfo.completionFlag) {
        res = await this.api('startScanTask', {"itemId": res.data.scanTaskInfo.itemId, "activityId": "10004", "scanAssignmentId": res.data.scanTaskInfo.scanAssignmentId, "actionType": 1, "version": 1})
        this.o2s(res, 'startScanTask 1')
        await this.wait(10000)

        res = await this.api('startScanTask', {"itemId": res.data.scanTaskInfo.itemId, "activityId": "10004", "scanAssignmentId": res.data.scanTaskInfo.scanAssignmentId, "actionType": 0, "version": 1})
        this.o2s(res, 'startScanTask 0')
      }

    } catch (e) {
      console.log(e.message)
    }
  }
}

new Jd_wechat_sign().init().then()