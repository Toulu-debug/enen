import {User, JDHelloWorld} from "./TS_JDHelloWorld";

class Health extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []
  shareCodePool: string [] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(new Health, this.help)
  }

  async api(fn: string, body: object) {
    return await this.post('https://api.m.jd.com/', `functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&uuid=`, {
      'Host': 'api.m.jd.com',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://h5.m.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': this.user.cookie
    })
  }

  async runTimes(code: string) {
    try {
      let data = await this.get(`https://sharecodepool.cnmb.win/api/runTimes0917?activityId=health&sharecode=${code}`)
      console.log(data)
    } catch (e) {
      await this.wait(5000)
    }
  }

  async main(user: User) {
    this.user = user
    let res: any
    res = await this.api('jdhealth_getHomeData', {})
    if (!res.data?.result) {
      return
    }
    if (res.data.result.popupInfo.continuousSignInfo) {
      res = await this.api('jdhealth_collectScore', {"taskToken": res.data.result.popupInfo.continuousSignInfo.signInTaskToken, "taskId": res.data.result.continuousSignTaskId, "actionType": "0"})
      if (res.data.bizCode === 0) {
        console.log('签到成功', res.data.result.acquiredScore)
      }
    }
    for (let i = 0; i < 3; i++) {
      res = await this.api('jdhealth_getTaskDetail', {"buildingId": "", "taskId": "", "channelId": 1})
      try {
        for (let t of res.data.result.taskVos) {
          if (t.status === 1 || t.status === 3) {
            console.log(t.taskName)
            if (t.taskName.includes('打卡') && t.threeMealInfoVos[0].status === 1) {
              let data: any = await this.api('jdhealth_collectScore', {"taskToken": t.threeMealInfoVos[0].taskToken, "taskId": t.taskId, "actionType": 0})
              if (res.data.bizCode === 0)
                console.log('打卡成功', parseInt(data.data.result.score))
              else
                console.log('打卡失败', data.data.bizMsg)
              await this.wait(3000)
            }

            for (let tp of t.productInfoVos || t.followShopVo || t.shoppingActivityVos || []) {
              if (tp.status === 1) {
                console.log('\t', tp.skuName || tp.shopName || tp.title)
                if (t.waitDuration) {
                  res = await this.api('jdhealth_collectScore', {"taskToken": tp.taskToken, "taskId": t.taskId, "actionType": 1})
                  console.log('\t', res.data.bizMsg)
                  await this.wait(t.waitDuration * 1000 + 1000)
                }
                res = await this.api('jdhealth_collectScore', {"taskToken": tp.taskToken, "taskId": t.taskId, "actionType": 0})
                if (res.data.bizMsg.includes('做完')) {
                  console.log(res.data.bizMsg)
                  break
                } else {
                  console.log(res.data.bizMsg, parseInt(res.data.result.score))
                  await this.wait(3000)
                }
              }
            }
            await this.wait(3000)
          }
        }
      } catch (e) {
        console.log('Error', e)
      }
      await this.wait(10000)
    }
  }

  async help(users: User[]) {
    let res: any
    for (let user of users) {
      this.user = user
      console.log(`\n开始【京东账号${user.index + 1}】${user.UserName}\n`)
      res = await this.api('jdhealth_getTaskDetail', {"buildingId": "", "taskId": 6, "channelId": 1})
      try {
        let code: string = res.data.result.taskVos[0].assistTaskDetailVo.taskToken
        console.log('助力码', code)
        this.shareCodeSelf.push(code)
        await this.runTimes(code)
      } catch (e) {
      }
    }
    this.o2s(this.shareCodeSelf, '内部助力码')

    for (let user of users) {
      this.user = user
      this.shareCodePool = await this.getShareCodePool('health', 1)
      let shareCode: string[] = Array.from(new Set([...this.shareCodeSelf, ...this.shareCodePool])), full: string[] = []

      for (let code of shareCode) {
        if (full.includes(code))
          continue
        console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code}`)
        res = await this.api('jdhealth_collectScore', {"taskToken": code, "taskId": "6", "actionType": 0})
        try {
          if (res.data.bizMsg === '助力失败丨啊哦您今日的爱心值已爆棚，明天继续吧') {
            break
          } else if (res.data.bizMsg === '助力失败丨助力已满员！谢谢你哦~') {
            full.push(code)
          } else {
            console.log(res.data.bizMsg)
          }
        } catch (e) {
          this.o2s(res, 'jdhealth_collectScore catch')
        } finally {
          await this.wait(3000)
        }
      }
    }
  }
}

new Health().init().then()
