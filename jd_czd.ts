/**
 * cron: 15 9,15 * * *
 */

import {JDHelloWorld, User} from "./TS_JDHelloWorld";

class Zd extends JDHelloWorld {
  user: User
  shareCodeSelf: { inviteId: string, mpin: string }[] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
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
      res = await this.api('promote_pk_getHomeData', {})
      if (res.data.result.groupInfo?.memberList) {
        let memberNum: number = res.data.result.groupInfo.memberList.length
        console.log('当前队伍成员', memberNum)

        if (memberNum !== 30) {
          let groupJoinInviteId: string = res.data.result.groupInfo.groupJoinInviteId;
          res = await this.qryViewkitCallbackResult('getEncryptedPinColor', 'functionId=getEncryptedPinColor&client=wh5&clientVersion=1.0.0&body={}')
          console.log('队伍未满', groupJoinInviteId)
          this.shareCodeSelf.push({mpin: res.result, inviteId: groupJoinInviteId});
        }
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  async help(users: User[]) {
    let shareCodeHW: any = [], shareCode: { inviteId: string, mpin: string }[] = []
    this.o2s(this.shareCodeSelf)
    let res: any

    for (let user of users) {
      try {
        this.user = user

        res = await this.api('promote_pk_getHomeData', {})
        if (res.data.result?.groupInfo.memberList) {
          let memberNum: number = res.data.result.groupInfo.memberList.length
          console.log('当前队伍成员', memberNum)
          if (memberNum !== 1) {
            await this.wait(3000)
            continue
          }
        }

        if (shareCodeHW.length === 0) {
          shareCodeHW = await this.getshareCodeHW('ssyzd')
        }
        if (user.index === 0) {
          shareCode = [...shareCodeHW, ...this.shareCodeSelf]
        } else {
          shareCode = [...this.shareCodeSelf, ...shareCodeHW]
        }

        for (let code of shareCode) {
          console.log(`账号${user.index + 1} ${user.UserName} 去加入 ${code.inviteId}`)
          res = await this.api('promote_getHomeData', {"inviteId": code.inviteId})
          await this.qryViewkitCallbackResult('collectFriendRecordColor', `functionId=collectFriendRecordColor&client=wh5&clientVersion=1.0.0&body={"mpin":"${code.mpin}","businessCode":"20136","assistType":"1","shareSource":1}`)
          res = await this.api('promote_pk_joinGroup', {"inviteId": code.inviteId, "confirmFlag": "1"})
          await this.qryViewkitCallbackResult('collectFriendRecordColor', `functionId=collectFriendRecordColor&client=wh5&clientVersion=1.0.0&body={"mpin":"${code.mpin}","businessCode":"20136","assistType":"2","shareSource":1}`)

          if (res.data.bizCode === 0) {
            console.log('加入成功')
            break
          } else {
            console.log(res.data.bizMsg)
          }
          await this.wait(3000)
        }
      } catch (e) {
        console.log('error', e.message)
      }
    }
  }
}

new Zd().init().then()