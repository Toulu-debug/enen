/**
 * 新版农场
 * cron: 15 8-10,18-20 * * *
 */

import {H5ST_42} from './utils/h5st_4.2'
import {User, JDHelloWorld} from "./TS_JDHelloWorld"

class Jd_farm extends JDHelloWorld {
  user: User
  fp41: string
  appId: string
  shareCodeSelf: string[] = []
  h5stTool: H5ST_42

  constructor() {
    super();
  }

  async init() {
    this.fp41 = await this.getFp4_1()
    await this.run(this)
  }

  async api(fn: string, body: object): Promise<{}> {
    let timestamp: number = Date.now()
    let h5st: string = this.h5stTool.h5st({
      appid: 'signed_wh5',
      body: body,
      client: '',
      clientVersion: '1.0.0',
      functionId: fn,
      t: timestamp
    })
    return await this.post('https://api.m.jd.com/client.action',
      `appid=signed_wh5&client=&clientVersion=1.0.0&t=${timestamp}&body=${JSON.stringify(body)}&functionId=${fn}&h5st=${h5st}`,
      {
        'authority': 'api.m.jd.com',
        'cookie': this.user.cookie,
        'origin': 'https://h5.m.jd.com',
        'referer': 'https://h5.m.jd.com/',
        'user-agent': this.user.UserAgent,
        'x-referer-page': 'https://h5.m.jd.com/pb/015686010/Bc9WX7MpCW7nW9QjZ5N3fFeJXMH/index.html',
        'x-rp-client': 'h5_1.0.0'
      }
    )
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `jdapp;iPhone;12.2.2;;;M/5.0;appBuild/168923;jdSupportDarkMode/0;ef/1;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
      let res: any, data: any
      this.appId = 'c57f6'
      this.h5stTool = new H5ST_42(this.appId, this.user.UserAgent, this.user.UserName, 'https://h5.m.jd.com/pb/015686010/Bc9WX7MpCW7nW9QjZ5N3fFeJXMH/index.html', 'https://h5.m.jd.com')
      await this.h5stTool.algo()

      res = await this.api('farm_home', {"version": 1})
      this.o2s(res)

      let bottleWater: number = res.data.result.bottleWater
      console.log('💧', bottleWater)
      let inviteCode: string = res.data.result.farmHomeShare.inviteCode
      console.log('助力码', inviteCode)
      this.shareCodeSelf.push(inviteCode)

      res = await this.api('farm_task_list', {"version": 1, "channel": 0})
      this.appId = '28981'
      this.h5stTool = new H5ST_42(this.appId, this.user.UserAgent, this.user.UserName, 'https://h5.m.jd.com/pb/015686010/Bc9WX7MpCW7nW9QjZ5N3fFeJXMH/index.html', 'https://h5.m.jd.com')
      await this.h5stTool.algo()

      for (let t of res.data.result.taskList) {
        if (t.taskType.includes('BROWSE')) {
          if (!t.taskDoTimes) {
            let taskSourceUrl: string = t.taskSourceUrl, taskInsert: boolean = false
            if (!t.taskSourceUrl) {
              data = await this.api('farm_task_detail', {"version": 1, "taskType": t.taskType, "taskId": t.taskId, "channel": 0})
              taskSourceUrl = data.data.result.taskDetaiList[0].itemId
              taskInsert = true
            }
            console.log('开始任务', t.mainTitle)
            data = await this.api('farm_do_task', {
              "version": 1, "taskType": t.taskType, "taskId": t.taskId, "taskInsert": taskInsert, "itemId": Buffer.from(taskSourceUrl, 'utf8').toString('base64'), "channel":
                0
            })
            await this.wait(3000)
            data.data.bizCode === 0 ? console.log('任务完成') : console.log('任务失败', data)
          }
        }
      }

      res = await this.api('farm_task_list', {"version": 1, "channel": 0})
      this.appId = '33e0f'
      this.h5stTool = new H5ST_42(this.appId, this.user.UserAgent, this.user.UserName, 'https://h5.m.jd.com/pb/015686010/Bc9WX7MpCW7nW9QjZ5N3fFeJXMH/index.html', 'https://h5.m.jd.com')
      await this.h5stTool.algo()

      for (let t of res.data.result.taskList) {
        if (t.taskStatus === 2) {
          data = await this.api('farm_task_receive_award', {"version": 1, "taskType": t.taskType, "taskId": t.taskId, "channel": 0})
          console.log('领取奖励💧', data.data.result.taskAward[0].awardValue)
          await this.wait(2000)
        }
      }
      // farm_water {"version":1,"waterType":1} 28981

      // this.h5st41 = new H5ST('deba1', this.fp41, this.user.UserAgent, this.user.UserName, 'https://pro.m.jd.com/mall/active/37KFb2rZywRxkAeiCGrE57oring8/index.html', 'https://pro.m.jd.com')
      // await this.h5st41.genAlgo()
      // res = await this.old('dongDongFarmSignHome', {"linkId": "LCH-fV7hSnChB-6i5f4ayw"})
      // this.o2s(res)
    } catch (e) {
      console.log(e.message)
      await this.wait(30000)
    }
  }

  async help(users: User[]): Promise<void> {
    let res: any
    this.appId = '28981'
    for (let user of users) {
      try {
        this.user = user
        this.user.UserAgent = `jdapp;iPhone;12.2.2;;;M/5.0;appBuild/168923;jdSupportDarkMode/0;ef/1;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
        this.h5stTool = new H5ST_42(this.appId, this.user.UserAgent, this.user.UserName, 'https://h5.m.jd.com/pb/015686010/Bc9WX7MpCW7nW9QjZ5N3fFeJXMH/index.html', 'https://h5.m.jd.com')
        await this.h5stTool.algo()

        let shareCodePool: string[] = await this.getShareCodePool('farm2', 50)
        let shareCode: string[] = Array.from(new Set([...this.shareCodeSelf, ...shareCodePool]))
        for (let code of shareCode) {
          try {
            console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code} ${this.shareCodeSelf.includes(code) ? '*内部*' : ''}`)
            res = await this.api('farm_assist', {"version": 1, "inviteCode": code, "shareChannel": "ttt7", "assistChannel": ""})
            this.o2s(res, '助力结果')
            if (res.code === 0 && res.data.bizCode === 0) {
              console.log('助力成功')
            } else if (res.code === 0 && res.data.bizCode !== 0) {
              console.log(res.data.bizMsg)
            } else {
              console.log(res)
            }
          } catch (e) {
            console.log(e.message)
          }
          await this.wait(5000)
        }
      } catch (e) {
        console.log(e)
      }
      await this.wait(60000)
    }
  }
}

new Jd_farm().init().then()