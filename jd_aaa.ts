/**
 * cron: 0,30 21 * * *
 */

import {JDHelloWorld, User} from "./TS_JDHelloWorld";

class Cfd extends JDHelloWorld {
  user: User
  shareCodeSelf: { inviteId: string, mpin: string }[] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    if (['promote_pk_divideScores', 'promote_pk_getExpandDetail', 'promote_pk_collectPkExpandScore'].includes(fn)) {
      body = await this.body(body)
    }
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
      await this.wait(1000)

      res = await this.api('promote_pk_getHomeData', {})
      console.log('inflateMaxAward', res.data.result.inflateMaxAward)

      res = await this.api('promote_pk_getMsgPopup', {})
      this.o2s(res)

      if (res.data.result.length > 0 && res.data.result[0].divideResultVO) {
        console.log('红包', res.data.result[0].divideResultVO.divideValue * 1)
        console.log('金币', res.data.result[0].divideResultVO.scores)

        res = await this.api('promote_pk_divideScores', {"appSign": "3"})
        console.log('领取组队金币', res.data.result.produceScore * 1)
      }

      res = await this.api('promote_pk_getExpandDetail', {})
      if (res.data.bizCode === 0) {
        this.o2s(res)
        let inviteId: string = res.data.result.inviteId
        console.log('助力码', inviteId, mpin)
        console.log('还有', Math.floor(res.data.result.pkExpandDetailResult.remainTime / 60000), '分钟')
        this.shareCodeSelf.push({inviteId, mpin})

        for (let t of res.data.result.pkExpandDetailResult.pkExpandStageVOS) {
          console.log(`${t.assistNum}/${t.maxAssistNum}`)
        }
      } else {
        console.log(res.data.bizMsg)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  async help(users: User[]) {
    let shareCodeHW: any = [], shareCode: { inviteId: string, mpin: string }[] = []
    this.o2s(this.shareCodeSelf, '内部助力')
    await this.wait(5000)
    let res: any
    for (let user of users) {
      try {
        this.user = user
        if (shareCodeHW.length === 0) {
          shareCodeHW = await this.getshareCodeHW('ssypz')
        }
        if (user.index === 0) {
          shareCode = [...shareCodeHW, ...this.shareCodeSelf]
        } else {
          shareCode = [...this.shareCodeSelf, ...shareCodeHW]
        }

        for (let code of shareCode) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code.inviteId}`)
          res = await this.api('promote_pk_getHomeData', {"inviteId": code.inviteId})
          res = await this.qryViewkitCallbackResult('collectFriendRecordColor', `functionId=collectFriendRecordColor&client=wh5&clientVersion=1.0.0&body={"mpin":"${code.mpin}","businessCode":"20136","assistType":"1","shareSource":1}`)
          res = await this.api('promote_pk_collectPkExpandScore', {"actionType": "0", "inviteId": code.inviteId})

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
        console.log('error', e.message)
      }
    }

    for (let user of users) {
      try {
        this.user = user
        res = await this.api('promote_pk_receiveAward', {})
        res.data.bizCode === 0
          ? console.log('领取膨胀红包成功', res.data.result.value * 1)
          : console.log('领取膨胀红包失败', res.data.bizMsg)

      } catch (e) {
        console.log('error', e.message)
      }
      await this.wait(3000)
    }
  }
}

new Cfd().init().then()