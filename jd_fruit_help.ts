/**
 * 种树助力
 * cron: 35 0,6,12,18,23 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st"

class Jd_fruit_help extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []
  h5stTool: H5ST
  fp: string = ''

  constructor() {
    super();
  }

  async init() {
    this.fp = await this.getFp4_1()
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st = this.h5stTool.genH5st('235ec', body, 'mac', '3.8.2', fn, timestamp)
    return await this.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&appid=signed_mp&timestamp=${timestamp}&client=mac&clientVersion=3.8.2&loginType=2&loginWQBiz=ddnc&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'user-agent': this.user.UserAgent,
      'Referer': 'https://servicewechat.com/wx91d27dbf599dff74/725/page-frame.html',
      'Cookie': this.user.cookie,
      'X-Referer-Package': 'wx91d27dbf599dff74',
      'X-Referer-Page': '/pages/farm/pages/index/index',
    })
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF XWEB/30515`
      this.h5stTool = new H5ST('235ec', this.fp, this.user.UserAgent, this.user.UserName, 'https://servicewechat.com/wx91d27dbf599dff74/725/page-frame.html', 'https://servicewechat.com')
      await this.h5stTool.genAlgo()
      let res: any = await this.api('initForFarm', {"PATH": "1", "PTAG": "", "ptag": "", "referer": "http://wq.jd.com/wxapp/pages/index/index", "originUrl": "/pages/farm/pages/index/index", "imageUrl": "", "nickName": "微信用户", "version": 25, "channel": 2, "babelChannel": 0, "lat": "", "lng": ""})
      console.log('助力码', res['farmUserPro'].shareCode)
      this.shareCodeSelf.push(res['farmUserPro'].shareCode)
    } catch (e) {
      console.log('获取失败', e)
    }
  }

  async help(users: User[]) {
    let res: any
    for (let user of users) {
      try {
        this.user = user
        this.user.UserAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF XWEB/30515`
        this.h5stTool = new H5ST('235ec', this.fp, this.user.UserAgent, this.user.UserName, 'https://servicewechat.com/wx91d27dbf599dff74/725/page-frame.html', 'https://servicewechat.com')
        await this.h5stTool.genAlgo()

        let shareCodePool: string[] = await this.getShareCodePool('farm', 50)
        let shareCode: string[] = [...this.shareCodeSelf, ...shareCodePool]

        for (let code of shareCode) {
          try {
            console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code} ${this.shareCodeSelf.includes(code) ? '*内部*' : ''}`)
            res = await this.api('initForFarm', {"ad_od": "share", "mpin": "", "shareCode": code, "utm_campaign": "t_335139774", "utm_medium": "appshare", "utm_source": "androidapp", "utm_term": "Wxfriends", "imageUrl": "", "nickName": "微信用户", "version": 25, "channel": 2, "babelChannel": 0, "lat": "", "lng": ""})
            console.log(res.helpResult.remainTimes, res.helpResult.code)
            if (res.helpResult.remainTimes === 0) {
              console.log('上限')
              break
            }
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