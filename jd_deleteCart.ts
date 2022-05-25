/**
 * export DELETE_CART_WHITELIST="name1&name2"
 */

import {User, JDHelloWorld} from "./TS_JDHelloWorld";

class Jd_deleteCart extends JDHelloWorld {
  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async main(user: User) {
    let whiteList: string[] = process.env.DELETE_CART_WHITELIST
      ? process.env.DELETE_CART_WHITELIST.split('&')
      : []
    let res: any = await this.get('https://p.m.jd.com/cart/cart.action?fromnav=1', {
      'Host': 'p.m.jd.com',
      'User-Agent': user.UserAgent,
      'Referer': 'https://m.jd.com/',
      cookie: user.cookie
    })
    res = JSON.parse(res.match(/window\.cartData = ([^;]*)/)[1])

    let venderCart = res.cart.venderCart, areaId: string = res.addrInfo.areaId
    for (let vender of venderCart) {
      let postBody: string = ''
      for (let sortedItem of vender.sortedItems) {
        let pid: string = sortedItem.polyItem?.promotion?.pid
        for (let p of sortedItem.polyItem.products) {
          let commlist: string = p.mainSku.id, name: string = p.mainSku.name, skuUuid: string = p.skuUuid
          let pass: boolean = whiteList.some(item => name.includes(item))
          if (!pass) {
            pid
              ? postBody += `${commlist},,1,${commlist},11,${pid},0,skuUuid:${skuUuid}@@useUuid:0$`
              : postBody += `${commlist},,1,${commlist},1,,0,skuUuid:${skuUuid}@@useUuid:0$`;
          }
          console.log(pass, name)
        }
      }
      if (postBody) {
        res = await this.post('https://api.m.jd.com/client.action/deal/mshopcart/rmvcmdy/m?sceneval=2&g_login_type=1&g_ty=ajax',
          `body={"tenantCode":"jgm","bizModelCode":"1","bizModeClientType":"M","externalLoginType":1,"platform":3,"pingouchannel":0,"commlist":${JSON.stringify(postBody)},"type":0,"checked":0,"locationid":"${areaId}","templete":1,"reg":1,"scene":0,"version":"20190418","traceid":"","sceneval":2}&loginType=2&loginWQBiz=golden-trade&appid=m_core&platform=3&functionId=deal_mshopcart_rmvcmdy_m&uuid=${this.getRandomNumString(17)}&osVersion=&screen=jdm&d_brand=&d_model=&lang=zh_CN`, {
            'Host': 'api.m.jd.com',
            'Cookie': user.cookie,
            'accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://p.m.jd.com',
            'user-agent': user.UserAgent,
            'referer': 'https://p.m.jd.com/'
          })
        res.errId === '0' ? console.log('删除成功✅') : console.log(res.errMsg)
        await this.wait(2000)
      }
    }
  }
}

new Jd_deleteCart().init().then()