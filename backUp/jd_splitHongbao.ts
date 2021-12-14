/**
 * 金榜任务
 * 入口 https://wz.my/7tf
 * cron: 0 0,15 * * *
 */

import USER_AGENT, {requireConfig, wait, getshareCodeHW, o2s} from "../TS_USER_AGENTS"
import axios from "axios"

let cookie: string = '', res: any = '', UserName: string, index: number
let shareCodeSelf: string[] = [], shareCode: string[] = [], shareCodeHW: string[] = []

!(async () => {
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    res = await api('splitHongbao_getHomeData', {"appId": "1EFVXxg", "taskToken": ""})
    let taskVos: any = res.data.result.taskVos
    for (let t of taskVos) {
      if (t.status === 1) {
        console.log(t.taskName)
        for (let tp of t.shoppingActivityVos || t.productInfoVos) {
          if (tp.status === 1) {
            res = await api('harmony_collectScore', {"appId": "1EFVXxg", "taskToken": tp.taskToken, "taskId": t.taskId, "itemId": tp.itemId, "actionType": "1"})
            o2s(res)
            await wait(t.waitDuration * 1000 + 500)
            res = await api('harmony_collectScore', {"appId": "1EFVXxg", "taskToken": tp.taskToken, "taskId": t.taskId, "itemId": tp.itemId, "actionType": "0"})
            o2s(res)
          }
        }
      }
      if (t.taskId === 7) {
        console.log('助力码：', t.assistTaskDetailVo.taskToken)
        shareCodeSelf.push(t.assistTaskDetailVo.taskToken)
      }
    }

    res = await api('splitHongbao_getHomeData', {"appId": "1EFVXxg", "taskToken": ""})
    let lotteryNum: number = parseInt(res.data.result.userInfo.lotteryNum)
    taskVos = res.data.result.taskVos
    for (let j = 0; j < lotteryNum; j++) {
      res = await api('splitHongbao_getLotteryResult', {"appId": "1EFVXxg", "taskId": ""})
      console.log('开红包：', parseFloat(res.data.result.userAwardsCacheDto.redPacketVO.value))
      await wait(1000)
    }
    for (let t of taskVos) {
      if (t.status === 3) {
        res = await api('splitHongbao_getLotteryResult', {"appId": "1EFVXxg", "taskId": t.taskId})
        console.log('开红包：', parseFloat(res.data.result.userAwardsCacheDto.redPacketVO.value))
        await wait(1000)
      }
    }
  }

  console.log('内部助力码：', shareCodeSelf)
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    if (shareCodeHW.length === 0) {
      shareCodeHW = await getshareCodeHW('jinbang')
    }
    shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodeHW]))
    for (let code of shareCode) {
      console.log(`账号 ${UserName} 去助力 ${code}`)
      res = await api('harmony_collectScore', {"appId": "1EFVXxg", "taskToken": code, "taskId": 6, "actionType": 0})
      if (res.data.bizMsg === 'success') {
        console.log('助力成功')
      } else if (res.data.bizMsg === '已达到助力上限') {
        break
      } else {
        console.log(res.data.bizMsg)
      }
      await wait(1000)
    }
  }
})()

async function api(fn: string, body: object) {
  let {data} = await axios.post('https://api.m.jd.com/client.action', `functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`, {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': USER_AGENT,
      'Referer': 'https://h5.m.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  })
  return data
}