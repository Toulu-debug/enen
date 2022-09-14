/**
 * 小程序-赚京豆
 * cron: 15,30,45 0 * * *
 * export ZJD_OPEN=5  // 前n个账号开团, 默认全开
 * CK1 优先助力HW.ts
 */

import {JDHelloWorld, User} from "./TS_JDHelloWorld";
import {H5ST} from "./utils/h5st_pro";

let shareCodeSelf: Tuan[] = [], shareCode: Tuan[] = [], shareCodeHW: any = []

interface Tuan {
  assistStartRecordId: string
  encPin: string
  id: string
}

class Zjd extends JDHelloWorld {
  user: User
  openNum: number = 0
  zjd_open: number
  h5stTool: H5ST

  constructor() {
    super()
  }

  async init() {
    await this.run(this, this.help, this.tips)
  }

  tips() {
    this.zjd_open = Number(process.env.ZJD_OPEN) || 10
    process.env.ZJD_OPEN ? console.log('自定义', this.zjd_open, '个账号开团') : ''
  }

  async api(fn: string, body: object) {
    await this.wait(3000)
    let h5st: string = await this.h5stTool.__genH5st({
      appid: 'swat_miniprogram',
      body: JSON.stringify(body),
      functionId: fn,
    })
    return this.post(`https://api.m.jd.com/api`, `functionId=${fn}&h5st=${h5st}&body=${encodeURIComponent(JSON.stringify(body))}&appid=swat_miniprogram`, {
      'user-agent': this.user.UserAgent,
      'referer': 'https://servicewechat.com/wxa5bf5ee667d91626/173/page-frame.html',
      'Cookie': this.user.cookie,
    })
  }

  async main(user: User) {
    this.user = user
    this.user.UserAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac`
    let fp: any = await this.getFp()
    this.h5stTool = new H5ST('d8ac0', this.user.UserAgent, fp, 'https://servicewechat.com/wxa5bf5ee667d91626/173/page-frame.html', 'https://servicewechat.com', this.user.UserName)
    await this.h5stTool.__genAlgo()
    let res: any = await this.api('distributeBeanActivityInfo', {"paramData": {"channel": "FISSION_BEAN"}})
    if (res.data.assistStatus === 1) {
      // 已开，没满
      console.log('已开团，', res.data.assistedRecords.length, '/', res.data.assistNum, '，剩余', Math.round(res.data.assistValidMilliseconds / 1000 / 60), '分钟')
      shareCodeSelf.push({
        assistStartRecordId: res.data.assistStartRecordId,
        encPin: res.data.encPin,
        id: res.data.id,
      })
    } else if (res.data.assistStatus === 2 && res.data.canStartNewAssist && this.openNum < this.zjd_open) {
      // 没开团
      this.openNum++
      this.h5stTool = new H5ST('dde2b', this.user.UserAgent, fp, 'https://servicewechat.com/wxa5bf5ee667d91626/173/page-frame.html', 'https://servicewechat.com', this.user.UserName)
      await this.h5stTool.__genAlgo()
      res = await this.api('vvipclub_distributeBean_startAssist', {"activityIdEncrypted": res.data.id, "channel": "FISSION_BEAN"})
      this.o2s(res)

      if (res.success) {
        console.log(`开团成功，结束时间：${res.data.endTime}`)
        res = await this.api('distributeBeanActivityInfo', {"paramData": {"channel": "FISSION_BEAN"}})
        shareCodeSelf.push({
          assistStartRecordId: res.data.assistStartRecordId,
          encPin: res.data.encPin,
          id: res.data.id,
        })
      }
    } else if (res.data.assistedRecords.length === res.data.assistNum) {
      console.log('已成团')
      if (res.data.canStartNewAssist) {
        res = await this.api('vvipclub_distributeBean_startAssist', {"activityIdEncrypted": res.data.id, "channel": "FISSION_BEAN"})
        if (res.success) {
          console.log(`开团成功，结束时间：${res.data.endTime}`)
          res = await this.api('distributeBeanActivityInfo', {"paramData": {"channel": "FISSION_BEAN"}})
          shareCodeSelf.push({
            assistStartRecordId: res.data.assistStartRecordId,
            encPin: res.data.encPin,
            id: res.data.id,
          })
        }
      }
    } else if (!res.data.canStartNewAssist) {
      console.log('不可开团')
    }
  }

  async help(users: User[]) {
    this.o2s(shareCodeSelf, '内部助力')
    for (let user of users) {
      this.user = user
      this.user.UserAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac`
      if (shareCodeHW.length === 0) {
        shareCodeHW = await this.getshareCodeHW('zjd');
      }
      shareCode = user.index === 0
        ? Array.from(new Set([...shareCodeHW, ...shareCodeSelf]))
        : Array.from(new Set([...shareCodeSelf, ...shareCodeHW]))

      let fp: any = await this.getFp()
      this.h5stTool = new H5ST('b9790', this.user.UserAgent, fp, 'https://servicewechat.com/wxa5bf5ee667d91626/173/page-frame.html', 'https://servicewechat.com', this.user.UserName)
      await this.h5stTool.__genAlgo()
      for (let code of shareCode) {
        try {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${JSON.stringify(code)}`)
          let res: any = await this.api('vvipclub_distributeBean_assist', {"assistStartRecordId": code.assistStartRecordId, "assistedPinEncrypted": code.encPin, "activityIdEncrypted": code.id, "channel": "FISSION_BEAN"})
          if (res.success) {
            console.log('助力成功')
          } else if (res.resultCode === '9200008') {
            console.log('不能助力自己')
          } else if (res.resultCode === '90000014') {
            console.log('上限')
            break
          } else if (res.resultCode === '2400205') {
            console.log('对方已成团')
          } else if (res.resultCode === '9200011') {
            console.log('已助力过')
          } else {
            this.o2s(res, 'vvipclub_distributeBean_assist')
          }
        } catch (e) {
          console.log(e)
          break
        }
      }
    }
  }
}

new Zjd().init().then()