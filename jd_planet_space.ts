/**
 * 515券民空间站
 * CK1 -> 优先HW.ts
 */

import {JDHelloWorld, User} from "./JDHelloWorld2";

class Planet_Space extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(new Planet_Space(), this.help)
  }

  async api(fn: string, body: object) {
    return await this.post(`https://api.m.jd.com/api?functionId=${fn}&appid=coupon-space&client=wh5&t=${Date.now()}`, `body=${encodeURIComponent(JSON.stringify(body))}`, {
      'Host': 'api.m.jd.com',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': 'jdapp;',
      'Referer': 'https://h5.m.jd.com/',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    this.user = user
    let res: any
    for (let i = 0; i < 4; i++) {
      res = await this.api('explorePlanet_taskList', {"activityId": 1})
      let encryptProjectId: string = res.data.result.componentTaskPid
      let remain: boolean = res.data.result.componentTaskInfo.some(item => !item.taskDesc.includes('加入品牌') && item.completedItemCount !== item.groupItemCount)
      console.log(remain)
      if (remain) {
        for (let t of res.data.result.componentTaskInfo) {
          if (t.completedItemCount !== t.groupItemCount && !t.taskDesc.includes('加入品牌')) {
            console.log(t.taskDesc)
            console.log(t.taskDesc)
            res = await this.api('explorePlanet_taskReport', {"activityId": 1, "encryptTaskId": t.encryptTaskId, "encryptProjectId": encryptProjectId, "itemId": t.itemId})
            await this.wait(t.waitDuration || 1000)
            this.o2s(res)
          }
        }
        await this.wait(3000)
      } else {
        break
      }
    }
    console.log('===')

    res = await this.api('explorePlanet_taskList', {"activityId": 1})
    let code: string
    if (!res.result?.assistTaskInfo?.groupId) {
      res = await this.api('explorePlanet_openGroup', {"activityId": 1})
      code = res.data.result.groupId
    } else {
      code = res.result.assistTaskInfo.groupId
    }
    console.log('助力码', code)
    this.shareCodeSelf.push(code)
  }

  async help(users: User[]) {
    let full: string[] = ['b'], shareCodeHW: string[] = []
    for (let user of users) {
      this.user = user
      if (shareCodeHW.length === 0) {
        shareCodeHW = await this.getshareCodeHW('space');
      }
      let shareCode = user.index === 0
        ? Array.from(new Set([...shareCodeHW, ...this.shareCodeSelf]))
        : Array.from(new Set([...this.shareCodeSelf, ...shareCodeHW]))

      console.log(`\n开始【京东账号${user.index + 1}】${user.UserName}\n`)

      for (let code of shareCode) {
        if (full.includes(code))
          continue
        try {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code}`)
          let res: any = await this.api('explorePlanet_assist', {"activityId": "1", "groupId": code})
          console.log(res.data.biz_msg)
          if (res.data.biz_msg === '今日助力机会已用完，去完成自己的活动吧') {
            console.log('上限')
            break
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

new Planet_Space().init().then()