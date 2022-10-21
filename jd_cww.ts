import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st_3.1";
import * as JDJRValidator from './utils/validate_single'

class Cww extends JDHelloWorld {
  user: User
  h5stTool: H5ST
  shareCodeSelf: string[] = []
  fp: any = undefined

  constructor() {
    super();
  }

  async init() {
    try {
      this.fp = process.env.FP_D7BFE
    } catch (e) {
      console.log(e.message)
    }
    await this.run(this)
  }

  async beforeApi(fn: string, body: object) {
    let timestamp: string = Date.now().toString();
    let h5st: string = await this.h5stTool.__genH5st({
      'appid': 'jdchoujiang_h5',
      'body': JSON.stringify(body),
      'client': 'iOS',
      'clientVersion': '11.3.0',
      'functionId': fn,
      't': timestamp.toString()
    })
    let params: string = ''
    for (let key of Object.keys(body)) {
      params += '&' + key + '=' + body[key]
    }
    return await this.get(`https://api.m.jd.com/api?client=iOS&clientVersion=11.3.0&appid=jdchoujiang_h5&t=${timestamp}&functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&h5st=${h5st}${params}`, {
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/json',
      'Origin': 'https://h5.m.jd.com',
      'Cookie': this.user.cookie,
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://h5.m.jd.com/',
    })
  }

  async api(fn: string, body: object) {
    let timestamp: string = Date.now().toString();
    let h5st: string = await this.h5stTool.__genH5st({
      'appid': 'jdchoujiang_h5',
      'body': JSON.stringify(body),
      'client': '',
      'clientVersion': '',
      'functionId': fn,
      't': timestamp.toString()
    })
    let url: string = `https://api.m.jd.com/api?client=&clientVersion=&appid=jdchoujiang_h5&t=${timestamp}&functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&h5st=${h5st}`
    let res: any = await this.post(url, body, {
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/json',
      'Origin': 'https://h5.m.jd.com',
      'Cookie': this.user.cookie,
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://h5.m.jd.com/',
    })
    if (JSON.stringify(res).includes("请进行验证")) {
      let {validate} = await new JDJRValidator.JDJRValidator().start()
      console.log('validate', validate)
      return await this.api(fn, {...body, validate})
    } else {
      return res
    }
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `jdapp;iPhone;11.3.0;;;M/5.0;appBuild/167874;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
      let res: any, data: any

      this.h5stTool = new H5ST('2bba1', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
      await this.h5stTool.__genAlgo()
      res = await this.api('petEnterRoom', {"invitePin": "", "reqSource": "h5"})
      this.o2s(res, 'petEnterRoom')
      await this.wait(1000)

      res = await this.api('petGetPetTaskConfig', {"reqSource": "h5"})
      this.o2s(res, 'petGetPetTaskConfig')
      await this.wait(2000)

      for (let t of res.datas) {
        // for (let followShops of t.followShops || []) {
        //   data = await this.api('followShopColor', {
        //     'shopId': followShops.shopId,
        //     'reqSource': 'h5'
        //   })
        //   this.o2s(data)
        //   await this.wait(5000)
        // }

        if (t.followChannelList) {
          this.h5stTool = new H5ST('d91e0', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
          await this.h5stTool.__genAlgo()
          data = await this.beforeApi('clickIconNew', {"iconCode": "follow_channel", "reqSource": "h5"})
          this.o2s(data, 'clickIconNew')
          await this.wait(1000)

          this.h5stTool = new H5ST('5f8cb', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
          await this.h5stTool.__genAlgo()
          data = await this.api('getFollowChannels', {"reqSource": "h5"})
          this.o2s(data, 'getFollowChannels')
          await this.wait(1000)

          for (let followChannelList of t.followChannelList) {
            this.h5stTool = new H5ST('79b06', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.beforeApi('clickIcon', {"code": "1624363341529274068136", "iconCode": "follow_channel", "linkAddr": followChannelList.channelId, "reqSource": "h5"})

            this.h5stTool = new H5ST('d91e0', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.beforeApi('clickIconNew', {"code": "1624363341529274068136", "iconCode": "follow_channel", "linkAddr": followChannelList.channelId, "reqSource": "h5"})

            this.h5stTool = new H5ST('30717', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.api('scan', {
              'channelId': followChannelList.channelId,
              'taskType': 'FollowChannel',
              'sid': '66594924',
              'reqSource': 'h5'
            })
            console.log(data.errorCode)
            await this.wait(5000)
          }
        }
      }
      await this.wait(10000)
    } catch (e) {
      console.log(e.message)
    }
  }
}

new Cww().init().then()