import axios from 'axios'
import USER_AGENT, {o2s, requireConfig, wait} from './TS_USER_AGENTS'


let cookie: string = '', res: any = ''

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    let UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    res = await api('getTaskFinishCount')
    await wait(1000)
    let finishCount: number = res.content.content.finishCount, maxTaskCount: number = res.content.content.maxTaskCount
    console.log(finishCount, '/', maxTaskCount)

    for (let i = finishCount; i < maxTaskCount; i++) {
      let tasks = await api('getTaskList')
      tasks = tasks.content
      tasks = tasks.sort(compare('rewardBeans'))
      await wait(3000)

      for (let t of tasks) {
        if (t.statusName !== '活动结束' && t.status !== 2) {
          res = await taskApi('saveTaskRecord', {"taskId": null, "taskType": 2, "businessId": null})
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
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
      'referer': 'https://ifanli.m.jd.com/rebate/earnBean.html?paltform=null',
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
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
      'referer': 'https://ifanli.m.jd.com/rebate/earnBean.html?paltform=null',
      'cookie': cookie
    }
  })
  return data
}

function compare(property) {
  return function (a, b) {
    let value1 = a[property];
    let value2 = b[property];
    return value2 - value1;
  }
}