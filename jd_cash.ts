/**
 * 领现金
 * cron: 8 0,9,15 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st_pro";

class Jd_Cash extends JDHelloWorld {
  user: User
  fp: string
  h5stTool: H5ST
  shareCodeSelf: { inviteCode: string, shareDate: string }[] = []

  constructor() {
    super();
  }

  async init() {
    this.fp = process.env.FP_c8815 || await this.getFp()
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st: string = await this.h5stTool.__genH5st({
      appid: 'signed_mp',
      body: JSON.stringify(body),
      client: 'wh5',
      clientVersion: '1.0.0',
      functionId: fn,
      t: timestamp.toString()
    })
    return await this.post('https://api.m.jd.com/',
      `loginType=2&clientType=wxapp&client=wh5&clientVersion=1.0.0&appid=signed_mp&t=${timestamp}&functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&loginWQBiz=pet-town&h5st=${h5st}&_ste=2`, {
        'Host': 'api.m.jd.com',
        'user-agent': this.user.UserAgent,
        'referer': 'https://servicewechat.com/wx91d27dbf599dff74/707/page-frame.html',
        'wqreferer': 'http://wq.jd.com/wxapp/pages/ac/get_cash/pages/index/index',
        'X-Referer-Page': '/pages/ac/get_cash/pages/index/index',
        'Cookie': this.user.cookie
      })
  }

  async main(user: User) {
    try {
      this.user = user
      this.h5stTool = new H5ST("c8815", this.user.UserAgent, this.fp, 'https://servicewechat.com/wx91d27dbf599dff74/707/page-frame.html', 'https://servicewechat.com', this.user.UserName);
      await this.h5stTool.__genAlgo()
      let res: any = await this.api('cash_mob_home', {"version": "1", "channel": "applet"})
      console.log('signedStatus', res.data.result.signedStatus)
      // this.o2s(res)
      console.log('助力码', res.data.result.inviteCode)
      this.shareCodeSelf.push({
        inviteCode: res.data.result.inviteCode,
        shareDate: res.data.result.shareDate
      })
      res = await this.post('https://api.m.jd.com/', `appid=wh5_mp&client=wh5&t=${Date.now()}&clientVersion=1.0.0&functionId=cash_mini_app_detail&body=%7B%22version%22%3A%221%22%2C%22channel%22%3A%22applet%22%2C%22type%22%3A3%7D&loginType=2&loginWQBiz=pet-town`, {
        'Host': 'api.m.jd.com',
        'user-agent': this.user.UserAgent,
        'referer': 'https://servicewechat.com/wx91d27dbf599dff74/710/page-frame.html',
        'wqreferer': 'http://wq.jd.com/wxapp/pages/ac/get_cash/pages/details/index',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': this.user.cookie
      })
      console.log('收到助力', res.data.result.assistDetail[0].assistResult.length)
      if (1) {
        console.log('签到')
        res = await this.api('cash_mob_sign', {"version": "1", "channel": "applet", "remind": 0})
        if (res.data.bizCode === 0) {
          console.log('签到成功', res.data.result.signCash)
        } else {
          this.o2s(res, '签到失败')
        }
      }
    } catch (e) {
      console.log(e.message)
      await this.wait(5000)
    }
  }

  async help(users: User[]) {
    this.o2s(this.shareCodeSelf, '内部助力')
    let res: any
    let temp: any = await this.getshareCodeHW('cash')
    let shareCodeHW: { inviteCode: string, shareDate: string }[] = []
    for (let t of temp)
      shareCodeHW.push({inviteCode: t.inviteCode, shareDate: t.shareDate})
    for (let user of users) {
      try {
        this.user = user
        let shareCode: { inviteCode: string, shareDate: string }[]
        if (user.index === 0)
          shareCode = [...shareCodeHW, ...this.shareCodeSelf]
        else
          shareCode = [...this.shareCodeSelf, ...shareCodeHW]
        this.h5stTool = new H5ST("c8815", this.user.UserAgent, this.fp, 'https://servicewechat.com/wx91d27dbf599dff74/707/page-frame.html', 'https://servicewechat.com', this.user.UserName);
        await this.h5stTool.__genAlgo()
        for (let code of shareCode) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code.inviteCode}`)
          res = await this.api('cash_qr_code_assist', {"version": "1", "channel": "applet", "type": 2, "inviteCode": code.inviteCode, "shareDate": code.shareDate, "lng": "", "lat": ""})
          if (res.data?.bizCode === 0) {
            console.log('助力成功')
          } else {
            this.o2s(res, '助力结果')
          }
          await this.wait(3000)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}

new Jd_Cash().init().then()