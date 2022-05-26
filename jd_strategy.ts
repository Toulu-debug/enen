/**
 * https://appliances-activity.jd.com/
 * export FP_F093B=""
 * cron: 0 20 * * *
 */

import {H5ST} from "./utils/h5st"
import {User, JDHelloWorld} from "./TS_JDHelloWorld";

interface INVITE {
  type: string,
  code: string
}

class Jd_strategy extends JDHelloWorld {
  cookie: string
  h5stTool: H5ST
  shareCodeSelf: INVITE[] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(body: object) {
    let timestamp: number = Date.now()
    let h5st: string = this.h5stTool.__genH5st({
      appid: 'reinforceints',
      body: JSON.stringify(body),
      functionId: 'strategy_vote_prod',
      t: timestamp.toString(),
    })
    return await this.post('https://api.m.jd.com/api', `appid=reinforceints&functionId=strategy_vote_prod&body=${JSON.stringify(body)}&t=${timestamp}&h5st=${h5st}&loginType=2`, {
      'Host': 'api.m.jd.com',
      'Origin': 'https://appliances-activity.jd.com',
      'User-Agent': 'jdapp;',
      'Referer': 'https://appliances-activity.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': this.cookie
    })
  }

  async main(user: User) {
    this.cookie = user.cookie
    this.h5stTool = new H5ST("f093b", user.UserAgent, process.env.FP_F093B || "7063407705917609");
    await this.h5stTool.__genAlgo()
    let res: any, data: any, gg: boolean = false
    res = await this.api({"apiMapping": "/api/index/indexInfo"})

    for (let t of res.data.track) {
      try {
        if (!t.jbeanSuccess && new Date().getHours() > 19) {
          console.log('type', t.type)
          let i: number = 1
          for (let tp of t.skuList) {
            data = await this.api({"type": t.type, "like": 1, "skuId": tp.skuId, "index": i, "apiMapping": "/api/index/vote"})
            console.log('投票', data.msg, data.data)
            if (data.msg.includes('火爆')) {
              gg = true
              break
            }
            i++
          }
          if (!gg) {
            data = await this.api({"type": t.type, "apiMapping": "/api/lottery/lottery"})
            console.log('抽奖', data.msg, data.data)
          }
        } else {
          console.log(`type ${t.type} 已完成`)
        }
        data = await this.api({"type": t.type, "apiMapping": "/api/supportTask/getShareId"})
        console.log(`type ${t.type} 助力码`, data.data)
        this.shareCodeSelf.push({type: t.type, code: data.data})
      } catch (e) {
        console.log('error', e)
      }
    }
  }

  async help(users: User[]) {
    this.o2s(this.shareCodeSelf, '内部助力')
    let res: any, data: any, shareCode: INVITE[] = [], shareCodeHW: any = []
    for (let user of users) {
      try {
        this.cookie = user.cookie
        if (shareCodeHW.length === 0) {
          shareCodeHW = await this.getshareCodeHW('strategy')
        }
        shareCode = [...this.shareCodeSelf, ...shareCodeHW]
        for (let code of shareCode) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code.code}`)
          data = await this.api({"shareId": code.code, "type": code.type, "apiMapping": "/api/supportTask/doSupport"})
          console.log(data.msg, data.data.status)
        }
      } catch (e) {
        console.log('error', e)
      }
    }

    for (let user of users) {
      try {
        this.cookie = user.cookie
        console.log(`账号${user.index + 1} ${user.UserName}`)

        res = await this.api({"apiMapping": "/api/index/indexInfo"})
        for (let t of res.data.track) {
          data = await this.api({"type": t.type, "apiMapping": "/api/lottery/lottery"})
          console.log('抽奖', data.msg, data.data)
        }
      } catch (e) {
        console.log('error', e)
      }
    }
  }
}

new Jd_strategy().init().then()