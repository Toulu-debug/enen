/**
 * 京东快递更新通知
 * cron: 0 0-23/4 * * *
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld"
import {H5ST} from "./utils/h5st"
import {readFileSync, writeFileSync} from "fs"
import {sendNotify} from './sendNotify'

class Jd_track extends JDHelloWorld {
  user: User
  fp: string
  h5stTool: H5ST
  arr: { user: string, orderId: string, wareName: string, time: string, content: string }[]
  existOrderId: string[]
  msg: string = ''

  constructor() {
    super()
  }

  async init() {
    this.fp = await this.getFp4_1()
    this.arr = JSON.parse(readFileSync('json/jd_track.json').toString())
    this.existOrderId = this.arr.map(t => {
      return t.orderId
    })
    await this.run(this)
  }

  async api(body: object): Promise<any> {
    let ts: number = Date.now()
    let h5st: string = this.h5stTool.genH5st('new_order', body, 'mac', '3.8.2', 'common_order_list', ts)
    return await this.get(`https://api.m.jd.com/client.action?t=${ts}&loginType=2&loginWQBiz=golden-trade&appid=new_order&client=mac&clientVersion=3.8.2&functionId=common_order_list&body=${encodeURIComponent(JSON.stringify(body))}&h5st=${h5st}`, {
      'Host': 'api.m.jd.com',
      'xweb_xhr': '1',
      'X-Rp-Client': 'mini_2.0.0',
      'User-Agent': this.user.UserAgent,
      'X-Referer-Package': 'wx91d27dbf599dff74',
      'X-Referer-Page': '/pages/order_taro/pages/list/index',
      'Referer': 'https://servicewechat.com/wx91d27dbf599dff74/728/page-frame.html',
      'Cookie': this.user.cookie
    })
  }

  async main(user: User) {
    try {
      this.user = user
      this.user.UserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.132 Safari/537.36 MicroMessenger/6.8.0(0x16080000) NetType/WIFI MiniProgramEnv/Mac MacWechat/WMPF XWEB/30817'
      this.h5stTool = new H5ST('2d275', this.fp, this.user.UserAgent, this.user.UserName, 'https://servicewechat.com/wx91d27dbf599dff74/728/page-frame.html', 'https://servicewechat.com')
      await this.h5stTool.genAlgo()

      let res: any = await this.api({"externalLoginType": 1, "appType": "1", "bizType": "2", "source": "-1", "token": "", "deviceUUId": "", "platform": 2, "uuid": "", "systemBaseInfo": "{\"SDKVersion\":\"2.32.3\",\"system\":\"Mac OS X 13.5.0\"}", "orderListTag": 128, "curTab": "waitReceipt", "referer": "http%3A%2F%2Fwq.jd.com%2Fwxapp%2Fpages%2Fmy%2Findex%2Findex", "page": 1, "pageSize": 10})
      for (let t of res.body.orderList) {
        let orderId: string = t.orderId, time: string = t.progressInfo?.tip, content: string = t.progressInfo?.content ?? '', wareName: string = t.wareInfoList[0].wareName
        if (content) {
          console.log(orderId, wareName, time, content)
          if (!this.existOrderId.includes(orderId)) {
            this.arr.push({user: this.user.UserName, orderId, wareName, time, content})
            this.msg += `${this.user.UserName}\n${wareName}\n${time} ${content}\n\n`
          } else {
            this.arr.forEach(order => {
              if (order.orderId === orderId && order.time !== time) {
                this.msg += `${this.user.UserName}\n${wareName}\n${time} ${content}\n\n`
              }
            })
          }
        }
      }
      writeFileSync('json/jd_track.json', JSON.stringify(this.arr, null, 2))
    } catch (e) {
      console.log(e.message)
      await this.wait(5000)
    }
  }

  async help() {
    await sendNotify('京东待收货', this.msg)
  }
}

new Jd_track().init().then()