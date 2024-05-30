/**
 * 种树助力
 * cron: 35 0,6,12,18,23 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {JSDOM, ResourceLoader, VirtualConsole} from "jsdom";
import {readFileSync} from "fs";
import CryptoJS from "crypto-js";

class Jd_fruit_help extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []
  appId: string
  htstTool: any

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async h5stToolInit() {
    let dom = new JSDOM(`<body><script>${readFileSync('utils/h5st_42.js').toString()}</script></body>`, {
      url: "http://localhost",
      userAgent: this.user.UserAgent,
      runScripts: "dangerously",
      resources: new ResourceLoader({
        userAgent: this.user.UserAgent
      }),
      includeNodeLocations: true,
      storageQuota: 1000000000,
      pretendToBeVisual: true,
      virtualConsole: new VirtualConsole()
    })
    this.htstTool = new dom.window.ParamsSign({appId: this.appId})
  }

  async api(fn: string, body: object) {
    let t = Date.now(), h5st: string = (await this.htstTool.sign({
      appid: 'signed_wh5',
      body: CryptoJS.SHA256(JSON.stringify(body)).toString(CryptoJS.enc.Hex),
      client: 'iOS',
      clientVersion: '13.0.2',
      functionId: fn,
      timestamp: t.toString()
    })).h5st
    return await this.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&appid=signed_wh5&area=0_0_0_0&timestamp=${t}&client=iOS&clientVersion=13.0.2&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'Origin': 'https://carry.m.jd.com',
      'User-Agent': this.user.UserAgent,
      'Cookie': this.user.cookie,
      'Referer': 'https://carry.m.jd.com/',
      'x-referer-page': 'https://carry.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html',
    })
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `jdapp;iPhone;13.0.2;;;M/5.0;appBuild/169363;jdSupportDarkMode/0;ef/1;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
      this.appId = '8a2af'
      await this.h5stToolInit()
      let res: any = await this.api('initForFarm', {"babelChannel": "522", "shareCode": "", "mpin": "", "from": "", "version": 26, "channel": 1, "lat": "0", "lng": "0"})
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
        this.user.UserAgent = `jdapp;iPhone;13.0.2;;;M/5.0;appBuild/169363;jdSupportDarkMode/0;ef/1;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
        this.appId = '8a2af'
        await this.h5stToolInit()
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