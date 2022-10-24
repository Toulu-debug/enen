import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st_pro";
import * as JDJRValidator from './utils/validate_single'
import {differenceInMinutes, format} from "date-fns";

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
      if (!this.fp) {
        console.log('FP_D7BFE undefined')
        process.exit(0)
      }
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
    for (let key of Object.keys(body)) params += '&' + key + '=' + body[key]
    let beforeApiRes = await this.get(`https://api.m.jd.com/api?client=iOS&clientVersion=11.3.0&appid=jdchoujiang_h5&t=${timestamp}&functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&h5st=${h5st}${params}`, {
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/json',
      'Origin': 'https://h5.m.jd.com',
      'Cookie': this.user.cookie,
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://h5.m.jd.com/',
    })
    if (JSON.stringify(beforeApiRes).includes("请进行验证")) {
      let {validate} = await new JDJRValidator.JDJRValidator().start()
      console.log('validate', validate)
      return await this.beforeApi(fn, {...body, validate})
    } else {
      return beforeApiRes
    }
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

      // feed
      let petFood: number = res.data.petFood
      let lastFeedTime: number = res.data.lastFeedTime
      console.log('狗粮', petFood)
      console.log('lastFeedTime', format(lastFeedTime, "yyyy-MM-dd HH:mm:ss"))
      let feedCount: number = 0
      for (let t of [10, 20, 40, 80]) {
        if (petFood < t) {
          break
        } else {
          feedCount = t
        }
      }
      if (differenceInMinutes(Date.now(), lastFeedTime) > 180 && feedCount) {
        this.h5stTool = new H5ST('15dc2', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
        await this.h5stTool.__genAlgo()
        res = await this.beforeApi('feed', {"feedCount": feedCount, "reqSource": "h5"})
        console.log(res.errorCode)
        await this.wait(3000)
      }

      res = await this.beforeApi('combatDetail', {"help": false, "reqSource": "h5"})
      this.o2s(res, 'combatDetail')
      if (res.data.petRaceResult === 'participate') {
        console.log('比赛中')
        for (let raceUser of res.data.raceUsers) {
          raceUser.myself
            ? console.log(raceUser.nickName, raceUser.distance)
            : console.log('对手', raceUser.distance)
        }
      } else if (res.data.petRaceResult === 'not_participate') {
        console.log('开始匹配')
        this.h5stTool = new H5ST('79b06', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
        await this.h5stTool.__genAlgo()
        data = await this.beforeApi('clickIcon', {"code": "1624363341529274068136", "iconCode": "race_match", "reqSource": "h5"})
        this.h5stTool = new H5ST('d91e0', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
        await this.h5stTool.__genAlgo()
        data = await this.beforeApi('clickIconNew', {"iconCode": "race_match", "reqSource": "h5"})

        this.h5stTool = new H5ST('6f192', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
        await this.h5stTool.__genAlgo()
        data = await this.beforeApi('combatMatch', {"teamLevel": "2", "reqSource": "h5"})
        this.o2s(data, 'combatMatch')
      } else if (res.data.petRaceResult === 'unreceive') {
        let winCoin: number = res.data.winCoin
        this.h5stTool = new H5ST('04889', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
        await this.h5stTool.__genAlgo()
        data = await this.beforeApi('combatReceive', {"reqSource": "h5"})
        console.log('赛跑获胜', winCoin)
      }

      this.h5stTool = new H5ST('922a5', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
      await this.h5stTool.__genAlgo()
      res = await this.api('petGetPetTaskConfig', {"reqSource": "h5"})
      this.o2s(res, 'petGetPetTaskConfig')
      await this.wait(2000)

      for (let t of res.datas) {
        if (t.followShops) {
          this.h5stTool = new H5ST('79b06', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
          await this.h5stTool.__genAlgo()
          data = await this.beforeApi('clickIcon', {"code": "1624363341529274068136", "iconCode": "follow_shop", "reqSource": "h5"})
          this.h5stTool = new H5ST('d91e0', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
          await this.h5stTool.__genAlgo()
          data = await this.beforeApi('clickIconNew', {"iconCode": "follow_shop", "reqSource": "h5"})

          for (let followShops of t.followShops) {
            if (followShops.status) continue
            console.log(t.taskName, followShops.name)
            this.h5stTool = new H5ST('79b06', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.beforeApi('clickIcon', {"code": "1624363341529274068136", "iconCode": "follow_shop", "linkAddr": followShops.shopId.toString(), "reqSource": "h5"})

            this.h5stTool = new H5ST('d91e0', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.beforeApi('clickIconNew', {"iconCode": "follow_shop", "linkAddr": followShops.shopId.toString(), "reqSource": "h5"})

            this.h5stTool = new H5ST('30717', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.api('followShopColor', {'shopId': followShops.shopId.toString(), 'reqSource': 'h5'})
            console.log('followShopColor', data.errorCode)
          }
        }

        if (t.followChannelList) {
          this.h5stTool = new H5ST('d91e0', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
          await this.h5stTool.__genAlgo()
          data = await this.beforeApi('clickIconNew', {"iconCode": "follow_channel", "reqSource": "h5"})
          this.h5stTool = new H5ST('5f8cb', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
          await this.h5stTool.__genAlgo()
          data = await this.api('getFollowChannels', {"reqSource": "h5"})
          await this.wait(1000)

          for (let followChannelList of t.followChannelList) {
            if (followChannelList.status) continue
            console.log(t.taskName, followChannelList.channelName)
            this.h5stTool = new H5ST('79b06', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.beforeApi('clickIcon', {"code": "1624363341529274068136", "iconCode": "follow_channel", "linkAddr": followChannelList.channelId, "reqSource": "h5"})

            this.h5stTool = new H5ST('d91e0', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.beforeApi('clickIconNew', {"code": "1624363341529274068136", "iconCode": "follow_channel", "linkAddr": followChannelList.channelId, "reqSource": "h5"})

            this.h5stTool = new H5ST('30717', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.api('scan', {'channelId': followChannelList.channelId, 'taskType': 'FollowChannel', 'sid': '66594924', 'reqSource': 'h5'})
            console.log('scan', data.errorCode)
            await this.wait(5000)
          }
        }

        if (t.scanMarketList) {
          for (let scanMarketList of t.scanMarketList) {
            if (scanMarketList.status) continue
            console.log(t.taskName, scanMarketList.marketName)

            this.h5stTool = new H5ST('79b06', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.beforeApi('clickIcon', {"code": "1624363341529274068136", "iconCode": "scan_market", "linkAddr": scanMarketList.marketLinkH5, "reqSource": "h5"})

            this.h5stTool = new H5ST('d91e0', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.beforeApi('clickIconNew', {"iconCode": "scan_market", "linkAddr": scanMarketList.marketLinkH5, "reqSource": "h5"})

            this.h5stTool = new H5ST('30717', this.user.UserAgent, this.fp, "https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html", "https://h5.m.jd.com/")
            await this.h5stTool.__genAlgo()
            data = await this.api('scan', {"marketLink": scanMarketList.marketLinkH5, "marketId": scanMarketList.marketLinkH5, "taskType": "ScanMarket", "sid": "66594924", "reqSource": "h5"})
            console.log('scanMarketList', data.errorCode)
            await this.wait(5000)
          }
        }

        if (t.receiveStatus === 'unreceive') {
          data = await this.api('getFood', {"taskType": t.taskType, "reqSource": "h5"})
          console.log('领取奖励', t.taskName, data.data)
          await this.wait(1000)
        }
      }
    } catch (e) {
      console.log(e.message)
    }
  }
}

new Cww().init().then()