/**
 * 京东-东东农场-助力
 * 所有CK助力顺序
 * 内部 -> 助力池
 * 和jd_fruit.js同方法自己设置内部码
 * 如果没有添加内部码，直接助力助力池
 * cron: 35 0,3,5 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld";
import {getDate} from "date-fns"
import {H5ST} from "./utils/h5st"
import * as dotenv from "dotenv"

dotenv.config()
let res: any = '', data: any = '', shareCodeSelf: string[] = [], shareCodePool: string[] = [], shareCode: string[] = [], shareCodeFile: object = require('./jdFruitShareCodes')

class Fruit_Help extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  message: string = ''
  log: { help: string, runTimes: string }

  constructor() {
    super()
    this.log = {
      help: '',
      runTimes: ''
    }
  }

  async init() {
    await this.run(new Fruit_Help())
  }

  async api(fn: string, body: object) {
    let h5st: string = this.h5stTool.__genH5st({
      'appid': 'wh5',
      'body': JSON.stringify(body),
      'client': 'apple',
      'clientVersion': '10.2.4',
      'functionId': fn,
    })
    return await this.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${JSON.stringify(body)}&appid=wh5&client=apple&clientVersion=10.2.4&h5st=${h5st}`, {
      "Host": "api.m.jd.com",
      "Origin": "https://carry.m.jd.com",
      "User-Agent": this.user.UserAgent,
      "Accept-Language": "zh-CN,zh-Hans;q=0.9",
      "Referer": "https://carry.m.jd.com/",
      "Cookie": this.user.cookie
    })
  }

  async main(user: User) {
    this.user = user
    this.h5stTool = new H5ST("0c010", user.UserAgent, "8389547038003203")

    await this.h5stTool.__genAlgo()
    if (Object.keys(shareCodeFile)[user.index]) {
      shareCodeSelf = shareCodeFile[Object.keys(shareCodeFile)[user.index]].split('@')
    }
    this.o2s(shareCodeSelf, `第${user.index + 1}个账号获取的内部互助`)

    this.message += `【账号${user.index + 1}】  ${user.UserName}\n`
    this.log.help += `【账号${user.index + 1}】  ${user.UserName}\n`
    this.log.runTimes += `【账号${user.index + 1}】  ${user.UserName}\n`

    res = await this.api('initForFarm', {"version": 11, "channel": 3})
    if (res.code !== '0') {
      console.log('初始化失败')
      return
    }
    try {
      console.log('助力码', res.farmUserPro.shareCode)
      for (let i = 0; i < 5; i++) {
        try {
          let today: number = getDate(new Date())
          res = await this.get(`https://api.jdsharecode.xyz/api/runTimes0509?activityId=farm&sharecode=${res.farmUserPro.shareCode}&today=${today}`)
          console.log(res)
          this.log.runTimes += `第${i + 1}次${res}\n`
          break
        } catch (e) {
          console.log(`第${i + 1}次上报失败`, e)
          this.log.runTimes += `第${i + 1}次上报失败 ${typeof e === 'object' ? JSON.stringify(e) : e}\n`
          await this.wait(this.getRandomNumberByRange(10000, 30000))
        }
      }
    } catch (e) {
      console.log('获取助力码失败, 黑号?')
      return
    }
    await this.wait(1000)

    // 助力
    shareCodePool = await this.getShareCodePool('farm', 50)
    shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodePool]))

    for (let code of shareCodeSelf) {
      console.log(`账号 ${user.UserName} 去助力 ${code} ${shareCodeSelf.includes(code) ? '*内部*' : ''}`)
      res = await this.api('initForFarm', {"mpin": "", "utm_campaign": "t_335139774", "utm_medium": "appshare", "shareCode": code, "utm_term": "Wxfriends", "utm_source": "iosapp", "imageUrl": "", "nickName": "", "version": 14, "channel": 2, "babelChannel": 0})
      await this.wait(5000)
      if (res.helpResult.code === '7') {
        console.log('不给自己助力')
      } else if (res.helpResult.code === '0') {
        console.log('助力成功,获得', res.helpResult.salveHelpAddWater)
        this.log.help += `助力成功 ${code} ${shareCodeSelf.includes(code) ? '*内部*' : ''}\n`
      } else if (res.helpResult.code === '8') {
        console.log('上限')
        break
      } else if (res.helpResult.code === '9') {
        console.log('已助力')
        this.log.help += `已助力 ${code} ${shareCodeSelf.includes(code) ? '*内部*' : ''}\n`
      } else if (res.helpResult.code === '10') {
        console.log('已满')
      } else if (res.helpResult.remainTimes === 0) {
        console.log('上限')
        break
      }
    }
    await this.wait(10000)

    // 助力奖励
    res = await this.api('farmAssistInit', {"version": 14, "channel": 1, "babelChannel": "120"})
    if (res.code !== '0') {
      console.log('farmAssistInit Error')
      return
    }
    await this.wait(3000)
    let farmAssistInit_waterEnergy: number = 0
    for (let t of res.assistStageList) {
      if (t.percentage === '100%' && t.stageStaus === 2) {
        data = await this.api('receiveStageEnergy', {"version": 14, "channel": 1, "babelChannel": "120"})
        await this.wait(3000)
        farmAssistInit_waterEnergy += t.waterEnergy
      } else if (t.stageStaus === 3) {
        farmAssistInit_waterEnergy += t.waterEnergy
      }
    }
    console.log('收到助力', res.assistFriendList.length)
    console.log('助力已领取', farmAssistInit_waterEnergy)

    this.message += `【助力已领取】  ${farmAssistInit_waterEnergy}\n\n`
    this.message += '\n\n'
    if (user.end) {
      console.log(this.message)
      console.log(this.log.help)
      console.log(this.log.runTimes)
    }
    await this.wait(60000)
  }
}

new Fruit_Help().init().then()
