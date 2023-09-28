/**
 * 微信快递小程序签到
 * cron: 8 10 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"

class Jd_wechat_sign extends JDHelloWorld {
  user: User

  constructor() {
    super("微信签到");
  }

  async init() {
    await this.run(this)
  }

  async main(user: User) {
    try {
      let uuid: string = ''
      for (let i = 0; i < 32; i++) {
        uuid += this.getRandomNumberByRange(0, 2)
          ? this.getRandomNumString(1)
          : this.getRandomWord().toLowerCase()
      }
      this.user = user
      let res: any = await this.post('https://lop-proxy.jd.com/jiFenApi/signInAndGetReward', '[{"userNo":"$cooMrdGatewayUid$"}]', {
        'Host': 'lop-proxy.jd.com',
        'AppParams': '{"appid":158,"ticket_type":"m"}',
        'uuid': uuid,
        'LOP-DN': 'jingcai.jd.com',
        'User-Agent': this.user.UserAgent,
        'Origin': 'https://jingcai-h5.jd.com',
        'Referer': 'https://jingcai-h5.jd.com/',
        'Cookie': this.user.cookie
      })
      this.o2s(res)
      if (res.success) {
        console.log('签到成功', JSON.parse(res.content[0].param))
      } else {
        console.log(res.msg)
      }
    } catch (e) {
      console.log(e.message)
    }
  }
}

new Jd_wechat_sign().init().then()