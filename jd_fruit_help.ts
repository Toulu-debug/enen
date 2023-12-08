/**
 * 种树助力
 * cron: 35 0,6,12,18,23 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST_42} from './utils/h5st_4.2'

class Jd_fruit_help extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []
  h5stTool: H5ST_42
  fp: string

  constructor() {
    super();
  }

  async init() {
    this.fp = await this.getFp4_1()
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st = this.h5stTool.h5st({
      appid: 'signed_wh5',
      body: body,
      client: 'iOS',
      clientVersion: '12.2.5',
      functionId: fn,
      t: timestamp
    })
    return await this.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&appid=signed_wh5&timestamp=${timestamp}&client=iOS&clientVersion=12.2.5&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'Origin': 'https://carry.m.jd.com',
      'x-referer-page': 'https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://carry.m.jd.com/',
      'x-rp-client': 'h5_1.0.0',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `jdapp;iPhone;12.2.5;;;M/5.0;appBuild/168943;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
      this.h5stTool = new H5ST_42('8a2af', this.user.UserAgent, this.user.UserName, 'https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html', 'https://carry.m.jd.com')
      await this.h5stTool.algo()

      let res: any = await this.api('initForFarm', {"babelChannel": "522", "sid": "", "un_area": "", "version": 26, "channel": 1, "lat": "0", "lng": "0"})
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
        this.user.UserAgent = `jdapp;iPhone;12.2.5;;;M/5.0;appBuild/168943;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
        this.h5stTool = new H5ST_42('8a2af', this.user.UserAgent, this.user.UserName, 'https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html', 'https://carry.m.jd.com')
        await this.h5stTool.algo()
        let shareCodePool: string[] = await this.getShareCodePool('farm', 50)
        let shareCode: string[] = Array.from(new Set([...this.shareCodeSelf, ...shareCodePool]))
        for (let code of shareCode) {
          try {
            console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code} ${this.shareCodeSelf.includes(code) ? '*内部*' : ''}`)
            let res: any = await this.api('initForFarm', {"babelChannel": "522", "shareCode": code, "mpin": "", "from": "kouling", "sid": "", "un_area": "", "version": 26, "channel": 1, "lat": "0", "lng": "0"})
            console.log('剩余助力', res.helpResult.remainTimes, '助力结果', res.helpResult.code)
            if (res.helpResult.remainTimes === 0) {
              console.log('上限')
              break
            }
          } catch (e) {
            console.log(e.message)
          }
          await this.wait(3000)
        }
      } catch (e) {
        console.log(e)
      }
      await this.wait(15000)
    }
  }
}

new Jd_fruit_help().init().then()