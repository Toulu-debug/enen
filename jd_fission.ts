/**
 * 抽奖
 * cron: 5 0-3,20-22 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {readFileSync} from "fs"
import {JSDOM, ResourceLoader, VirtualConsole} from "jsdom"
import CryptoJS from "crypto-js";

class Jd_fission extends JDHelloWorld {
  user: User
  fp: string
  appId: string
  shareCodeSelf: string[] = []
  htstTool: any

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async h5stToolInit() {
    let dom = new JSDOM(`<body><script>${readFileSync('utils/h5st_43.js').toString()}</script></body>`, {
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
    let t = Date.now()
    let h5st: string = (await this.htstTool.sign({
      appid: 'activities_platform',
      body: CryptoJS.SHA256(JSON.stringify(body)).toString(CryptoJS.enc.Hex),
      client: 'ios',
      clientVersion: '12.3.2',
      functionId: fn,
      t: t
    })).h5st
    return await this.post('https://api.m.jd.com/api', `functionId=${fn}&body=${JSON.stringify(body)}&t=${t}&appid=activities_platform&client=ios&clientVersion=12.3.2&h5st=${h5st}`, {
      'authority': 'api.m.jd.com',
      'User-Agent': this.user.UserAgent,
      'origin': 'https://pro.m.jd.com',
      'referer': 'https://pro.m.jd.com/mall/active/3BwUqhLsJYrHP4qgAgDDJGrSVngK/index.html',
      'Cookie': this.user.cookie,
      'x-referer-page': 'https://pro.m.jd.com/mall/active/3BwUqhLsJYrHP4qgAgDDJGrSVngK/index.html',
      'x-rp-client': 'h5_1.0.0'
    })
  }

  async main(user: User) {
    for (let j = 0; j < 2; j++) {
      try {
        this.user = user
        this.user.UserAgent = j === 0
          ? `jdapp;iPhone;12.3.2;;;M/5.0;appBuild/169031;Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
          : `jdltapp;iPhone;6.3.0;;;M/5.0;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;hasOCPay/0;appBuild/1372;Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
        this.appId = '02f8d'
        await this.h5stToolInit()
        let res: any, data: any
        let linkId: string = j === 0 ? '3orGfh1YkwNLksxOcN8zWQ' : 'Wvzc_VpNTlSkiQdHT8r7QA'
        res = await this.api('inviteFissionBeforeHome', {"linkId": linkId, "isJdApp": true, "inviter": ""})
        console.log('助力码', res.data.inviter)
        this.shareCodeSelf.push(res.data.inviter)
        await this.wait(1000)

        this.appId = 'eb67b'
        await this.h5stToolInit()

        res = await this.api('inviteFissionHome', {"linkId": linkId, "inviter": ""})
        let lotteryTimes: number = res.data.prizeNum
        console.log('可抽奖', lotteryTimes)

        if (lotteryTimes) {
          this.appId = 'c02c6'
          await this.h5stToolInit()
          for (let i: number = 0; i < lotteryTimes; i++) {
            data = await this.api('inviteFissionDrawPrize', {"linkId": linkId})
            try {
              if (data.data.prizeType === 2) {
                console.log('🧧', data.data.prizeValue * 1)
              } else if (data.data.prizeType === 4) {
                console.log('💰', data.data.prizeValue * 1)
              } else {
                this.o2s(data, '抽到其他')
              }
            } catch (e) {
              console.log(e.message)
              this.o2s(data)
            }
            await this.wait(8000)
          }
        }


        this.appId = 'f2b1d'
        await this.h5stToolInit()
        let end: boolean = false
        for (let i = 1; i < 5; i++) {
          console.log('page', i)
          res = await this.api('superRedBagList', {"pageNum": i, "pageSize": 20, "linkId": linkId, "business": "fission"})
          if (end) break
          try {
            for (let t of res.data.items) {
              if (t.prizeType === 4 && t.state === -1) {
                end = true
                break
              } else if (res.data.items.length < 20) {
                end = true
                break
              } else if (t.prizeType === 4 && t.state === 0) {
                data = await this.api('apCashWithDraw', {"businessSource": "NONE", "base": {"id": t.id, "business": "fission", "poolBaseId": t.poolBaseId, "prizeGroupId": t.prizeGroupId, "prizeBaseId": t.prizeBaseId, "prizeType": 4}, "linkId": linkId})
                console.log(data.data.message, data.data.record.amount * 1)
                await this.wait(8000)
                if (data.data.message === '提现中')
                  break
              }
            }
          } catch (e) {
            console.log(e.message)
            break
          }
          await this.wait(8000)
        }
      } catch (e) {
        console.log(e.message)
        await this.wait(5000)
      }
    }
  }

  async help(users: User[]) {
    this.o2s(this.shareCodeSelf, '内部助力')
    let res: any
    this.appId = 'c5389'
    let shareCodeHW: string[] = []
    for (let j = 0; j < 2; j++) {
      for (let user of users) {
        try {
          if (shareCodeHW.length === 0) shareCodeHW = await this.getshareCodeHW('fission')
          this.user = user
          this.user.UserAgent = j === 0
            ? `jdapp;iPhone;12.2.0;;;M/5.0;appBuild/168919;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
            : `jdltapp;iPhone;6.3.0;;;M/5.0;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;hasOCPay/0;appBuild/1372;Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
          await this.h5stToolInit()
          let shareCode: string[] = [...shareCodeHW, ...this.shareCodeSelf]
          for (let code of shareCode) {
            console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code}`)
            res = await this.api('inviteFissionhelp', {"linkId": j === 0 ? '3orGfh1YkwNLksxOcN8zWQ' : "Wvzc_VpNTlSkiQdHT8r7QA", "isJdApp": true, "inviter": code})
            this.o2s(res, 'inviteFissionhelp')
            await this.wait(3000)
            if (!res.data.helpResult) {
              console.log('!helpResult')
              continue
            }
            if (res.data.helpResult === 1) {
              console.log('助力成功')
              break
            } else if (res.data.helpResult === 3) {
              console.log('上限')
              break
            }
          }
        } catch (e) {
          console.log(e.message)
        }
      }
    }
  }
}

new Jd_fission().init().then()