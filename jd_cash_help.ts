/**
 * 小程序-领现金-1.5
 * cron: 15 14,15,19 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"

interface CODE {
  inviteCode: string,
  shareDate: string
}

class Jd_cash_help extends JDHelloWorld {
  user: User
  shareCodeSelf: CODE[] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    await this.wait(1000)
    return await this.post('https://api.m.jd.com/client.action', new URLSearchParams({
      'functionId': fn,
      'body': JSON.stringify(body),
      'appid': 'CashRewardMiniH5Env',
      'loginType': '2',
      'loginWQBiz': 'interact'
    }), {
      'Host': 'api.m.jd.com',
      "Referer": "https://servicewechat.com/wx91d27dbf599dff74/621/page-frame.html",
      'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac`,
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    this.user = user
    let res: any
    try {
      res = await this.api('cash_mob_home', {"isLTRedPacket": "1"})
      for (let t of res.data.result.taskInfos) {
        if (t.doTimes !== t.times) {
          console.log(t.name)
          res = await this.api('cash_doTask', {"type": t.type, "taskInfo": t.desc})
          console.log(res.data.result.totalMoney)
          res = await this.api('cash_mob_home', {"isLTRedPacket": "1"})
        }
      }
      this.o2s(res)

      if (new Date().getHours() >= 11 && new Date().getHours() < 22) {
        res = await this.api('cash_join_limited_redpacket', {"id": 5, "level": 3})
        res.data.bizCode === 0 ? console.log('开启成功') : console.log(res.data.bizMsg)

        res = await this.api('cash_mob_home', {"isLTRedPacket": "1"})
        if (res.data.result.inviteCode && res.data.result.shareDate) {
          this.shareCodeSelf.push({
            inviteCode: res.data.result.inviteCode,
            shareDate: res.data.result.shareDate
          })
          console.log('助力码', res.data.result.inviteCode, res.data.result.shareDate)
        }
      } else {
        console.log('不在时间范围')
      }
    } catch (e) {
      console.log('error', e.message)
    }
  }

  async help(users: User[]) {
    let shareCodeHW: any = [], shareCode: CODE[] = [], full: string[] = []
    this.o2s(this.shareCodeSelf, '内部助力')
    let res: any

    for (let user of users) {
      try {
        this.user = user
        if (shareCodeHW.length === 0) {
          shareCodeHW = await this.getshareCodeHW('cash')
        }
        if (user.index === 0) {
          shareCode = [...shareCodeHW, ...this.shareCodeSelf]
        } else {
          shareCode = [...this.shareCodeSelf, ...shareCodeHW]
        }

        for (let code of shareCode) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code.inviteCode}`)
          if (full.includes(code.inviteCode)) {
            console.log('full contains')
            continue
          }
          res = await this.api('redpack_limited_assist', {"inviteCode": code.inviteCode, "shareDate": code.shareDate})
          console.log(res.data?.result?.limitTimeAssist?.tips)
          if (res.data?.result?.limitTimeAssist?.tips === '您来晚啦，您的好友已经领到全部奖励了')
            full.push(code.inviteCode)
          if (res.data?.result?.limitTimeAssist?.assistCode === '207') {
            break
          }
        }
      } catch (e) {
        console.log('error', e.message)
      }
    }

    for (let user of users) {
      try {
        this.user = user
        console.log(`账号${user.index + 1} ${user.UserName}`)
        for (let i = 1; i < 5; i++) {
          res = await this.api('cash_open_limited_redpacket', {"node": i})
          // this.o2s(res)
          console.log(res.data.bizMsg)
          if (res.data.bizMsg === '无资格')
            break
        }
      } catch (e) {
        console.log('error', e.message)
      }
    }
  }
}

new Jd_cash_help().init().then()