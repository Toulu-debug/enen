/**
 * 微信小程序签到红包
 * FP_9A38A
 * cron: 8 10 * * *
 */

import {H5ST} from "./utils/h5st_pro"
import {User, JDHelloWorld} from "./TS_JDHelloWorld";

class Jd_wechat_sign extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  fp: string

  constructor() {
    super("微信签到");
  }

  async init() {
    try {
      this.fp = process.env.FP_9A38A ?? await this.getFp()
    } catch (e) {
      console.log('FP Error: ', e.message)
      process.exit(0)
    }
    await this.run(this)
  }

  async task(fn: string, body: object, signComponent: string) {
    let h5st: string = await this.h5stTool.__genH5st({
      appid: "hot_channel",
      body: JSON.stringify(body),
      client: "android",
      clientVersion: "7.22.240",
      functionId: signComponent,
    })
    return await this.post(`https://api.m.jd.com/scanTask/${fn}`, `client=android&clientVersion=7.22.240&functionId=${signComponent}&appid=hot_channel&body=${encodeURIComponent(JSON.stringify(body))}&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'wqreferer': 'http://wq.jd.com/wxapp/pages/market/market2/index',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://servicewechat.com/wx91d27dbf599dff74/664/page-frame.html',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.28(0x18001c2b) NetType/WIFI Language/zh_CN`
      let res: any, data: any

      this.h5stTool = new H5ST("9a38a", this.user.UserAgent, this.fp, 'http://wq.jd.com/wxapp/pages/market/market2/index', 'http://wq.jd.com', this.user.UserName);
      await this.h5stTool.__genAlgo()
      res = await this.task('doSignTask', {"activityId": "10004", "version": 1}, 'SignComponent_doSignTask')
      res.success ? console.log('签到奖励', res.data.rewardList[0].discount) : console.log(res.message)

      this.h5stTool = new H5ST("2b5bc", this.user.UserAgent, this.fp, 'http://wq.jd.com/wxapp/pages/market/market2/index', 'http://wq.jd.com', this.user.UserName);
      await this.h5stTool.__genAlgo()
      res = await this.task('querySignList', {"activityId": "10004", "version": 1}, 'SignComponent_querySignList')
      if (!res.data.scanTaskInfo.completionFlag) {
        data = await this.task('startScanTask', {"itemId": res.data.scanTaskInfo.itemId, "activityId": "10004", "scanAssignmentId": res.data.scanTaskInfo.scanAssignmentId, "actionType": 1, "version": 1}, 'SignComponent_doScanTask')
        console.log('开始任务', data.message || res.success)
        await this.wait(8000)
        data = await this.task('startScanTask', {"activityId": "10004", "actionType": 0, "scanAssignmentId": res.data.scanTaskInfo.scanAssignmentId, "itemId": res.data.scanTaskInfo.itemId, "version": 1}, 'SignComponent_doScanTask')
        console.log('领取奖励', data.data.rewardList[0].discount)
      }
    } catch (e) {
      console.log(e.message)
    }
  }
}

new Jd_wechat_sign().init().then()