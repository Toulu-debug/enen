import axios from 'axios'
import USER_AGENT, {requireConfig, wait, o2s} from './TS_USER_AGENTS'
import {Md5} from "ts-md5";

let cookie: string = '', res: any = '', UserName: string, index: number, invokeKey = 'q8DNJdpcfRQ69gIx'

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    res = await api('pet/getPetTaskConfig')
    for (let t of res.datas) {
      if (t.receiveStatus === 'unreceive') {
        console.log('可领奖:', t.taskName)
        res = await api('pet/getFood', t.taskType)
        if (res.errorCode === 'received') {
          console.log('已领取:', res.data)
        }
        await wait(3000)
      }

      if (t.taskName === '浏览频道') {
        res = await api('pet/getFollowChannels')
        for (let t of res.datas) {
          if (!t.status) {
            console.log(t.channelName)
            await beforeTask('follow_channel', t.channelId);
            await wait(1000)
            await doTask('scan', {"channelId": t.channelId, "taskType": 'FollowChannel'})
            await wait(6000)
          }
        }
      }

      if (t.taskName === '逛会场') {
        for (let task of t.scanMarketList) {
          if (!task.status) {
            console.log(task.marketName)
            await beforeTask('scan_market', encodeURIComponent(task.marketLink || task.marketLinkH5))
            await wait(1000)
            await doTask('scan', {"marketLink": task.marketLink || task.marketLinkH5, "taskType": "ScanMarket"})
            await wait(6000)
          }
        }
      }

      if (t.taskName === '关注商品') {
        for (let task of t.followGoodList) {
          if (!task.status) {
            console.log(task.skuName)
            await beforeTask('follow_good', task.sku)
            await wait(1000)
            await doTask('followGood', `sku=${task.sku}`)
            await wait(6000)
          }
        }
      }
    }
    break
  }
})()

async function api(fn: string, taskType?: string) {
  let lkt: number = Date.now()
  let lks: string = Md5.hashStr('' + invokeKey + lkt)
  let url: string = fn === 'pet/getFood'
    ? `https://jdjoy.jd.com/common/${fn}?reqSource=h5&invokeKey=${invokeKey}&taskType=${taskType}`
    : `https://jdjoy.jd.com/common/${fn}?reqSource=h5&invokeKey=${invokeKey}`
  let {data} = await axios.get(url, {
    headers: {
      'Host': 'jdjoy.jd.com',
      'Accept': '*/*',
      'lkt': lkt.toString(),
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Content-Type': 'application/json',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': USER_AGENT,
      'lks': lks,
      'Referer': 'https://h5.m.jd.com/',
      'Cookie': cookie,
    }
  })
  return data
}

async function beforeTask(fn: string, linkAddr: string) {
  let lkt: number = Date.now()
  let lks: string = Md5.hashStr('' + invokeKey + lkt)
  let {data} = await axios.post(`https://draw.jdfcloud.com//common/pet/icon/click?iconCode=${fn}&linkAddr=${linkAddr}&reqSource=weapp&invokeKey=${invokeKey}`, {
    headers: {
      'lkt': lkt,
      'lks': lks,
      'Host': 'draw.jdfcloud.com',
      'content-type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.16(0x18001027) NetType/WIFI Language/zh_CN',
      'Referer': 'https://servicewechat.com/wxccb5c536b0ecd1bf/770/page-frame.html',
      'Cookie': cookie
    }
  })
  return data
}

async function doTask(fn: string, body: object | string) {
  let lkt: number = Date.now()
  let lks: string = Md5.hashStr('' + invokeKey + lkt)
  let {data} = await axios.post(`https://draw.jdfcloud.com//common/pet/${fn}?reqSource=weapp&invokeKey=${invokeKey}`, {
    headers: {
      'lkt': lkt,
      'lks': lks,
      'Host': 'draw.jdfcloud.com',
      'content-type': fn === 'followGood' || fn === 'followShop' ? 'application/x-www-form-urlencoded' : 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.16(0x18001027) NetType/WIFI Language/zh_CN',
      'Referer': 'https://servicewechat.com/wxccb5c536b0ecd1bf/770/page-frame.html',
      'Cookie': cookie
    },
    body: typeof body === 'object' ? JSON.stringify(body) : body
  })
  return data
}