import {User, JDHelloWorld} from './TS_JDHelloWorld'

class Check_cookie extends JDHelloWorld {
  constructor() {
    super("Cookie检测");
  }

  async init() {
    await this.run(new Check_cookie())
  }

  async main(user: User) {
    let data: any = await this.get(`https://api.m.jd.com/client.action?functionId=GetJDUserInfoUnion&appid=jd-cphdeveloper-m&body=${encodeURIComponent(JSON.stringify({"orgFlag": "JD_PinGou_New", "callSource": "mainorder", "channel": 4, "isHomewhite": 0, "sceneval": 2}))}&loginType=2&_=${Date.now()}&sceneval=2&g_login_type=1&callback=GetJDUserInfoUnion&g_ty=ls`, {
      'authority': 'api.m.jd.com',
      'user-agent': user.UserAgent,
      'referer': 'https://home.m.jd.com/',
      'cookie': user.cookie
    })
    data = JSON.parse(data.match(/GetJDUserInfoUnion\((.*)\)/)[1])
    if (data.retcode === '0') {
      console.log('✅')
    } else {
      console.log('❌')
      return {msg: `Cookie无效 账号${user.index + 1} ${user.UserName}`}
    }
  }
}

new Check_cookie().init().then()
