/**
 * 极速版-签到+提现
 * cron: 45 0 * * *
 * export FP_15097=""
 */

import {H5ST} from "./utils/h5st_pro"
import {JDHelloWorld, User} from "./TS_JDHelloWorld";

class Speed_Sign extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  fp: string

  constructor() {
    super();
  }

  async init() {
    this.fp = process.env.FP_15097 || await this.getFp()
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st: string = await this.h5stTool.__genH5st({
      appid: 'activities_platform',
      body: JSON.stringify(body),
      client: 'H5',
      clientVersion: '1.0.0',
      functionId: fn,
      t: timestamp.toString()
    })
    return await this.post('https://api.m.jd.com/', `functionId=${fn}&body=${JSON.stringify(body)}&t=${timestamp}&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'Cookie': this.user.cookie,
      'accept': 'application/json, text/plain, */*',
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://daily-redpacket.jd.com',
      'user-agent': this.user.UserAgent,
      'referer': 'https://daily-redpacket.jd.com/'
    })
  }

  async main(user: User) {
    this.user = user
    this.user.UserAgent = `jdltapp;iPhone;3.9.2;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
    this.h5stTool = new H5ST("15097", this.user.UserAgent, this.fp, 'https://daily-redpacket.jd.com/?activityId=9WA12jYGulArzWS7vcrwhw', 'https://daily-redpacket.jd.com', this.user.UserName);
    await this.h5stTool.__genAlgo()
    let res: any = await this.api('apSignIn_day', {"linkId": "9WA12jYGulArzWS7vcrwhw", "serviceName": "dayDaySignGetRedEnvelopeSignService", "business": 1})
    try {
      if (res.data.retCode === 0) {
        console.log('签到成功')
      } else {
        console.log(res.data.retMessage)
      }
      await this.wait(2000)

      res = await this.api('signPrizeDetailList', {"linkId": "9WA12jYGulArzWS7vcrwhw", "serviceName": "dayDaySignGetRedEnvelopeSignService", "business": 1, "pageSize": 20, "page": 1})
      for (let t of res.data.prizeDrawBaseVoPageBean.items) {
        if (t.prizeType === 4 && t.prizeStatus === 0) {
          res = await this.api('apCashWithDraw', {"linkId": "9WA12jYGulArzWS7vcrwhw", "businessSource": "DAY_DAY_RED_PACKET_SIGN", "base": {"prizeType": t.prizeType, "business": t.business, "id": t.id, "poolBaseId": t.poolBaseId, "prizeGroupId": t.prizeGroupId, "prizeBaseId": t.prizeBaseId}})
          console.log(parseFloat(t.prizeValue), res.data.message)
          await this.wait(2000)
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  }
}

new Speed_Sign().init().then()