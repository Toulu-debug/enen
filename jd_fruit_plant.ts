/**
 * 农场自动收+种4级
 */

import USER_AGENT, {o2s, getCookie, wait} from "./TS_USER_AGENTS"
import axios from "axios";

let cookie: string = '', UserName: string, res: any

!(async () => {
  let cookiesArr: string[] = await getCookie()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    res = await api('initForFarm', {"version": 11, "channel": 3, "babelChannel": 0})
    if (![0, 2, 3].includes(res.farmUserPro.treeState)) {
      console.log('正在种植...')
    }
    if (res.farmUserPro.treeState === 2) {
      res = await api('gotCouponForFarm', {"version": 11, "channel": 3, "babelChannel": 0})
      res = await api('initForFarm', {"version": 11, "channel": 3, "babelChannel": 0})
    }
    if (res.farmUserPro.treeState === 0 || res.farmUserPro.treeState === 3) {
      let element = {
        type: null,
        name: null,
        prizeLevel: 0,
      };
      for (let j = 4; j > 0; j--) {
        if (res.farmLevelWinGoods[j].length > 0) {
          let index = Math.floor(Math.random() * res.farmLevelWinGoods[j].length)
          if (!res.farmLevelWinGoods[j][index]) {
            index = 0
          }
          element = res.farmLevelWinGoods[j][index]
          break
        }
      }
      if (!element.type) {
        console.log('当前没有可种植作物')
        continue
      }
      console.log(`正在尝试种植 ${element.prizeLevel} 级作物：${element.name} ...`)
      res = await api('choiceGoodsForFarm', {"imageUrl": '', "nickName": '', "shareCode": '', "goodsType": element.type, "type": "0", "version": 11, "channel": 3, "babelChannel": 0});
      o2s(res)
      await api('gotStageAwardForFarm', {"type": "4", "version": 11, "channel": 3, "babelChannel": 0});
      await api('waterGoodForFarm', {"type": "", "version": 11, "channel": 3, "babelChannel": 0});
      await api('gotStageAwardForFarm', {"type": "1", "version": 11, "channel": 3, "babelChannel": 0});
    }
  }
})()

async function api(fn: string, body: object) {
  let {data} = await axios.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${JSON.stringify(body)}&client=apple&clientVersion=10.0.4&osVersion=13.7&appid=wh5&loginType=2&loginWQBiz=interact`, {
    headers: {
      "Cookie": cookie,
      "Host": "api.m.jd.com",
      'User-Agent': USER_AGENT,
    }
  })
  await wait(1000)
  return data
}