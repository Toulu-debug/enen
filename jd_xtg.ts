import axios from 'axios';
import USER_AGENT, {requireConfig, wait, requestAlgo} from './TS_USER_AGENTS';

let cookie: string = '', res: any = '', UserName: string, index: number;
let shareCodes: string[] = [], shareCodesSelf: string[] = [], tasks: any;
let shareCodesHW: string[] = [
  '8fa2f89e-39a0-4023-b902-74376f1ac5b4',
  'ca02cf34-1b5b-4da1-9852-8945a8cc0231',
  '5b222457-2b63-4702-8579-909ba1a0a6de',
  '61b17229-85e9-45d4-a399-62a251f8c59f',
  'ed6801cc-b710-4eaf-a842-526755a907ec'
]

!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    res = await api(`{"apiMapping":"/api/task/doSign"}`)

    res = await api(`{"apiMapping":"/api/supportTask/getShareId"}`)
    console.log('助力码', res.data)
    shareCodesSelf.push(res.data)

    for (let j = 0; j < 9; j++) {
      if (await doTask() === 0)
        break
    }

    res = await api(`{"apiMapping":"/api/index/indexInfo"}`)
    let score: number = res.data.myScore
    console.log('积分', score)
    for (let j = 0; j < Math.floor(score / 100); j++) {
      res = await api(`{"apiMapping":"/api/lottery/lottery"}`)
      if (!res.data.prizeName) {
        console.log('未中奖')
      } else {
        console.log('中奖', res.data.prizeName)
      }
      await wait(3000)
    }

    await wait(1000)
  }

  shareCodes = [...shareCodesSelf, ...shareCodesHW]
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    for (let code of shareCodes) {
      console.log(`账号 ${UserName} 去助力 ${code}`)
      res = await api(`{"shareId":"${code}","apiMapping":"/api/supportTask/doSupport"}`)
      if (res.code === 200) {
        console.log(res.msg)
      }
      await wait(1000)
    }
  }
})()

async function api(body: string) {
  let {data} = await axios.post("https://api.m.jd.com/api",
    `appid=china-joy&functionId=star_push_jd_prod&body=${body}&t=${Date.now()}`, {
      headers: {
        'Host': 'api.m.jd.com',
        'Origin': 'https://starintroducer.jd.com',
        'User-Agent': USER_AGENT,
        'Referer': 'https://starintroducer.jd.com/',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie
      }
    })
  return data
}

async function doTask() {
  tasks = await api(`{"apiMapping":"/api/task/getTaskList"}`)
  for (let t of tasks.data) {
    for (let j = t.finishNum; j < t.totalNum; j++) {
      console.log(t.taskName)
      res = await api(`{"parentId":"${t.parentId}","taskId":"${t.taskId}","apiMapping":"/api/task/doTask"}`)
      await wait(10000)
      if (res.code === 200) {
        let timestamp: number = res.data.timeStamp
        res = await api(`{"parentId":"${t.parentId}","taskId":"${t.taskId}","timeStamp":${timestamp},"apiMapping":"/api/task/getReward"}`)
        if (res.code === 200) {
          console.log('任务成功，获得', res.data.score)
          await wait(2000)
          return 1
        } else {
          console.log('任务失败', res)
        }
      } else {
        console.log('任务失败', res)
      }
    }
  }
  return 0
}