/**
 * 极速版-挖宝
 * cron: 2 0,1,6 * * *
 * export FP_CE6C2=""
 * CK1 优先助力 HW.ts
 * TODO 提现
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st";

interface INVITE {
  inviter: string,
  inviteCode: string
}

class Jd_speed_wabao extends JDHelloWorld {
  cookie: string
  h5stTool: H5ST
  sharecode: INVITE[] = []
  shareCodesSelf: INVITE[] = []

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, body: object) {
    let timestamp: number = Date.now()
    let h5st: string = this.h5stTool.__genH5st({
      appid: 'activities_platform',
      body: JSON.stringify(body),
      client: 'H5',
      clientVersion: '1.0.0',
      functionId: fn,
      t: timestamp.toString(),
    })
    return await this.get(`https://api.m.jd.com/?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&t=${timestamp}&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'Origin': 'https://bnzf.jd.com',
      'User-Agent': `jdltapp;`,
      'Referer': 'https://bnzf.jd.com/',
      'Cookie': this.cookie
    })
  }

  async main(user: User) {
    this.cookie = user.cookie
    this.h5stTool = new H5ST("ce6c2", "jdltapp;", process.env.FP_CE6C2 ?? "9929056438203725")
    await this.h5stTool.__genAlgo()

    let res: any, data: any
    try {
      res = await this.api('happyDigHome', {"linkId": "pTTvJeSTrpthgk9ASBVGsw"})
      console.log('助力码', res.data.markedPin, res.data.inviteCode)
      this.shareCodesSelf.push({inviter: res.data.markedPin, inviteCode: res.data.inviteCode})

      res = await this.api('apTaskList', {"linkId": "pTTvJeSTrpthgk9ASBVGsw"})
      await this.wait(1000)
      for (let t of res.data) {
        if (t.taskType === 'BROWSE_CHANNEL' && t.taskDoTimes === 0 && t.taskLimitTimes === 1) {
          console.log(t.taskShowTitle)
          data = await this.api('apDoTask', {"linkId": "pTTvJeSTrpthgk9ASBVGsw", "taskType": "BROWSE_CHANNEL", "taskId": t.id, "channel": 4, "itemId": encodeURIComponent(t.taskSourceUrl), "checkVersion": false})
          await this.wait(1000)
          if (data.success) {
            console.log('任务完成')
          } else {
            this.o2s(data, '任务失败')
          }
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  }

  async help(users: User[]) {
    console.log('内部助力')
    this.o2s(this.shareCodesSelf)
    let res: any, shareCodesHW: any = [], shareCodes: any
    for (let user of users) {
      this.cookie = user.cookie
      console.log(`\n开始【京东账号${user.index + 1}】${user.UserName}\n`)

      try {
        await this.h5stTool.__genAlgo()
        if (shareCodesHW.length === 0) {
          shareCodesHW = await this.getshareCodeHW('fcwb')
        }
        if (user.index === 0) {
          shareCodes = [...shareCodesHW, ...this.shareCodesSelf]
        } else {
          shareCodes = [...this.shareCodesSelf, ...shareCodesHW]
        }

        for (let code of shareCodes) {
          console.log(`账号${user.index + 1} ${user.UserName} 去助力 ${code.inviteCode}`)
          res = await this.api('happyDigHelp', {"linkId": "pTTvJeSTrpthgk9ASBVGsw", "inviter": code.inviter, "inviteCode": code.inviteCode})
          if (res.code === 0) {
            console.log('助力成功')
            await this.wait(2000)
            break
          } else if (res.code === 16144) {
            console.log('上限')
            await this.wait(2000)
            break
          } else {
            console.log(res.code, res.errMsg)
            await this.wait(2000)
          }
        }
      } catch (e) {
        console.log('error', e)
      }
    }

    for (let user of users) {
      this.cookie = user.cookie
      console.log(`\n开始【京东账号${user.index + 1}】${user.UserName}\n`)
      await this.h5stTool.__genAlgo()
      res = await this.api('happyDigHome', {"linkId": "pTTvJeSTrpthgk9ASBVGsw"})
      let blood: number = res.data.blood, gameOver: boolean = false
      if (blood <= 1) gameOver = true
      console.log('❤️', blood)

      for (let round = 1; round < 4; round++) {
        if (gameOver) break
        for (let i = 0; i < 4; i++) {
          try {
            if (gameOver) {
              console.log('能量剩余1，跳过 A')
              break
            }
            for (let j = 0; j < 4; j++) {
              if (gameOver) {
                console.log('能量剩余1，跳过 B')
                break
              }
              res = await this.api('happyDigDo', {"round": round, "rowIdx": i, "colIdx": j, "linkId": "pTTvJeSTrpthgk9ASBVGsw"})

              if (res.data.chunk.type === 1) {
                console.log('👎')
              } else if (res.data.chunk.type === 2) {
                console.log('🧧', parseFloat(res.data.chunk.value))
              } else if (res.data.chunk.type === 3) {
                console.log('💰', parseFloat(res.data.chunk.value))
              } else if (res.data.chunk.type === 4) {
                console.log('💣')
              } else {
                this.o2s(res, '🤔️')
              }
              await this.wait(3000)

              res = await this.api('happyDigHome', {"linkId": "pTTvJeSTrpthgk9ASBVGsw"})
              console.log('❤️', res.data.blood)
              if (res.data.blood === 1) {
                gameOver = true
                console.log('能量剩余1，退出')
                break
              }
              await this.wait(2000)
            }
          } catch (e) {
            console.log('error', e)
            gameOver = true
          }
        }
      }
    }
  }
}

new Jd_speed_wabao().init().then()
