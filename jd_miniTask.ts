/**
 * 微信小程序-领红包
 * cron: 15 0,2,8 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st"

class Jd_Hbrain extends JDHelloWorld {
  user: User
  fp: string
  h5stTool: H5ST

  constructor() {
    super()
  }

  async init() {
    this.fp = await this.getFp4_1()
    await this.run(this)
  }

  async api(fn: string, body: object): Promise<any> {
    let ts: number = Date.now()
    let h5st: string = this.h5stTool.genH5st('hot_channel', body, 'android', '8.21.260', fn, ts)
    return await this.post(`https://api.m.jd.com/${fn}`,
      `loginType=2&client=android&clientVersion=8.21.260&functionId=${fn}&t=${ts}&body=${encodeURIComponent(JSON.stringify(body))}&appid=hot_channel&d_name=&h5st=${h5st}&_ste=2`,
      {
        'Host': 'api.m.jd.com',
        'User-Agent': this.user.UserAgent,
        'Cookie': this.user.cookie,
        'X-Referer-Package': 'wx91d27dbf599dff74',
        'wqreferer': 'http://wq.jd.com/wxapp/pages/yixiaoshida/index/index',
        'X-Rp-Client': 'mini_2.0.0',
        'X-Referer-Page': '/pages/yixiaoshida/index/index',
        'referer': 'https://servicewechat.com/wx91d27dbf599dff74/728/page-frame.html'
      })
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF XWEB/30817`
      this.h5stTool = new H5ST('60d61', this.fp, this.user.UserAgent, this.user.UserName, 'https://servicewechat.com/wx91d27dbf599dff74/728/page-frame.html', 'https://servicewechat.com')
      await this.h5stTool.genAlgo()

      let data: any, res: any
      res = await this.api('MiniTask_ChannelPage', {"source": "task"})
      this.o2s(res)
      let shareCode: string[] = await this.getshareCodeHW('miniTask')
      for (let t of res.data.signInfo.signTaskList) {
        if (t.currentDay && t.signStatus === 0) {
          if (this.user.index === 0) {
            data = await this.api('miniTask_assistCheck', {"itemId": shareCode[0]})
          } else {
            data = await this.api('miniTask_doSign', {"itemId": "1"})
          }
          if (res.subCode === 0) {
            console.log('签到成功', res.data.toastMsg, '连续签到:', res.data.signDays)
          } else {
            console.log(res.message)
          }
        }
      }

      for (let t of res.data.scanTaskList) {
        if (t.status === 0) {
          console.log(t.title)
          data = await this.api('MiniTask_ScanTask', {"actionType": 1, "scanAssignmentId": t.scanAssignmentId, "itemId": t.itemId})
          if (data.subCode === 0) {
            console.log('开始任务')
            await this.wait((t.times + 1) * 1000)
            data = await this.api('MiniTask_ScanTask', {"actionType": 0, "scanAssignmentId": t.scanAssignmentId, "itemId": t.itemId})
            if (data.subCode === 0) {
              console.log('任务完成')
              await this.wait(1000)
              data = await this.api('MiniTask_ScanReward', {"scanAssignmentId": t.scanAssignmentId})
              console.log(data)
              console.log('领取奖励', data.data[0].discount)
            }
          }
        }
      }

    } catch (e) {
      console.log(e.message)
      await this.wait(5000)
    }
  }
}

new Jd_Hbrain().init().then()