/**
 * cron: 20 9,18 * * *
 */

import {JDHelloWorld, User} from "./TS_JDHelloWorld";

class Jd_czl extends JDHelloWorld {
  user: User
  shareCodeSelf: { inviteId: string, mpin: string }[] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    if (fn === 'promote_collectScore')
      body = await this.body(body)
    return await this.post(`https://api.m.jd.com/client.action?functionId=${fn}`,
      `functionId=${fn}&client=m&clientVersion=-1&appid=signed_wh5&body=${JSON.stringify(body)}`, {
        'Host': 'api.m.jd.com',
        'Origin': 'https://wbbny.m.jd.com',
        'User-Agent': this.user.UserAgent,
        'Referer': 'https://wbbny.m.jd.com/',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': this.user.cookie
      })
  }

  async qryViewkitCallbackResult(fn: string, body: string | object) {
    return await this.post(`https://api.m.jd.com/client.action?functionId=${fn}&client=wh5`, typeof body === 'string' ? body : new URLSearchParams({'body': JSON.stringify(body)}), {
      'Host': 'api.m.jd.com',
      'Origin': 'https://wbbny.m.jd.com',
      'Referer': 'https://wbbny.m.jd.com/',
      'Cookie': this.user.cookie,
      'content-type': 'application/x-www-form-urlencoded',
      'User-Agent': this.user.UserAgent,
    })
  }

  async main(user: User) {
    this.user = user
    let res: any
    try {
      res = await this.qryViewkitCallbackResult('getEncryptedPinColor', 'functionId=getEncryptedPinColor&client=wh5&clientVersion=1.0.0&body={}')
      let mpin: string = res.result
      res = await this.api('promote_getTaskDetail', {"appSign": "3"})
      let inviteId: string = res.data.result.inviteId
      console.log('助力码', inviteId)
      this.shareCodeSelf.push({mpin, inviteId})
    } catch (e) {
      console.log(e.message)
    }
  }

  async help(users: User[]) {
    let shareCodeHW: any = [], shareCode: { inviteId: string, mpin: string }[] = []
    this.o2s(this.shareCodeSelf, '内部助力')
    let res: any
    for (let user of users) {
      try {
        if (shareCodeHW.length === 0) {
          shareCodeHW = await this.getshareCodeHW('ssy')
        }
        if (user.index === 0) {
          shareCode = [...shareCodeHW, ...this.shareCodeSelf]
        } else {
          shareCode = [...this.shareCodeSelf, ...shareCodeHW]
        }

        for (let code of shareCode) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code.inviteId}`)
          await this.api('promote_getHomeData', {"inviteId": code.inviteId})
          res = await this.qryViewkitCallbackResult('collectFriendRecordColor', `functionId=collectFriendRecordColor&client=wh5&clientVersion=1.0.0&body={"mpin":"${code.mpin}","businessCode":"20136","assistType":"1","shareSource":1}`)
          res = await this.api('promote_collectScore', {"actionType": "0", "inviteId": code.inviteId})
          await this.qryViewkitCallbackResult('collectFriendRecordColor', `functionId=collectFriendRecordColor&client=wh5&clientVersion=1.0.0&body={"mpin":"${code.mpin}","businessCode":"20136","assistType":"2","shareSource":1}`)

          if (res.data.bizCode === 0) {
            console.log('助力成功')
            if (res.data.result.times === 8) {
              console.log('上限')
              break
            }
          } else {
            console.log('助力失败', res.data.bizMsg)
          }
          await this.wait(3000)
        }
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}

new Jd_czl().init().then()