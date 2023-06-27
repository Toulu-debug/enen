/**
 * 极速抽奖
 * cron: 8 0-23/2 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"

class Jd_simple extends JDHelloWorld {
  user: User
  fp: string
  tk: string
  rd: string
  enc: string
  sua: string
  appId: string
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
    let h5st: string = await this.h5st('activities_platform', body, 'ios', '6.3.0', fn, Date.now(), this.appId, this.tk, this.rd, this.enc, this.fp, this.sua, this.user.UserName)
    return await this.post('https://api.m.jd.com/', `functionId=${fn}&body=${JSON.stringify(body)}&t=${timestamp}&appid=activities_platform&client=ios&clientVersion=6.3.0&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'x-rp-client': 'h5_1.0.0',
      'Origin': 'https://pro.m.jd.com',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html',
      'x-referer-page': 'https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    this.user = user
    this.user.UserAgent = `jdltapp;iPhone;6.3.0;;;M/5.0;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;hasOCPay/0;appBuild/1372;Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
    this.appId = '02f8d'
    let res: any, data: any
    res = await this.algo(this.appId, this.fp, this.user.UserAgent, this.user.UserName, 'https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html', 'https://pro.m.jd.com')
    this.tk = res.tk
    this.rd = res.rd
    this.enc = res.enc
    this.sua = res.sua

    res = await this.api('inviteFissionBeforeHome', {"linkId": "Wvzc_VpNTlSkiQdHT8r7QA", "isJdApp": true, "inviter": ""})
    console.log('助力码', res.data.inviter)
    this.shareCodeSelf.push(res.data.inviter)
    await this.api('inviteFissionHome', {"linkId": "Wvzc_VpNTlSkiQdHT8r7QA", "inviter": ""})
    res = await this.api('inviteFissionPoll', {"linkId": "Wvzc_VpNTlSkiQdHT8r7QA"})
    let lotteryTimes: number = res.data.lotteryTimes
    console.log('可抽奖', lotteryTimes)

    if (lotteryTimes) {
      this.appId = 'c02c6'
      res = await this.algo(this.appId, this.fp, this.user.UserAgent, this.user.UserName, 'https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html', 'https://pro.m.jd.com')
      this.tk = res.tk
      this.rd = res.rd
      this.enc = res.enc
      this.sua = res.sua
      for (let i: number = 0; i < lotteryTimes; i++) {
        data = await this.api('inviteFissionDrawPrize', {"linkId": "Wvzc_VpNTlSkiQdHT8r7QA"})
        try {
          if (data.data.prizeType === 2) {
            console.log('🧧', data.data.prizeValue * 1)
          } else {
            this.o2s(data)
          }
        } catch (e) {
          console.log(e)
        }
        await this.wait(3000)
      }
    }
  }

  async help(users: User[]) {
    this.o2s(this.shareCodeSelf, '内部助力')
    let res: any
    this.appId = '02f8d'
    res = await this.algo(this.appId, this.fp, this.user.UserAgent, this.user.UserName, 'https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html', 'https://pro.m.jd.com')
    this.tk = res.tk
    this.rd = res.rd
    this.enc = res.enc
    this.sua = res.sua

    let shareCodeHW: string[] = []
    for (let user of users) {
      try {
        if (shareCodeHW.length === 0) shareCodeHW = await this.getshareCodeHW('fission')
        this.user = user
        let shareCode: string[] = user.index === 0 ? [...shareCodeHW, ...this.shareCodeSelf] : [...this.shareCodeSelf, ...shareCodeHW]
        for (let code of shareCode) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code}`)
          res = await this.api('inviteFissionBeforeHome', {"linkId": "Wvzc_VpNTlSkiQdHT8r7QA", "isJdApp": true, "inviter": code})
          console.log(res.data.helpResult)
          if (res.data.helpResult === 1) {
            console.log('助力成功')
            break
          } else if (res.data.helpResult === 3) {
            console.log('上限')
            break
          } else if (!res.data.helpResult) {
            console.log('不能助力自己')
          }
          await this.wait(3000)
        }
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}

new Jd_simple().init().then()