/**
 * 抽奖
 * cron: 5 0-3 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st"

class Jd_simple extends JDHelloWorld {
  user: User
  fp: string
  appId: string
  h5stTool: H5ST
  shareCodeSelf: string[] = []

  constructor() {
    super();
  }

  async init() {
    this.fp = await this.getFp4_1()
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st: string = this.h5stTool.genH5st('activities_platform', body, 'ios', '11.3.0', fn, timestamp)
    return await this.post('https://api.m.jd.com/api',
      `functionId=${fn}&body=${JSON.stringify(body)}&t=${timestamp}&appid=activities_platform&client=ios&clientVersion=11.3.0&h5st=${h5st}`,
      {
        'authority': 'api.m.jd.com',
        'User-Agent': this.user.UserAgent,
        'origin': 'https://pro.m.jd.com',
        'referer': 'https://pro.m.jd.com/mall/active/3BwUqhLsJYrHP4qgAgDDJGrSVngK/index.html',
        'Cookie': this.user.cookie,
        'x-referer-page': 'https://pro.m.jd.com/mall/active/3BwUqhLsJYrHP4qgAgDDJGrSVngK/index.html',
        'x-rp-client': 'h5_1.0.0'
      }
    )
  }

  async main(user: User) {
    for (let j = 0; j < 2; j++) {
      try {
        this.user = user
        this.user.UserAgent = j === 0
          ? `jdapp;iPhone;11.3.0;;;M/5.0;JDEbook/openapp.jdreader;appBuild/168341;jdSupportDarkMode/0;ef/1;Mozilla/5.0 (iPhone; CPU iPhone OS 15_5_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
          : `jdltapp;iPhone;6.3.0;;;M/5.0;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;hasOCPay/0;appBuild/1372;Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
        this.appId = '02f8d'
        this.h5stTool = new H5ST(this.appId, this.fp, this.user.UserAgent, this.user.UserName, j === 0 ? 'https://pro.m.jd.com/mall/active/3BwUqhLsJYrHP4qgAgDDJGrSVngK/index.html' : 'https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html', 'https://pro.m.jd.com')
        await this.h5stTool.genAlgo()

        let res: any, data: any
        let linkId: string = j === 0 ? '3orGfh1YkwNLksxOcN8zWQ' : 'Wvzc_VpNTlSkiQdHT8r7QA'
        res = await this.api('inviteFissionBeforeHome', {"linkId": linkId, "isJdApp": true, "inviter": ""})
        console.log('助力码', res.data.inviter)
        await this.wait(5000)

        this.shareCodeSelf.push(res.data.inviter)
        await this.api('inviteFissionHome', {"linkId": linkId, "inviter": ""})
        res = await this.api('inviteFissionPoll', {"linkId": linkId})
        let lotteryTimes: number = res.data.lotteryTimes
        console.log('可抽奖', lotteryTimes)

        if (lotteryTimes) {
          this.appId = 'c02c6'
          this.h5stTool = new H5ST(this.appId, this.fp, this.user.UserAgent, this.user.UserName, j === 0 ? 'https://pro.m.jd.com/mall/active/3BwUqhLsJYrHP4qgAgDDJGrSVngK/index.html' : 'https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html', 'https://pro.m.jd.com')
          await this.h5stTool.genAlgo()
          for (let i: number = 0; i < lotteryTimes; i++) {
            data = await this.api('inviteFissionDrawPrize', {"linkId": linkId})
            try {
              if (data.data.prizeType === 2) {
                console.log('🧧', data.data.prizeValue * 1)
              } else if (data.data.prizeType === 4) {
                console.log('💰', data.data.prizeValue * 1)
              } else {
                this.o2s(data)
              }
            } catch (e) {
              console.log(e.message)
              this.o2s(data)
            }
            await this.wait(10000)
          }
        }

        this.appId = 'f2b1d'
        this.h5stTool = new H5ST(this.appId, this.fp, this.user.UserAgent, this.user.UserName, j === 0 ? 'https://pro.m.jd.com/mall/active/3BwUqhLsJYrHP4qgAgDDJGrSVngK/index.html' : 'https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html', 'https://pro.m.jd.com')
        await this.h5stTool.genAlgo()
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
              }
            }
          } catch (e) {
            console.log(e.message)
            break
          }
          await this.wait(5000)
        }
      } catch (e) {
        console.log(e.message)
        await this.wait(5000)
      }
    }
    await this.wait(60000)
  }

  async help(users: User[]) {
    this.o2s(this.shareCodeSelf, '内部助力')
    let res: any
    this.appId = '02f8d'
    for (let j = 0; j < 2; j++) {
      let shareCodeHW: string[] = []
      for (let user of users) {
        try {
          if (shareCodeHW.length === 0) shareCodeHW = await this.getshareCodeHW('fission')
          this.user = user
          this.user.UserAgent = j === 0
            ? `jdapp;iPhone;11.3.0;;;M/5.0;JDEbook/openapp.jdreader;appBuild/168341;jdSupportDarkMode/0;ef/1;Mozilla/5.0 (iPhone; CPU iPhone OS 15_5_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
            : `jdltapp;iPhone;6.3.0;;;M/5.0;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;hasOCPay/0;appBuild/1372;Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
          this.h5stTool = new H5ST(this.appId, this.fp, this.user.UserAgent, this.user.UserName, j === 0 ? 'https://pro.m.jd.com/mall/active/3BwUqhLsJYrHP4qgAgDDJGrSVngK/index.html' : 'https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html', 'https://pro.m.jd.com')
          await this.h5stTool.genAlgo()

          let shareCode: string[] = user.index === 0 ? [...shareCodeHW, ...this.shareCodeSelf] : [...this.shareCodeSelf, ...shareCodeHW]
          for (let code of shareCode) {
            console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code}`)
            res = await this.api('inviteFissionBeforeHome', {"linkId": j === 0 ? '3orGfh1YkwNLksxOcN8zWQ' : "Wvzc_VpNTlSkiQdHT8r7QA", "isJdApp": true, "inviter": code})
            await this.wait(10000)
            if (res.data.helpResult === 1) {
              console.log('助力成功')
              break
            } else if (res.data.helpResult === 3) {
              console.log('上限')
              break
            } else if (!res.data.helpResult) {
              console.log('不能助力自己')
            }
          }
        } catch (e) {
          console.log(e.message)
        }
      }
    }
  }
}

new Jd_simple().init().then()