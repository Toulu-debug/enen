/**
 * 种树助力
 * cron: 35 0,6,12,18,23 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import CryptoJS from "crypto-js"

class Jd_fruit_help extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []
  h5stTool: { sign: Function }

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st: string = (await this.h5stTool.sign({
      appid: 'signed_wh5',
      body: CryptoJS.SHA256(JSON.stringify(body)).toString(CryptoJS.enc.Hex),
      client: 'iOS',
      clientVersion: '12.3.2',
      functionId: fn,
      t: timestamp
    })).h5st
    return await this.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&appid=signed_wh5&timestamp=${timestamp}&client=iOS&clientVersion=12.3.2&h5st=${h5st}`, {
      'authority': 'api.m.jd.com',
      'cookie': this.user.cookie,
      'origin': 'https://carry.m.jd.com',
      'referer': 'https://carry.m.jd.com/',
      'user-agent': this.user.UserAgent,
      'x-referer-page': 'https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html',
      'x-rp-client': 'h5_1.0.0'
    })
  }

  async main(user: User) {
    try {
      this.user = user
      this.h5stTool = this.h5st('42', '8a2af', this.user.UserAgent)
      let res: any = await this.api('initForFarm', {"babelChannel": "522", "version": 26, "channel": 1, "lat": "0", "lng": "0"})
      console.log('助力码', res['farmUserPro'].shareCode)
      this.shareCodeSelf.push(res['farmUserPro'].shareCode)
    } catch (e) {
      console.log('获取失败', e)
    }
    await this.wait(5000)
  }

  async help(users: User[]) {
    let res: any
    for (let user of users) {
      try {
        this.user = user
        this.h5stTool = this.h5st('42', '8a2af', this.user.UserAgent)
        let shareCodePool: string[] = await this.getShareCodePool('farm', 50)
        let shareCode: string[] = Array.from(new Set([...this.shareCodeSelf, ...shareCodePool]))
        for (let code of shareCode) {
          try {
            console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code}`)
            res = await this.api('initForFarm', {"babelChannel": "522", "shareCode": code, "mpin": "", "from": "kouling", "version": 26, "channel": 1, "lat": "0", "lng": "0"})
            console.log('剩余助力', res.helpResult.remainTimes, '助力结果', res.helpResult.code)
            if (res.helpResult.remainTimes === 0) {
              console.log('上限')
              break
            }
          } catch (e) {
            console.log(e.message)
          }
          await this.wait(5000)
        }
      } catch (e) {
        console.log(e)
      }
      await this.wait(15000)
    }
  }
}

new Jd_fruit_help().init().then()