/**
 * 取消关注商品、店铺
 * cron: 10 10 * * *
 */

import {JDHelloWorld, User} from "./TS_JDHelloWorld";
import {H5ST} from "./utils/h5st_pro";

class Jd_RmFollowList extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  fp: string

  constructor() {
    super('取消关注商品、店铺');
  }

  async init() {
    try {
      this.fp = process.env.FP_B3F11 ?? await this.getFp()
    } catch (e) {
      console.log('FP Error: ', e.message)
      process.exit(0)
    }
    await this.run(this)
  }

  async api(fn: string, params: object) {
    let res: any = await this.get(`https://wq.jd.com/fav/shop/${fn}`, {
      'Host': 'wq.jd.com',
      'Cookie': this.user.cookie,
      'user-agent': this.user.UserAgent,
      'referer': 'https://wqs.jd.com/',
    }, params)
    res = JSON.parse(res.match(/\(([\S\s]+)\);/)[1])
    return res
  }

  async api2(fn: string, body: object) {
    let h5st: string = await this.h5stTool.__genH5st({
      appid: "jd-cphdeveloper-m",
      body: JSON.stringify(body),
      functionId: fn,
    })
    return await this.get('https://api.m.jd.com/api', {
      'cookie': this.user.cookie,
      'origin': 'https://wqs.jd.com',
      'referer': 'https://wqs.jd.com/',
      'user-agent': this.user.UserAgent,
      'x-referer-page': 'https://wqs.jd.com/my/fav/goods_fav.shtml',
      'x-rp-client': 'h5_1.0.0'
    }, {
      'appid': 'jd-cphdeveloper-m',
      'functionId': fn,
      'body': JSON.stringify(body),
      'loginType': '2',
      'h5st': h5st,
      'sceneval': '2',
      'g_login_type': '1',
      'g_ty': 'ajax',
      'appCode': 'ms0ca95114'
    })
  }

  async main(user: User) {
    this.user = user
    this.h5stTool = new H5ST("c420a", this.user.UserAgent, this.fp, 'https://wqs.jd.com/', 'https://wqs.jd.com/', this.user.UserName);
    await this.h5stTool.__genAlgo()
    let res: any, data: any
    try {
      for (let i = 0; i < 3; i++) {
        res = await this.api('QueryShopFavList', {
          'cp': '1',
          'pageSize': '10',
          'g_login_type': '0',
          'appCode': 'msd95910c4',
          'callback': `jsonpCBK${this.getRandomWord()}`,
        })
        console.log('当前关注店铺', res.totalNum * 1)
        let venderIdList: string[] = res.data.map(t => {
          console.log(t.shopName)
          return t.shopId
        })

        if (venderIdList.length === 0) {
          break
        }
        res = await this.api('batchunfollow', {
          'shopId': venderIdList.join(','),
          '_': Date.now(),
          'g_login_type': 0,
          'appCode': 'msd95910c4',
          'callback': `jsonpCBK${this.getRandomWord()}`
        })
        res.iRet === '0' && console.log('取关成功')
        await this.wait(4000)
      }

      this.user.UserAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`
      for (let i = 0; i < 3; i++) {
        res = await this.api2('queryFollowProduct', {"cp": 1, "pageSize": 10, "category": "", "promote": 0, "cutPrice": 0, "coupon": 0, "stock": 0, "area": "", "tenantCode": "jgm", "bizModelCode": "6", "bizModeClientType": "M", "externalLoginType": "1"})
        console.log('关注商品', res.totalNum)
        let arr: string[] = []
        for (let t of res.followProductList) {
          console.log(t.commTitle)
          arr.push(t.commId)
        }
        if (arr.length === 0)
          break
        data = await this.api2('delFollowProduct', {"commId": arr.join(','), "tenantCode": "jgm", "bizModelCode": "6", "bizModeClientType": "M", "externalLoginType": "1"})
        data.code === '0' && console.log('取关成功')
        await this.wait(4000)
      }
    } catch (e) {
      console.log('error', e)
    }
  }
}

new Jd_RmFollowList().init().then()