import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {JSDOM, ResourceLoader, VirtualConsole} from "jsdom";
import {readFileSync} from "fs";
import CryptoJS from "crypto-js";

class Jd_fruit_help extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []
  appId: string
  h5stTool: any

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async h5stToolInit() {
    let dom = new JSDOM(`<body><script>${readFileSync('utils/h5st_47.js').toString()}</script></body>`, {
      url: "http://localhost",
      userAgent: this.user.UserAgent,
      runScripts: "dangerously",
      resources: new ResourceLoader({
        userAgent: this.user.UserAgent
      }),
      includeNodeLocations: true,
      storageQuota: 1000000000,
      pretendToBeVisual: true,
      virtualConsole: new VirtualConsole()
    })
    this.h5stTool = new dom.window.ParamsSign({appId: this.appId})
  }

  async api(fn: string, body: object) {
    let t = Date.now(), h5st: string = (await this.h5stTool.sign({
      appid: 'hot_channel',
      body: CryptoJS.SHA256(JSON.stringify(body)).toString(CryptoJS.enc.Hex),
      client: 'android',
      clientVersion: '9.17.240',
      functionId: fn,
      timestamp: t.toString()
    })).h5st
    return await this.post('https://api.m.jd.com/wxsport_hbrain_draw', `functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&appid=hot_channel&timestamp=${t}&client=android&clientVersion=9.17.240&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'User-Agent': this.user.UserAgent,
      'Cookie': this.user.cookie,
      'xweb_xhr': '1',
      'X-Rp-Client': 'mini_2.0.0',
      'X-Referer-Package': 'wx91d27dbf599dff74',
      'wqreferer': 'http://wq.jd.com/wxapp/pages/index/index',
      'X-Referer-Page': '/pages/index/index',
      'Referer': 'https://servicewechat.com/wx91d27dbf599dff74/752/page-frame.html'
    })
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X ${this.getIosVer()}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF MacWechat/3.8.8(0x13080811) XWEB/1216`
      this.appId = 'd983f'
      await this.h5stToolInit()
      let res: any = await this.api('wxsport_hbrain_draw', {})
      this.o2s(res)
    } catch (e) {
      console.log('获取失败', e)
    }
    await this.wait(5000)
  }
}

new Jd_fruit_help().init().then()