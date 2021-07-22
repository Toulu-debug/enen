import axios from 'axios';
import USER_AGENT, {requireConfig, TotalBean, wait} from './TS_USER_AGENTS';
import * as dotenv from 'dotenv';

const notify = require('./sendNotify')
dotenv.config()
let cookie: string = '', res: any = '', UserName: string, index: number, id: string = randomString(40);
!(async () => {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    if (!isLogin) {
      notify.sendNotify(__filename.split('/').pop(), `cookie已失效\n京东账号${index}：${nickName || UserName}`)
      continue
    }
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

    for (let j = 0; j < 3; j++) {
      console.log(`Round:${j + 1}`)
      res = await api('beanTaskList', {"viewChannel": "AppHome"})
      try {
        if (!res.data.viewAppHome.takenTask) {
          let homeRes: any = await api('beanHomeIconDoTask', {"flag": "0", "viewChannel": "AppHome"})
          console.log(homeRes.data.remindMsg)
        }
        if (!res.data.viewAppHome.doneTask) {
          let homeRes: any = await api('beanHomeIconDoTask', {"flag": "1", "viewChannel": "AppHome"})
          console.log(homeRes.data.remindMsg)
        }
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
      } finally {
        await wait(2000)
      }
    }
  }
})()

function api(fn: string, body: any) {
  return new Promise(async resolve => {
    let {data} = await axios.get(`https://api.m.jd.com/client.action?functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&appid=ld&client=m&uuid=${id}&openudid=${id}`, {
      headers: {
        'User-Agent': USER_AGENT,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'Accept-Language': 'zh-cn',
        'Referer': 'https://h5.m.jd.com/rn/42yjy8na6pFsq1cx9MJQ5aTgu3kX/index.html',
        'Cookie': cookie
      }
    })
    resolve(data)
  })
}

function randomString(e: number) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz123456789", a = t.length, n = "";
  for (let i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
