/**
 * 京东-种豆-助力
 * 所有CK助力顺序
 * 内部 -> 助力池
 * cron: 15 7-21/2 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st_pro";

class Jd_plantBean__help extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  fp: any = undefined

  constructor() {
    super();
  }

  async init() {
    try {
      this.fp = process.env.FP_6B93E || await this.getFp()
    } catch (e) {
      console.log(e.message)
    }
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let h5st: string = await this.h5stTool.__genH5st({
      'appid': 'signed_wh5',
      'body': JSON.stringify(body),
      'client': 'apple',
      'clientVersion': '11.3.6',
      'functionId': fn,
    })
    let data: string = await this.get(`https://api.m.jd.com/client.action?functionId=${fn}&appid=signed_wh5&body=${encodeURIComponent(JSON.stringify(body))}&client=apple&clientVersion=11.3.6&h5st=${h5st}&jsonp=jsonp_${Date.now()}_${this.getRandomNumberByRange(12345, 56789)}`, {
      'Host': 'api.m.jd.com',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://plantearth.m.jd.com/',
      'Cookie': this.user.cookie,
    })
    return JSON.parse(data.match(/jsonp_.*\((.*)\)/)[1])
  }

  async runTimes(code: string) {
    try {
      let data = await this.get(`https://sharecodepool.cnmb.win/api/runTimes0917?activityId=bean&sharecode=${code}`)
      console.log(data)
    } catch (e) {
      await this.wait(5000)
    }
  }

  async main(user: User) {
    let res: any, data: any
    try {
      this.user = user
      this.user.UserAgent = `jdapp;iPhone;11.3.6;;;M/5.0;appBuild/168392;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
      this.h5stTool = new H5ST('6b93e', this.user.UserAgent, this.fp, 'https://plantearth.m.jd.com/plantBean/index?source=lingjingdoushouye', 'https://plantearth.m.jd.com', this.user.UserName)
      await this.h5stTool.__genAlgo()
      res = await this.api('plantBeanIndex', {"monitor_source": "plant_m_plant_index", "monitor_refer": "", "version": "9.2.4.2"})
      let code: string = res.data.jwordShareInfo.shareUrl.match(/plantUuid=(\w+)/)[1]
      console.log('助力码', code)

      res = await this.api('plantShareSupportList', {"roundId": ""})
      console.log('收到助力', res.data.length)
    } catch (e) {
      console.log(e.message)
    }
  }

  async help(users: User[]) {
    let res: any, full: string[] = []
    for (let user of users) {
      try {
        this.user = user
        this.user.UserAgent = `jdapp;iPhone;11.3.6;;;M/5.0;appBuild/168392;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
        this.h5stTool = new H5ST('6b93e', this.user.UserAgent, this.fp, 'https://plantearth.m.jd.com/plantBean/index?source=lingjingdoushouye', 'https://plantearth.m.jd.com', this.user.UserName)
        await this.h5stTool.__genAlgo()
        let shareCodePool: string[] = await this.getShareCodePool('bean', 50)
        let shareCode: string[] = Array.from(new Set([...shareCodePool]))
        res = await this.api('plantBeanIndex', {"monitor_source": "plant_m_plant_index", "monitor_refer": "", "version": "9.2.4.2"})
        let my: string = res.data.jwordShareInfo.shareUrl.match(/plantUuid=(\w+)/)[1]
        for (let code of shareCode) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code}`)
          if (full.includes(code)) {
            console.log('full contains')
            continue
          }
          res = await this.api('plantBeanIndex', {"plantUuid": code, "monitor_source": "plant_m_plant_index", "monitor_refer": "", "version": "9.2.4.2"})
          console.log(res.data.helpShareRes.promptText)
          if (res.data.helpShareRes.state === '2') {
            console.log('上限')
            break
          } else if (res.data.helpShareRes.state === '3') {
            full.push(code)
          }
          await this.runTimes(my)
          await this.wait(3000)
        }
      } catch (e) {
        console.log(e.message)
        await this.wait(5000)
      }
    }
  }
}

new Jd_plantBean__help().init().then()