import axios from 'axios'
import USER_AGENT, {o2s, requireConfig, wait} from './TS_USER_AGENTS'


let cookie: string = '', res: any = '', UserName: string, index: number

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    res = await api('getTaskFinishCount')
    await wait(1000)
    let finishCount: number = res.content.finishCount, maxTaskCount: number = res.content.maxTaskCount
    console.log(finishCount, '/', maxTaskCount)

    for (let j = 0; j < maxTaskCount - finishCount; j++) {
      let tasks: any = await api('getTaskList')
      await wait(1000)
      for (let t of tasks.content) {
        if (t.statusName !== '活动结束' && t.status !== 2) {
          res = await taskApi('saveTaskRecord', {taskId: t.taskId, taskType: t.taskType, businessId: t.businessId})
          o2s(res)
          await wait(t.watchTime * 1000 + 500)
          res = await taskApi('saveTaskRecord', {taskId: t.taskId, taskType: t.taskType, businessId: t.businessId, uid: res.content.uid, tt: res.content.tt})
          o2s(res)
          await wait(2000)
        }
      }
    }
  }
})()

async function api(fn: string) {
  let {data} = await axios.get(`https://ifanli.m.jd.com/rebateapi/task/${fn}`, {
    headers: {
      "Host": "ifanli.m.jd.com",
      "User-Agent": USER_AGENT,
      "Referer": "https://ifanli.m.jd.com/rebate/earnBean.html?paltform=null",
      "Cookie": cookie,
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
  return data
}

async function taskApi(fn: string, body: object) {
  let {data} = await axios.post(`https://ifanli.m.jd.com/rebateapi/task/${fn}`, JSON.stringify(body), {
    headers: {
      'authority': 'ifanli.m.jd.com',
      'user-agent': USER_AGENT,
      'content-type': 'application/json;charset=UTF-8',
      'accept': 'application/json, text/plain, */*',
      'origin': 'https://ifanli.m.jd.com',
      'referer': 'https://ifanli.m.jd.com/rebate/earnBean.html?paltform=null',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cookie': cookie,
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
  return data
}