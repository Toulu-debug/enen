/**
 * App签到
 * cron: 8 10 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"

class Jd_bean_sign extends JDHelloWorld {
  user: User
  iosVer: string

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async main(user: User) {
    try {
      this.user = user
      let res: any = await this.get('https://api.m.jd.com/client.action?functionId=signBeanAct&body=%7B%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22referUrl%22%3A%22-1%22%2C%22userAgent%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22rnVersion%22%3A%223.9%22%7D&appid=ld', {
        'Host': 'api.m.jd.com',
        'User-Agent': this.user.UserAgent,
        'Referer': 'https://h5.m.jd.com/',
        'Cookie': this.user.cookie
      })
      this.o2s(res)
      if (res.data.status === '1') {
        console.log('开始签到')
      } else if (res.data.status === '2') {
        console.log('已签到')
      }
    } catch (e) {
      console.log(e.message)
      await this.wait(5000)
    }
  }
}

new Jd_bean_sign().init().then()