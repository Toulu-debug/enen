import {JDHelloWorld, User} from "./TS_JDHelloWorld";

class Jd_necklace extends JDHelloWorld {
  cookie: string
  random: string = ''
  log: string = ''

  constructor() {
    super()
  }

  async init() {
    await this.run(this)
  }

  async getLog(key: string): Promise<void> {
    let data: any = await this.get(`http://127.0.0.1/?key=${key}`)
    this.random = data.match(/"random":"(\d+)"/)[1]
    this.log = data.match(/"log":"(.*)"/)[1]
  }

  async api(fn: string, body: object) {
    return this.post(`https://api.m.jd.com/api?appid=coupon-necklace&functionId=${fn}&loginType=2&t=${Date.now()}`, new URLSearchParams({
      'body': JSON.stringify({
        "extraData": {
          "log": this.log,
          "sceneid": "DDhomePageh5"
        },
        "random": this.random,
        ...body
      })
    }), {
      'Host': 'api.m.jd.com',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': "jdapp;android;10.5.4;;;appBuild/96906;ef/1;ep/%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1654346742272%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22sv%22%3A%22CJO%3D%22%2C%22ad%22%3A%22ZWDuCwU2DQYzYWCyZWO4Yq%3D%3D%22%2C%22od%22%3A%22%22%2C%22ov%22%3A%22CzK%3D%22%2C%22ud%22%3A%22ZWDuCwU2DQYzYWCyZWO4Yq%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; sdk_gphone_arm64 Build/RSR1.201216.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36",
      'Referer': 'https://h5.m.jd.com/',
      'Cookie': this.cookie,
    })
  }

  async main(user: User) {
    this.cookie = user.cookie
    let res: any = await this.api('necklace_taskHomePage', {}), data: any
    this.o2s(res)

    for (let t of res.data.result.taskConfigVos) {
      if ([416, 417, 418, 420].includes(t.id) && t.taskStage === 0) {
        console.log(t.taskName)
        await this.getLog(`necklace_startTask_${t.id}`)
        data = await this.api('necklace_startTask', {"taskId": t.id})
        if (data.rtn_code !== 403) {
          console.log('任务领取成功')
        } else {
          console.log(data.rtn_msg)
          break
        }
        await this.wait(2000)
      }
    }
  }
}

new Jd_necklace().init().then()