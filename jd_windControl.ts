/**
 * 我的PLUS综合分
 * cron: 30 9 * * 1
 */

import {User, JDHelloWorld} from './TS_JDHelloWorld'
import {H5ST} from './utils/h5st_pro'

class jd_WindControl extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  fp: string

  constructor() {
    super()
  }

  async init() {
    this.fp = await this.getFp()
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let h5st: string = await this.h5stTool.__genH5st({
      appid: 'plus_business',
      body: JSON.stringify(body),
      functionId: fn,
    })
    return await this.post(
      `https://api.m.jd.com/api?functionId=${fn}`,
      new URLSearchParams({
        appid: 'plus_business',
        loginType: '2',
        loginWQBiz: '',
        functionId: fn,
        body: '{}',
        h5st: h5st,
      }),
      {
        'Host': 'api.m.jd.com',
        'x-rp-client': 'h5_1.0.0',
        'Origin': 'https://plus.m.jd.com',
        'User-Agent': this.user.UserAgent,
        'Referer': 'https://plus.m.jd.com/rights/windControl',
        'x-referer-page': 'https://plus.m.jd.com/rights/windControl',
        'Cookie': this.user.cookie,
      }
    )
  }

  async main(user: User) {
    try {
      this.user = user
      let res: any
      this.h5stTool = new H5ST('b63ff', this.user.UserAgent, this.fp, 'https://plus.m.jd.com/rights/windControl', 'https://plus.m.jd.com')
      await this.h5stTool.__genAlgo()
      res = await this.api('windControl_queryScore_v1', {})

      console.log('综合：',res.rs.userSynthesizeScore.totalScore)
      console.log('信用：', res.rs.userDimensionScore.baiScore)
      console.log('购物合规：', res.rs.userDimensionScore.shop)
      console.log('售后行为：', res.rs.userDimensionScore.active)
      console.log('账户信息：', res.rs.userDimensionScore.accountInfo)
    } catch (e) {
      console.log(e.message)
    }
    await this.wait(3000)
  }
}

new jd_WindControl().init().then()
