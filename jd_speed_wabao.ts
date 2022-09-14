/**
 * 极速版-挖宝
 * cron: 2 0,1,6 * * *
 * export FP_8DD95=""
 * CK1 优先助力 HW.ts
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st_pro";

interface INVITE {
  inviter: string,
  inviteCode: string
}

class Jd_speed_wabao extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  sharecode: INVITE[] = []
  shareCodesSelf: INVITE[] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st: string = await this.h5stTool.__genH5st({
      appid: 'activities_platform',
      body: JSON.stringify(body),
      client: 'ios',
      clientVersion: '3.9.2',
      functionId: fn,
      t: timestamp.toString(),
    })
    return await this.get(`https://api.m.jd.com/?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&t=${timestamp}&appid=activities_platform&client=ios&clientVersion=3.9.2&h5st=${h5st}`, {
      'authority': 'api.m.jd.com',
      'origin': 'https://bnzf.jd.com',
      'referer': 'https://bnzf.jd.com/',
      'user-agent': this.user.UserAgent,
      'cookie': this.user.cookie
    })
  }

  async main(user: User) {
    let fp: any = process.env.FP_8DD95 || await this.getFp()
    this.user = user
    this.user.UserAgent = `jdltapp;iPhone;3.9.2;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
    this.h5stTool = new H5ST("8dd95", this.user.UserAgent, fp, 'https://bnzf.jd.com/?activityId=pTTvJeSTrpthgk9ASBVGsw', 'https://bnzf.jd.com', this.user.UserName)
    await this.h5stTool.__genAlgo()

    let res: any, data: any
    try {
      res = await this.api('happyDigHome', {"linkId": "pTTvJeSTrpthgk9ASBVGsw"})
      console.log('助力码', res.data.markedPin, res.data.inviteCode)
      this.shareCodesSelf.push({inviter: res.data.markedPin, inviteCode: res.data.inviteCode})

      res = await this.api('apTaskList', {"linkId": "pTTvJeSTrpthgk9ASBVGsw"})
      await this.wait(1000)
      for (let t of res.data) {
        if (t.taskType === 'BROWSE_CHANNEL' && t.taskDoTimes === 0 && t.taskLimitTimes === 1) {
          console.log(t.taskShowTitle)
          data = await this.api('apDoTask', {"linkId": "pTTvJeSTrpthgk9ASBVGsw", "taskType": "BROWSE_CHANNEL", "taskId": t.id, "channel": 4, "itemId": encodeURIComponent(t.taskSourceUrl), "checkVersion": false})
          await this.wait(1000)
          if (data.success) {
            console.log('任务完成')
          } else {
            this.o2s(data, '任务失败')
          }
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  }

  async help(users: User[]) {
    console.log('内部助力')
    this.o2s(this.shareCodesSelf)
    let res: any, shareCodesHW: any = [], shareCodes: any
    for (let user of users) {
      this.user = user
      this.user.UserAgent = `jdltapp;iPhone;3.9.2;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
      console.log(`\n开始【京东账号${user.index + 1}】${user.UserName}\n`)

      try {
        if (shareCodesHW.length === 0) {
          shareCodesHW = await this.getshareCodeHW('fcwb')
        }
        if (user.index === 0) {
          shareCodes = [...shareCodesHW, ...this.shareCodesSelf]
        } else {
          shareCodes = [...this.shareCodesSelf, ...shareCodesHW]
        }
        let fp: any = process.env.FP_8DD95 || await this.getFp()
        for (let code of shareCodes) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code.inviteCode}`)
          this.h5stTool = new H5ST("8dd95", this.user.UserAgent, fp, `https://bnzf.jd.com/?activityId=pTTvJeSTrpthgk9ASBVGsw&inviterId=${code.inviter}&inviterCode=${code.inviteCode}&utm_source=iosapp&utm_medium=liteshare&utm_campaign=&utm_term=Qqfriends&ad_od=share`, 'https://bnzf.jd.com', user.UserName)
          await this.h5stTool.__genAlgo()
          res = await this.api('happyDigHelp', {"linkId": "pTTvJeSTrpthgk9ASBVGsw", "inviter": code.inviter, "inviteCode": code.inviteCode})
          if (res.code === 0) {
            console.log('助力成功')
            await this.wait(4000)
            break
          } else if (res.code === 16144) {
            console.log('上限')
            await this.wait(4000)
            break
          } else {
            console.log(res.code, res.errMsg)
            await this.wait(4000)
          }
        }
      } catch (e) {
        console.log('error', e)
      }
    }
  }
}

new Jd_speed_wabao().init().then()