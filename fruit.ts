import axios from 'axios'
import USER_AGENT, {o2s, requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', data: any, UserName: string, index: number

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)


    // 初始化
    res = await api('initForFarm', {"version": 11, "channel": 3})
    await wait(1000)
    if (res.todayGotWaterGoalTask.canPop) {
      data = await api('gotWaterGoalTaskForFarm', {"type": 3, "version": 14, "channel": 1, "babelChannel": "120"})
      o2s(data)
      console.log("弹窗获得水滴", data.amount)
    }
    o2s(res)
    if (res.farmUserPro.treeState === 2) {
      console.log("可以兑换奖品了")
    } else if (res.farmUserPro.treeState === 0) {
      console.log("自动种植")
    }

    // 添加好友


    // 删除好友
    res = await api('friendListInitForFarm', {"lastId": null, "version": 14, "channel": 1, "babelChannel": "120"})
    await wait(1000)
    if (!res.newFriendMsg) {
      for (let fr of res.friends) {
        res = await api('deleteFriendForFarm', {"shareCode": fr.shareCode, "version": 8, "channel": 1})
        await wait(1000)
        if (res.code === '0') {
          console.log(`删除好友${fr.nickName}成功`)
        } else {
          console.log(`删除好友${fr.nickName}失败`)
          break
        }
      }
    }

    // 好友邀请奖励
    res = await api('friendListInitForFarm', {"lastId": null, "version": 14, "channel": 1, "babelChannel": "120"})
    if (res.inviteFriendCount > res.inviteFriendGotAwardCount) {
      res = await api('awardInviteFriendForFarm', {})
      await wait(1000)
      o2s(res, '好友邀请奖励')
    }

    // 签到
    res = await api('clockInInitForFarm', {"timestamp": Date.now(), "version": 14, "channel": 1, "babelChannel": "120"})
    await wait(1000)
    if (!res.todaySigned) {
      res = await api('clockInForFarm', {"type": 1, "version": 14, "channel": 1, "babelChannel": "120"})
      o2s(res)
      await wait(1000)
    }
    res = await api('clockInInitForFarm', {"timestamp": Date.now(), "version": 14, "channel": 1, "babelChannel": "120"})
    for (let t of res.themes || []) {
      if (!t.hadGot) {
        console.log('关注', t.name)
        res = await api('clockInFollowForFarm', {"id": t.id, "type": "theme", "step": 1, "version": 14, "channel": 1, "babelChannel": "120"})
        await wait(5000)
        res = await api('clockInFollowForFarm', {"id": t.id, "type": "theme", "step": 2, "version": 14, "channel": 1, "babelChannel": "120"})
        console.log('获得水滴', res.amount)
      }
    }

    // 任务
    res = await api('taskInitForFarm', {"version": 14, "channel": 1, "babelChannel": "120"})
    o2s(res)
    if (!res.gotBrowseTaskAdInit.f) {
      for (let t of res.gotBrowseTaskAdInit.userBrowseTaskAds) {
        if (t.hadFinishedTimes !== t.limit) {
          data = await api('browseAdTaskForFarm', {"advertId": t.advertId, "type": 0, "version": 14, "channel": 1, "babelChannel": "120"})
          o2s(data, 'browseAdTaskForFarm')
          await wait(t.time * 1000 || 1000)
        }
      }
    }

    if (!res.waterRainInit.f) {
      if (Date.now < res.waterRainInit.lastTime + 3 * 60 * 60 * 1000) {
        data = await api('waterRainForFarm', {"type": 1, "hongBaoTimes": 100, "version": 3})
        o2s(data, 'waterRainForFarm')
        if (data.code === '0') {
          console.log('获得水滴', data.addEnergy)
        }
      }
    }

    if (!res.firstWaterInit.f && res.firstWaterInit.totalWaterTimes !== 0) {
      data = await api('firstWaterTaskForFarm', {"version": 14, "channel": 1, "babelChannel": "120"})
      console.log('firstWaterTaskForFarm', data.amount)
    }

  }
})()

async function api(fn: string, body: object) {
  let {data} = await axios.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${JSON.stringify(body)}&&appid=wh5&client=apple&clientVersion=10.2.4`, {
    headers: {
      "Host": "api.m.jd.com",
      "Origin": "https://carry.m.jd.com",
      "User-Agent": USER_AGENT,
      "Accept-Language": "zh-CN,zh-Hans;q=0.9",
      "Referer": "https://carry.m.jd.com/",
      "Cookie": cookie
    }
  })
  return data
}