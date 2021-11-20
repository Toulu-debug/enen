/**
 * 宠汪汪三代目
 * cron: 0 0-23/3 * * *
 *
 * follow_fail就停
 */

import axios from 'axios'
import {Md5} from "ts-md5";
import {differenceInMinutes, format} from "date-fns";
import USER_AGENT, {requireConfig, wait, o2s} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, index: number, invokeKey = 'q8DNJdpcfRQ69gIx'

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    res = await doTask('enterRoom/h5', {}, '&invitePin=')
    await wait(1000)
    let lastFeedTime: number = res.data.lastFeedTime

    // feed
    if (differenceInMinutes(Date.now(), lastFeedTime) > 180) {
      await click('feed')
      await beforeFeed()
      await wait(1000)
      res = await feed()
      if (res.errorCode === 'feed_ok') {
        console.log('喂食成功', 80)
      } else {
        console.log('喂食失败', res)
      }
    } else {
      console.log('feed间隔未满3小时，上次喂食', format(lastFeedTime, 'HH:mm:ss'))
    }
    await wait(3000)

    // run
    await click('race')
    await beforeFeed('race')
    await wait(1000)
    res = await api('pet/combat/detail/v2', '', '&help=false')
    await wait(2000)
    if (res.data.petRaceResult === 'unreceive') {
      let winCoin: number = res.data.winCoin  // 赛跑奖励
      res = await api('pet/combat/receive')
      await wait(2000)
      if (!res.errorCode) {
        console.log('赛跑领奖成功', winCoin)
      }
    } else if (res.data.petRaceResult === 'not_participate') {
      console.log('可参赛')
      res = await api('pet/combat/match', '', '&teamLevel=2')
      await beforeFeed('race_match')
      await click('race_match')
      await wait(5000)
      while (1) {
        if (res.data.petRaceResult === 'matching') {
          console.log('正在匹配......')
          res = await api('pet/combat/match', '', '&teamLevel=2')
          await wait(5000)
        } else {
          break
        }
      }
    } else if (res.data.petRaceResult === 'participate') {
      console.log('比赛中......')
      for (let user of res.data.raceUsers) {
        console.log(user.nickName, user.distance)
      }
    } else if (res.data.petRaceResult === 'time_over') {
      console.log('非比赛时段')
    } else if (res.data.petRaceResult === 'race_lose') {
      console.log('赛跑结果  输')
    } else {
      console.log('race状态未知')
      o2s(res)
    }
    await wait(3000)

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
        await beforeFeed('follow_channel')
        await click('follow_channel')
        await wait(1000)
        res = await api('pet/getFollowChannels')
        await wait(2000)
        for (let task of res.datas) {
          if (!task.status) {
            console.log('浏览频道', task.channelName)
            await click('follow_channel', task.channelId)
            await beforeTask('follow_channel', task.channelId)
            await wait(6000)
            await doTask('scan', {"channelId": task.channelId, "taskType": 'FollowChannel'})
            await wait(1000)
          }
        }
      }

      if (t.taskName === '逛会场') {
        for (let task of t.scanMarketList) {
          if (!task.status) {
            console.log('逛逛会场', task.marketName)
            await beforeTask('scan_market', encodeURIComponent(task.marketLink || task.marketLinkH5))
            await click('scan_market', encodeURIComponent(task.marketLink || task.marketLinkH5))
            await wait(6000)
            await doTask('scan', {"marketLink": task.marketLink || task.marketLinkH5, "taskType": "ScanMarket"})
            await wait(2000)
          }
        }
      }

      if (t.taskName === '关注商品') {
        for (let task of t.followGoodList) {
          if (!task.status) {
            console.log('关注商品', task.skuName)
            await beforeTask('follow_good', task.sku)
            await click('follow_good', task.sku)
            await wait(6000)
            await doTask('followGood', `sku=${task.sku}`)
            await wait(1000)
          }
        }
      }
    }
  }
})()

async function api(fn: string, taskType?: string, params?: string) {
  let lkt: number = Date.now()
  let lks: string = Md5.hashStr('' + invokeKey + lkt)
  let url: string = taskType
    ? `https://jdjoy.jd.com/common/${fn}?reqSource=h5&invokeKey=${invokeKey}&taskType=${taskType}`
    : `https://jdjoy.jd.com/common/${fn}?reqSource=h5&invokeKey=${invokeKey}${params ?? ''}`
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

async function beforeFeed(fn: string = 'feed') {
  let lkt: number = Date.now()
  let lks: string = Md5.hashStr('' + invokeKey + lkt)
  let {data} = await axios.get(`https://jdjoy.jd.com/common/pet/icon/click1?iconCode=${fn}&reqSource=h5&invokeKey=${invokeKey}`, {
    headers: {
      'Host': 'jdjoy.jd.com',
      'lkt': lkt.toString(),
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': USER_AGENT,
      'lks': lks,
      'Referer': 'https://h5.m.jd.com/',
      'Content-Type': 'application/json',
      'Cookie': cookie
    }
  })
  return data
}

async function feed() {
  let lkt: number = Date.now()
  let lks: string = Md5.hashStr('' + invokeKey + lkt)
  let {data} = await axios.get(`https://jdjoy.jd.com/common/pet/feed?feedCount=80&reqSource=h5&invokeKey=${invokeKey}`, {
    headers: {
      'Host': 'jdjoy.jd.com',
      'lkt': lkt.toString(),
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': USER_AGENT,
      'lks': lks,
      'Referer': 'https://h5.m.jd.com/',
      'Content-Type': 'application/json',
      'Cookie': cookie
    }
  })
  return data
}

async function beforeTask(fn: string, linkAddr: string) {
  let lkt: number = Date.now()
  let lks: string = Md5.hashStr('' + invokeKey + lkt)
  let {data}: any = await axios.get(`https://jdjoy.jd.com/common/pet/icon/click1?iconCode=${fn}&linkAddr=${linkAddr}&reqSource=h5&invokeKey=${invokeKey}`, {
    headers: {
      'Host': 'jdjoy.jd.com',
      'Accept': '*/*',
      'lkt': lkt.toString(),
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': USER_AGENT,
      'Connection': 'keep-alive',
      'lks': lks,
      'Referer': 'https://h5.m.jd.com/',
      'Content-Type': 'application/json',
      'Cookie': cookie
    }
  })
  if (data.errorCode) {
    console.log(data.errorCode)
  }
}

async function doTask(fn: string, body: object | string, params?: string) {
  let lkt: number = Date.now()
  let lks: string = Md5.hashStr('' + invokeKey + lkt)
  let {data}: any = await axios.post(`https://jdjoy.jd.com/common/pet/${fn}?reqSource=h5&invokeKey=${invokeKey}${params ?? ''}`, typeof body === 'object' ? JSON.stringify(body) : body, {
    headers: {
      'Host': 'jdjoy.jd.com',
      'lkt': lkt.toString(),
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': USER_AGENT,
      'Referer': 'https://h5.m.jd.com/',
      'lks': lks,
      'Content-Type': typeof body === 'object' ? 'application/json' : 'application/x-www-form-urlencoded',
      'Cookie': cookie
    },
  })
  if (data.errorCode) {
    console.log(data.errorCode)
  }
  return data
}

async function click(iconCode: string, linkAddr?: string) {
  let lkt: number = Date.now()
  let lks: string = Md5.hashStr('' + invokeKey + lkt)
  let url: string = linkAddr
    ? `https://jdjoy.jd.com/common/pet/icon/click?code=1624363341529274068136&iconCode=${iconCode}&linkAddr=${linkAddr}&reqSource=h5&invokeKey=${invokeKey}`
    : `https://jdjoy.jd.com/common/pet/icon/click?code=1624363341529274068136&iconCode=${iconCode}&reqSource=h5&invokeKey=${invokeKey}`
  let {data} = await axios.get(url, {
    headers: {
      'Host': 'jdjoy.jd.com',
      'Connection': 'keep-alive',
      'Sec-Fetch-Mode': 'cors',
      'Origin': 'https://h5.m.jd.com',
      'lks': lks,
      'User-Agent': USER_AGENT,
      'lkt': lkt.toString(),
      'content-type': 'application/json',
      'X-Requested-With': 'com.jingdong.app.mall',
      'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
      'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cookie': cookie
    }
  })
  if (data.errorCode) {
    console.log(data.errorCode)
  }
}