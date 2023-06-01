import {User, JDHelloWorld} from './TS_JDHelloWorld'

class Check_cookie extends JDHelloWorld {
  constructor() {
    super("Cookie检测");
  }

  async init() {
    await this.run(this)
  }

  async main(user: User) {
    let res: any = await this.get(`https://plogin.m.jd.com/cgi-bin/ml/islogin`, {
      'user-agent': user.UserAgent,
      'cookie': user.cookie
    })
    if (res.islogin === '1') {
      console.log('✅')
    } else {
      console.log('❌')
      return {msg: `Cookie过期 账号${user.index + 1} ${user.UserName}`}
    }
  }
}

new Check_cookie().init().then()
