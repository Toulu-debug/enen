/**
 * 宠汪汪-助力
 * cron: 15 8,12 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st_pro";

class Jd_cww_help extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  shareCodeSelf: string[] = []
  fp: any = undefined

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: string = Date.now().toString();
    let h5st: string = await this.h5stTool.__genH5st({
      'appid': 'choujiangyingyong',
      'body': JSON.stringify(body),
      'client': 'macOS 12.6.0',
      'clientVersion': '3.5.5',
      'functionId': fn,
      't': timestamp.toString()
    })
    let url: string = `https://api.m.jd.com/api?client=macOS%2012.6.0&clientVersion=3.5.5&appid=choujiangyingyong&t=${timestamp}&functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&h5st=${h5st}`
    return await this.get(url, {
      'Host': 'api.m.jd.com',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://servicewechat.com/wxccb5c536b0ecd1bf/854/page-frame.html',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Content-Type': 'application/json',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    console.log(user.index)
  }

  async help(users: User[]) {
    let full: string[] = []
    this.fp = await this.getFp()
    for (let user of users) {
      this.user = user
      this.user.UserAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac`
      let res: any

      this.h5stTool = new H5ST('538b4', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
      await this.h5stTool.__genAlgo()

      for (let code of users) {
        if (user.UserName === code.UserName || full.includes(code.UserName)) continue
        console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code.UserName}`)
        res = await this.api('helpFriend', {"friendPin": code.UserName, "reqSource": "weapp"})
        await this.wait(2000)
        console.log(res.errorCode)

        if (res.errorCode === 'invite_full') full.push(code.UserName)
        if (res.errorCode === 'help_full') break
      }
    }
  }
}

new Jd_cww_help().init().then()