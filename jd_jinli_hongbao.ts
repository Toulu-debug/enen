/**
 * 京东-锦鲤红包
 * 做任务、助力、开红包
 * cron: 1 0,6,18 * * *
 * CK1助力顺序
 * HW.ts -> 内部
 */

import axios from 'axios';
import {sendNotify} from './sendNotify'
import USER_AGENT, {requireConfig, wait, getRandomNumberByRange, getshareCodeHW, o2s} from "./TS_USER_AGENTS";

let cookie: string = '', res: any = '', UserName: string
let shareCodesSelf: string[] = [], shareCodes: string[] = [], shareCodesHW: string[] = [], fullCode: string[] = []
let min: number[] = [0.02, 0.12, 0.3, 0.6, 0.7, 0.8, 1, 2]

!(async () => {
  let cookiesArr: string[] = await requireConfig(false);
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value;
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`);

      res = await api('h5launch', {"followShop": 0, "random": getRandomNumberByRange(36135846, 74613584), "log": `${Date.now()}~0iuxyee`, "sceneid": "JLHBhPageh5"})
      console.log('活动初始化：', res.data.result.statusDesc)

      res = await api('h5activityIndex', {"isjdapp": 1})
      console.log('红包ID：', res.data.result.redpacketInfo.id)
      shareCodesSelf.push(res.data.result.redpacketInfo.id)
    } catch (e) {
      console.log(e)
    }
  }

  console.log('内部助力：', shareCodesSelf)
  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value;
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      if (shareCodesHW.length === 0) {
        shareCodesHW = await getshareCodeHW('jlhb')
      }
      // 2 4 9 12
      if (index === 0 || cookiesArr.length === 2) { // 红包1需2个助力
        shareCodes = Array.from(new Set([...shareCodesHW, ...shareCodesSelf]))
      } else {
        shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW]))
      }
      if (cookiesArr.length > 5 && cookiesArr.length < 8 && index > 4) {  // 红包3需要7个助力
        shareCodes = Array.from(new Set([...shareCodesHW, ...shareCodesSelf]))
      }
      for (let code of shareCodes) {
        if (!fullCode.includes(code)) {
          console.log(`账号${index + 1} ${UserName} 去助力 ${code} ${shareCodesSelf.includes(code) ? '*内部*' : ''}`)
          res = await api('jinli_h5assist', {"redPacketId": code, "followShop": 0, "random": getRandomNumberByRange(36135846, 74613584), "log": `${Date.now()}~0gga2ik`, "sceneid": "JLHBhPageh5"})
          if (res.data.result.status === 0) {
            console.log('助力成功：', parseFloat(res.data.result.assistReward.discount))
            break
          } else if (res.data.result.status === 3) {
            console.log('今日助力次数已满')
            break
          } else {
            console.log('助力结果：', res.data.result.statusDesc)
            if (res.data.result.statusDesc === '啊偶，TA的助力已满，开启自己的红包活动吧~') {
              fullCode.push(code)
            }
          }
          await wait(1000)
        } else {
          console.log(`Code ${code} 已被助满`)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  for (let [index, value] of cookiesArr.entries()) {
    try {
      cookie = value
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`\n开始【京东账号${index + 1}】${UserName}\n`);

      // 做任务
      res = await api('taskHomePage', {})
      await wait(1000)
      for (let t of res.data.result.taskInfos) {
        if (!t.alreadyReceivedCount || t.alreadyReceivedCount < t.requireCount) {
          if ([2, 3, 4, 5, 8].includes(t.taskType)) {
            res = await api('startTask', {"taskType": t.taskType, "random": getRandomNumberByRange(36135846, 74613584), "log": `${Date.now()}~1orj8k3`, "sceneid": "JLHBhPageh5"})
            console.log(t.title, res.data.biz_msg)
            await wait(1000)
            res = await api('getTaskDetailForColor', {taskType: t.taskType})
            await wait(1000)
            for (let tp of res.data.result.advertDetails) {
              if (tp.status === 0) {
                res = await api('taskReportForColor', {"taskType": t.taskType, "detailId": tp.id})
                console.log(t.title, tp.name, res.data.biz_msg)
                await wait(1000)
              }
            }
          }
        }
        if (t.innerStatus === 3) {
          res = await api('h5receiveRedpacketAll', {"taskType": t.taskType, "random": getRandomNumberByRange(36135846, 74613584), "log": `${Date.now()}~138q6w6`, "sceneid": "JLHBhPageh5"})
          console.log(`${t.title} 打开成功，获得`, parseFloat(res.data.result.discount))
          if (!min.includes(parseFloat(res.data.result.discount)))
            await sendNotify(`锦鲤红包`, `账号${index + 1} ${UserName}\n${res.data.result.discount}`)
          await wait( 1000)
        }
      }
      await wait(1000)

      // 打开任务红包
      res = await api('taskHomePage', {})
      await wait(1000)
      for (let t of res.data.result.taskInfos) {
        if (t.innerStatus === 3) {
          res = await api('h5receiveRedpacketAll', {"taskType": t.taskType, "random": getRandomNumberByRange(36135846, 74613584), "log": `${Date.now()}~138q6w6`, "sceneid": "JLHBhPageh5"})
          console.log(`${t.title} 打开成功，获得`, parseFloat(res.data.result.discount))
          if (!min.includes(parseFloat(res.data.result.discount)))
            await sendNotify(`锦鲤红包`, `账号${index + 1} ${UserName}\n${res.data.result.discount}`)
          await wait(1000)
        }
      }
      await wait(2000)

      // 打开助力红包
      let j: number = 1
      res = await api('h5activityIndex', {"isjdapp": 1})
      for (let t of res.data.result.redpacketConfigFillRewardInfo) {
        if (t.packetStatus === 2) {
          console.log(`红包${j}已拆过，获得`, t.packetAmount)
        } else if (t.packetStatus === 1) {
          console.log(`红包${j}可拆`)
          res = await api('h5receiveRedpacketAll', {"random": getRandomNumberByRange(36135846, 74613584), "log": `${Date.now()}~0suodw0`, "sceneid": "JLHBhPageh5"})
          console.log(res.data.biz_msg, parseFloat(res.data.result.discount))
          await wait(1000)
        } else {
          console.log(`${j}`, t.hasAssistNum, '/', t.requireAssistNum)
        }
        j++
      }
    } catch (e) {
      console.log(e)
    }
  }
})()

async function api(fn: string, body: object) {
  let {data} = await axios.post(`https://api.m.jd.com/api?appid=jinlihongbao&functionId=${fn}&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.2.4&osVersion=-1`, `body=${encodeURIComponent(JSON.stringify(body))}`, {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://happy.m.jd.com',
      'Connection': 'keep-alive',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': USER_AGENT,
      'Referer': 'https://happy.m.jd.com/',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  })
  return data
}
