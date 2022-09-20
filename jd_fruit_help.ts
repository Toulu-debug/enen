/**
 * 京东-东东农场-助力
 * 所有CK助力顺序
 * 内部 -> 助力池
 * 和jd_fruit.js同方法自己设置内部码
 * 如果没有添加内部码，直接助力助力池
 * cron: 35 0,3,5 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"

class Jd_fruit_help extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []

  constructor() {
    super("农场助力");
  }

  async init() {
    await this.run(this)
  }

  randPhoneId() {
    return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  }

  async main(user: User) {
    this.user = user
    this.user.UserAgent = `jdapp;iPhone;10.2.0;${Math.ceil(Math.random() * 4 + 10)}.${Math.ceil(Math.random() * 4)};${this.randPhoneId()};network/4g;model/iPhone11,8;addressid/1188016812;appBuild/167724;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
    let res: any
    try {
      res = await this.get(`https://api.m.jd.com/api?functionId=initForFarm&body=${encodeURIComponent(JSON.stringify({version: 4}))}&appid=wh5&clientVersion=9.1.0`, {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "cookie": this.user.cookie,
        "origin": "https://home.m.jd.com",
        "pragma": "no-cache",
        "referer": "https://home.m.jd.com/myJd/newhome.action",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "User-Agent": this.user.UserAgent,
        "Content-Type": "application/x-www-form-urlencoded"
      })
      if (res.code === '0') {
        console.log('助力码', res.farmUserPro.shareCode)
        this.shareCodeSelf.push(res.farmUserPro.shareCode)
      } else {
        this.o2s(res, 'initForFarm error')
        return {msg: `账号${this.user.index + 1} ${this.user.UserName}\n初始化失败\n${JSON.stringify(res)}`}
      }
    } catch (e) {
      console.log(e.message)
      return {msg: `账号${this.user.index + 1} ${this.user.UserName}\n运行出错\n${e.message}`}
    }
  }

  async help(users: User[]) {
    this.o2s(this.shareCodeSelf, '内部助力')
    let res: any, full: string [] = []
    for (let user of users) {
      try {
        this.user = user
        this.user.UserAgent = `jdapp;iPhone;10.2.0;${Math.ceil(Math.random() * 4 + 10)}.${Math.ceil(Math.random() * 4)};${this.randPhoneId()};network/4g;model/iPhone11,8;addressid/1188016812;appBuild/167724;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
        let shareCodePool: string[] = await this.getShareCodePool('farm', 50)
        let shareCode: string[] = [...this.shareCodeSelf, ...shareCodePool]
        this.o2s(shareCode, '助力顺序')
        for (let code of shareCode) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code}`)
          if (full.includes(code)) {
            console.log('full contains')
            continue
          }
          res = await this.get(`https://api.m.jd.com/api?functionId=initForFarm&body=${encodeURIComponent(JSON.stringify({imageUrl: "", nickName: "", "shareCode": code, babelChannel: "3", version: 2, channel: 1}))}&appid=wh5`, {
            "Host": "api.m.jd.com",
            "Accept": "*/*",
            "Origin": "https://carry.m.jd.com",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": this.user.UserAgent,
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Referer": "https://carry.m.jd.com/",
            "Cookie": this.user.cookie
          })
          if (!(res.helpResult && res.helpResult.code)) {
            this.o2s(res, '助力出错')
          } else if (res.helpResult.code === '0') {
            console.log('助力成功,获得', res.helpResult.salveHelpAddWater)
            for (let i = 0; i < 5; i++) {
              try {
                res = await this.get(`https://sharecodepool.cnmb.win/api/runTimes0917?activityId=farm&sharecode=${this.user['code'] ?? ""}&today=${Date.now().toString()}`)
                console.log(res)
                break
              } catch (e) {
                console.log(e.message)
                await this.wait(this.getRandomNumberByRange(10000, 20000))
              }
            }
          } else if (res.helpResult.code === '7') {
            console.log('不给自己助力')
            this.user['code'] = code
          } else if (res.helpResult.code === '9') {
            console.log('已助力')
          } else if (res.helpResult.code === '10') {
            console.log('已满')
            full.push(code)
          }
          if (res.helpResult.remainTimes === 0) {
            console.log('上限')
            await this.wait(10000)
            break
          }
          await this.wait(10000)
        }
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}

new Jd_fruit_help().init().then()