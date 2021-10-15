/**
 * 领京豆-任务
 * cron: 0 9,12 * * *
 */

import axios from 'axios';
import USER_AGENT, {requireConfig, wait} from './TS_USER_AGENTS';

let cookie: string = '', res: any = '', UserName: string, index: number;

!(async () => {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    res = await initForTurntableFarm();
    let times: number = res.remainLotteryTimes
    console.log('剩余抽奖机会:', times)
    for (let j = 0; j < times; j++) {
      console.log('开始抽奖...')
      res = await initForTurntableFarm(1)
      if (res.code === '0') {
        if (res.type === 'thanks') {
          console.log('抽奖成功，获得：狗屁')
        } else {
          console.log('抽奖成功，获得:', res.type)
        }
      } else {
        console.log('抽奖失败', res)
      }
      await wait(5000)
    }

    for (let j = 0; j < 4; j++) {
      console.log(`Round:${j + 1}`)
      res = await api('beanTaskList', {"viewChannel": "AppHome"})
      try {
        for (let t of res.data.taskInfos) {
          if (t.status === 1) {
            console.log(t.taskName)
            res = await api('beanDoTask', {
              "actionType": t.taskType === 3 ? 0 : 1,
              "taskToken": t.subTaskVOS[0].taskToken
            })
            if (res.data.bizMsg)
              console.log(res.data.bizMsg)
            else {
              console.log(res)
            }
            await wait(2000)
            if (t.taskType !== 3) {
              await wait(1500)
              res = await api('beanDoTask', {"actionType": 0, "taskToken": t.subTaskVOS[0].taskToken})
              if (res.data.bizMsg)
                console.log(res.data.bizMsg)
            }
            await wait(1000)
          }
        }
      } catch (e) {
        console.log('Error!')
      }
      await wait(2000)
    }
  }
})()

async function api(fn: string, body: any) {
  let sign: any = await getSign(fn, body);
  let {data}: any = await axios.get(`https://api.m.jd.com/client.action?functionId=${fn}&${sign.data.sign}`, {
    headers: {
      'Host': 'api.m.jd.com',
      'content-type': 'application/x-www-form-urlencoded',
      'j-e-c': '',
      'accept': '*/*',
      'j-e-h': '',
      'accept-language': 'zh-Hans-CN;q=1',
      'referer': '',
      'user-agent': 'JD4iPhone/167841 (iPhone; iOS; Scale/3.00)',
      'Cookie': cookie
    }
  })
  return data
}

async function getSign(fn: string, body: object) {
  let {data}: any = await axios.post('https://api.jds.codes/sign', {
    "fn": fn, "body": body
  })
  if (data.code === 200)
    return data
  else
    return {code: 500, data: {sign: ''}}
}

async function initForTurntableFarm(type: number = 0) {
  let url = type === 0
    ? 'https://api.m.jd.com/client.action?functionId=initForTurntableFarm&body=%7B%22version%22%3A4%2C%22channel%22%3A1%7D&appid=wh5'
    : 'https://api.m.jd.com/client.action?functionId=lotteryForTurntableFarm&body=%7B%22type%22%3A1%2C%22version%22%3A4%2C%22channel%22%3A1%7D&appid=wh5'
  let {data} = await axios.get(url, {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': USER_AGENT,
      'Referer': 'https://h5.m.jd.com/',
      'Cookie': cookie
    }
  })
  return data
}