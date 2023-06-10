/**
 * 种树助力
 * cron: 35 0,6,12,18,23 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {getH5ST} from "./utils/h5st";

class Jd_fruit_help extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []
  appid: string = '235ec'
  fp: string = 'gng5gi963mznng63'

  constructor() {
    super();
  }

  async init() {
    if (!this.fp) {
      process.exit()
    }
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st = await getH5ST(fn, body, this.appid, this.fp, this.user.UserAgent)
    return await this.get(`https://api.m.jd.com/client.action?functionId=initForFarm&body=${encodeURIComponent(JSON.stringify(body))}&appid=signed_mp&timestamp=${timestamp}&client=mac&clientVersion=3.8.0&loginType=2&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'user-agent': this.user.UserAgent,
      'referer': 'https://servicewechat.com/wx91d27dbf599dff74/712/page-frame.html',
      'Content-Type': 'application/json',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF XWEB/30515`
      let res: any
      res = await this.api('initForFarm', {"PATH": "1", "PTAG": "", "ptag": "", "navStart": new Date().toISOString(), "referer": "http://wq.jd.com/wxapp/pages/index/index", "originUrl": "/pages/farm/pages/index/index", "originParams": {"ptag": ""}, "originOpts": {}, "imageUrl": "", "nickName": "", "version": 22, "channel": 2, "babelChannel": 0, "lat": "", "lng": ""})
      if (res?.farmUserPro?.shareCode) {
        console.log('助力码', res.farmUserPro.shareCode)
        this.shareCodeSelf.push(res.farmUserPro.shareCode)
      } else {
        console.log('获取助力码失败')
      }
    } catch (e) {
      console.log('error', e.message)
    }
    await this.wait(15000)
  }

  async help(users: User[]) {
    let res: any
    for (let user of users) {
      try {
        this.user = user
        // this.user.UserAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF XWEB/30515`
        let shareCodePool: string[] = await this.getShareCodePool('farm', 50)
        let shareCode: string[] = [...this.shareCodeSelf, ...shareCodePool]

        for (let code of shareCode) {
          try {
            console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code} ${this.shareCodeSelf.includes(code) ? '*内部*' : ''}`)
            // res = await this.api('initForFarm', {"ad_od": "share", "mpin": "", "shareCode": code, "utm_campaign": "t_335139774", "utm_medium": "appshare", "utm_source": "androidapp", "utm_term": "Wxfriends", "imageUrl": "", "nickName": "", "version": 22, "channel": 2, "babelChannel": 0, "lat": "", "lng": ""})
            res = await this.get(`https://api.m.jd.com/client.action?functionId=initForFarm&body=${encodeURIComponent(JSON.stringify({
              imageUrl: "",
              nickName: "",
              shareCode: code,
              babelChannel: "3",
              version: 2,
              channel: 1
            }))}&appid=wh5`, {
              "Host": "api.m.jd.com",
              "Accept": "*/*",
              "Origin": "https://carry.m.jd.com",
              "Accept-Encoding": "gzip, deflate, br",
              "User-Agent": this.user.UserAgent,
              "Accept-Language": "zh-CN,zh-Hans;q=0.9",
              "Referer": "https://carry.m.jd.com/",
              "Cookie": this.user.cookie
            })
            this.o2s(res)
            if (res?.helpResult?.remainTimes === 0)
              break
          } catch (e) {
            console.log(e.message)
          }
          await this.wait(30000)
        }
      } catch (e) {
        console.log(e)
      }
      await this.wait(60000)
    }
  }
}

new Jd_fruit_help().init().then()