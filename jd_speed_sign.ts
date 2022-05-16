/**
 * 极速版-签到+提现
 * cron: 45 0 * * *
 */

import {H5ST} from "./utils/h5st"
import {JDHelloWorld, User} from "./TS_JDHelloWorld";

class Speed_Sign extends JDHelloWorld {
  cookie: string
  h5stTool: H5ST

  constructor() {
    super();
  }

  async init() {
    await this.run(new Speed_Sign())
  }


  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st: string = this.h5stTool.__genH5st({
      appid: 'activities_platform',
      body: JSON.stringify(body),
      client: 'H5',
      clientVersion: '1.0.0',
      functionId: fn,
      t: timestamp.toString()
    })
    return await this.post('https://api.m.jd.com/', `functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&t=${timestamp}&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'User-Agent': 'jdltapp;android;3.8.16;',
      'Origin': 'https://daily-redpacket.jd.com',
      'Referer': 'https://daily-redpacket.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': this.cookie
    })
  }

  async main(user: User) {
    this.cookie = user.cookie
    this.h5stTool = new H5ST("15097", "jdltapp;", process.env.FP_15097 ?? "");
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
