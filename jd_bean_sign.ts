/**
 * App签到
 * cron: 8 10 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st"

class Jd_bean_sign extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  fp: string = ''

  constructor() {
    super();
  }

  async init() {
    this.fp = await this.getFp4_1()
    await this.run(this)
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF XWEB/30515`
      this.h5stTool = new H5ST('64e35', this.fp, this.user.UserAgent, this.user.UserName, 'https://h5.m.jd.com/', 'https://h5.m.jd.com/')
      await this.h5stTool.genAlgo()
      let timestamp: number = Date.now()
      let h5st = this.h5stTool.genH5st('235ec', {"fp": "-1", "shshshfp": "-1", "shshshfpa": "-1", "referUrl": "-1", "userAgent": "-1", "jda": "-1", "rnVersion": "3.9", "appid": "64e35", "needSecurity": true, "bizId": "active"}, 'apple', '12.1.4', 'signBeanAct', timestamp)
      let res: any = await this.get(`https://api.m.jd.com/client.action?functionId=signBeanAct&body=%7B%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22referUrl%22%3A%22-1%22%2C%22userAgent%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22rnVersion%22%3A%223.9%22%2C%22appid%22%3A%2264e35%22%2C%22needSecurity%22%3Atrue%2C%22bizId%22%3A%22active%22%7D&appid=signed_wh5&client=apple&clientVersion=12.1.4&loginType=2&h5st=${h5st}`, {
        'Host': 'api.m.jd.com',
        'User-Agent': this.user.UserAgent,
        'Referer': 'https://h5.m.jd.com/',
        'Cookie': this.user.cookie
      })
      this.o2s(res)

      if (res.data.status === '1') {
        console.log('签到成功', res.data.dailyAward.beanAward.beanCount * 1)
      } else if (res.data.status === '2') {
        console.log('已签到')
      }
    } catch (e) {
      console.log(e.message)
    }
  }
}

new Jd_bean_sign().init().then()