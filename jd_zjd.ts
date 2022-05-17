/**
 * 小程序-赚京豆
 * cron: 15,30,45 0 * * *
 * export ZJD_OPEN=5  // 前n个账号开团, 默认全开
 * CK1 优先助力HW.ts
 */

import {zjdInit, zjdH5st} from "./utils/jd_zjd_tool.js";
import {SHA256} from "crypto-js";
import {JDHelloWorld, User} from "./TS_JDHelloWorld";

let shareCodeSelf: Tuan[] = [], shareCode: Tuan[] = [], shareCodeHW: any = []

interface Tuan {
  activityIdEncrypted: string, // id
  assistStartRecordId: string, // assistStartRecordId
  assistedPinEncrypted: string, // encPin unique
}

class Zjd extends JDHelloWorld {
  cookie: string
  openNum: number = 0
  zjd_open: number

  constructor() {
    super()
  }

  async init() {
    await this.run(new Zjd(), this.help, this.tips)
  }

  tips() {
    this.zjd_open = Number(process.env.ZJD_OPEN) || 100
    process.env.ZJD_OPEN ? console.log('自定义', this.zjd_open, '个账号开团') : ''
  }

  async api(fn: string, body: object) {
    let h5st = zjdH5st({
      'fromType': 'wxapp',
      'timestamp': Date.now(),
      'body0': JSON.stringify(body),
      'appid': 'swat_miniprogram',
      'body': SHA256(JSON.stringify(body)).toString(),
      'functionId': fn,
    })
    return this.post(`https://api.m.jd.com/api?functionId=${fn}&fromType=wxapp&timestamp=${Date.now()}`, `functionId=distributeBeanActivityInfo&body=${encodeURIComponent(JSON.stringify(body))}&appid=swat_miniprogram&h5st=${encodeURIComponent(h5st)}`, {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac',
      'referer': 'https://servicewechat.com/wxa5bf5ee667d91626/173/page-frame.html',
      'Cookie': this.cookie,
    })
  }

  async main(user: User) {
    this.cookie = user.cookie
    await zjdInit()
    let res: any = await this.api('distributeBeanActivityInfo', {"paramData": {"channel": "FISSION_BEAN"}})
    if (res.data.assistStatus === 1) {
      // 已开，没满
      console.log('已开团，', res.data.assistedRecords.length, '/', res.data.assistNum, '，剩余', Math.round(res.data.assistValidMilliseconds / 1000 / 60), '分钟')
      shareCodeSelf.push({
        activityIdEncrypted: res.data.id,
        assistStartRecordId: res.data.assistStartRecordId,
        assistedPinEncrypted: res.data.encPin,
      })
    } else if (res.data.assistStatus === 2 && res.data.canStartNewAssist && this.openNum < this.zjd_open) {
      // 没开团
      this.openNum++
      res = await this.api('vvipclub_distributeBean_startAssist', {"activityIdEncrypted": res.data.id, "channel": "FISSION_BEAN"})
      await this.wait(1000)
      if (res.success) {
        console.log(`开团成功，结束时间：${res.data.endTime}`)
        res = await this.api('distributeBeanActivityInfo', {"paramData": {"channel": "FISSION_BEAN"}})
        shareCodeSelf.push({
          activityIdEncrypted: res.data.id,
          assistStartRecordId: res.data.assistStartRecordId,
          assistedPinEncrypted: res.data.encPin,
        })
        await this.wait(1000)
      }
    } else if (res.data.assistedRecords.length === res.data.assistNum) {
      console.log('已成团')
      if (res.data.canStartNewAssist) {
        res = await this.api('vvipclub_distributeBean_startAssist', {"activityIdEncrypted": res.data.id, "channel": "FISSION_BEAN"})
        await this.wait(1000)
        if (res.success) {
          console.log(`开团成功，结束时间：${res.data.endTime}`)
          res = await this.api('distributeBeanActivityInfo', {"paramData": {"channel": "FISSION_BEAN"}})
          shareCodeSelf.push({
            activityIdEncrypted: res.data.id,
            assistStartRecordId: res.data.assistStartRecordId,
            assistedPinEncrypted: res.data.encPin,
          })
          await this.wait(1000)
        }
      }
    } else if (!res.data.canStartNewAssist) {
      console.log('不可开团')
    }
  }

  async help(users: User[]) {
    this.o2s(shareCodeSelf)
    await this.wait(2000)
    for (let user of users) {
      this.cookie = user.cookie
      if (shareCodeHW.length === 0) {
        shareCodeHW = await this.getshareCodeHW('zjd');
      }
      shareCode = user.index === 0
        ? Array.from(new Set([...shareCodeHW, ...shareCodeSelf]))
        : Array.from(new Set([...shareCodeSelf, ...shareCodeHW]))

      console.log(`\n开始【京东账号${user.index + 1}】${user.UserName}\n`)
      await zjdInit()
      for (let code of shareCode) {
        try {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code.assistedPinEncrypted.replace('\n', '')}`)

          let res: any = await this.api('vvipclub_distributeBean_assist', {"activityIdEncrypted": code.activityIdEncrypted, "assistStartRecordId": code.assistStartRecordId, "assistedPinEncrypted": code.assistedPinEncrypted, "channel": "FISSION_BEAN", "launchChannel": "undefined"})
          if (res.resultCode === '9200008') {
            console.log('不能助力自己')
          } else if (res.resultCode === '2400203' || res.resultCode === '90000014') {
            console.log('上限')
            break
          } else if (res.resultCode === '2400205') {
            console.log('对方已成团')
          } else if (res.resultCode === '9200011') {
            console.log('已助力过')
          } else if (res.success) {
            console.log('助力成功')
          } else {
            console.log('error', JSON.stringify(res))
          }
        } catch (e) {
          console.log(e)
          break
        }
        await this.wait(2000)
      }
      await this.wait(2000)
    }
  }
}

new Zjd().init().then()