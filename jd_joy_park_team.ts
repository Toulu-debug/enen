/**
 * 汪汪乐园-跑步+组队
 * cron: 20 * * * *
 * export FP_448DE=""
 * export FP_B6AC3=""
 */

import {H5ST} from "./utils/h5st2"
import {JDHelloWorld, User} from "./TS_JDHelloWorld";

class Joy_Park_Run extends JDHelloWorld {
  teamTool: H5ST
  user: User
  captainId: string | number

  constructor() {
    super()
    this.captainId = 'IReO3ad-dyrjil-pq4FZeg'
  }

  async init() {
    await this.run(this)
  }

  async team(fn: string, body: object) {
    let timestamp: number = Date.now(), h5st: string
    h5st = this.teamTool.__genH5st({
      appid: "activities_platform",
      body: JSON.stringify(body),
      client: "ios",
      clientVersion: "3.9.2",
      functionId: fn,
      t: timestamp.toString()
    })
    return await this.get(`https://api.m.jd.com/?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&t=${timestamp}&appid=activities_platform&client=ios&clientVersion=3.9.2&cthr=1&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'User-Agent': 'jdltapp;iPhone;3.9.2;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;',
      'Origin': 'https://h5platform.jd.com',
      'X-Requested-With': 'com.jd.jdlite',
      'Referer': 'https://h5platform.jd.com/',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    this.user = user
    try {
      this.teamTool = new H5ST('448de', 'jdltapp;iPhone;3.9.2;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;', process.env.FP_448DE || '')
      await this.teamTool.__genAlgo()
      let res: any

      res = await this.team('runningTeamInfo', {"linkId": "L-sOanK_5RJCz7I314FpnQ"})
      if (!this.captainId) {
        if (res.data.members.length === 0) {
          console.log('成为队长')
          this.captainId = res.data.captainId
        } else if (res.data.members.length !== 6) {
          console.log('队伍未满', res.data.members.length)
          this.captainId = res.data.captainId
        } else {
          console.log('队伍已满')
        }
      // } else if (this.captainId && res.data.members.length === 0) {
      } else if (this.captainId) {
        console.log('已有组队ID，未加入队伍')
        res = await this.team('runningJoinTeam', {"linkId": "L-sOanK_5RJCz7I314FpnQ", "captainId": this.captainId})
        if (res.code === 0) {
          console.log('组队成功')
          for (let member of res.data.members) {
            if (member.captain) {
              console.log('队长', member.nickName)
              break
            }
          }
          if (res.data.members.length === 6) {
            console.log('队伍已满')
            this.captainId = ''
          }
        } else {
          this.o2s(res, '组队失败')
        }
      } else {
        console.log('已组队', res.data.members.length)
        console.log('战队收益', res.data.teamSumPrize)
      }
    } catch (e) {
      console.log('Error', e.message)
      await this.wait(3000)
    }
  }
}

new Joy_Park_Run().init().then()