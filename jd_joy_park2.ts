import axios from 'axios';
import USER_AGENT from './TS_USER_AGENTS';

let $: any = {};
let cookie: string = '', cookiesArr: Array<string> = [], res: any = '', shareCodes: Array<string> = [];
let joyId: Array<number> = [], workJoyInfoList: any = [];
let joyId1: number, userLevel: number, Joys: Joy[] = [];
let joys: any;
let level: number = 4, runtimes: number = 0;

interface Joy {
  id: number,
  level: number
}

!(async () => {
  await requireConfig();

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    $.index = i + 1;
    $.isLogin = true;
    $.nickName = '';
    await TotalBean();
    console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);

    joys = await joyList();
    console.log(`你有${joys.data.activityJoyList.length}只🐶`)
    for (let j of joys.data.activityJoyList) {
      console.log('id:', j.id, '等级:', j.level)
    }

    await makeShareCodes();

    await merge();

    let joy: any = await joyList();
    if (joy.data.activityJoyList.length !== 0) {
      joyId1 = joy.data.activityJoyList[0].id
      console.log(joy.data.activityJoyList)
      // 1:种田  2:出来
      res = await api('joyMove', {"joyId": joyId1, "location": 1, "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
      console.log(res)
    }
    /*
        let taskVos: any = await api('apTaskList', {"linkId": "LsQNxL7iWDlXUs6cFl-AAg"});
        let tasks: any = taskVos.data
        for (let t of tasks) {
          if (t.taskTitle === '汪汪乐园签到') {
            if (t.taskDoTimes === 0) {
              res = await api('apDoTask', {"taskType": t.taskType, "taskId": t.id, "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
              console.log('签到:', res)
              await wait(1000)
              await api('apTaskDrawAward', {"taskType": t.taskType, "taskId": t.id, "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
            }
          } else if (t.taskTitle === '汪汪乐园浏览会场' || t.taskTitle === '汪汪乐园浏览商品') {
            let arr: Array<string> = ['汪汪乐园浏览会场', '汪汪乐园浏览商品']
            for (let name of arr) {
              if (t.taskDoTimes + 1 === t.taskLimitTimes || t.taskDoTimes === t.taskLimitTimes) continue
              let times: number = name === '汪汪乐园浏览会场' ? 5 : 10;
              res = await api('apTaskDetail', {"taskType": t.taskType, "taskId": t.id, "channel": 4, "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
              let apTaskDetail: any, taskResult: any, awardRes: any;

              // console.log(res.data)

              for (let i = 0; i < times; i++) {
                try {
                  apTaskDetail = res.data.taskItemList[i]
                } catch (e) {
                  break
                }
                taskResult = await api('apDoTask', {"taskType": t.taskType, "taskId": t.id, "channel": 4, "linkId": "LsQNxL7iWDlXUs6cFl-AAg", "itemId": encodeURIComponent(apTaskDetail.itemId)})
                console.log('doTask: ', JSON.stringify(taskResult))
                if (taskResult.errMsg === '任务已完成') break
                console.log('等待中...')
                await wait(10000)
                awardRes = await api('apTaskDrawAward', {"taskType": t.taskType, "taskId": t.id, "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
                if (awardRes.success && awardRes.code === 0)
                  console.log(awardRes.data[0].awardGivenNumber)
                else
                  console.log('领取奖励出错:', JSON.stringify(awardRes))
                await wait(1000)
              }
            }
          }
        }

         */

    break
  }
  /*
  for (let i = 0; i < cookiesArr.length; i++) {
    for(let j=0;j<shareCodes.length;j++){
      if(i===j){
        console.log('不助力自己')
      }else {
        res = await api('joyBaseInfo',{"taskId":"167","inviteType":"1","inviterPin":shareCodes[j],"linkId":"LsQNxL7iWDlXUs6cFl-AAg"})
        console.log(res)
        await wait(1000)
      }
    }
  }
   */

})()

function api(fn: string, body: Object): Object {
  return new Promise(async resolve => {
    let {data} = await axios.post("https://api.m.jd.com/",
      `functionId=${fn}&body=${JSON.stringify(body)}&_t=${Date.now()}&appid=activities_platform`
      , {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': USER_AGENT,
          'Host': 'api.m.jd.com',
          'Referer': 'https://joypark.jd.com/',
          'Origin': 'https://joypark.jd.com',
          'Cookie': cookie
        }
      })
    await heartBeat();
    resolve(data);
  })
}

function joyList() {
  return new Promise(async resolve => {
    let {data} = await axios.get(`https://api.m.jd.com/?functionId=joyList&body={%22linkId%22:%22LsQNxL7iWDlXUs6cFl-AAg%22}&_t=${Date.now()}&appid=activities_platform`, {
      headers: {
        'host': 'api.m.jd.com',
        'User-agent': USER_AGENT,
        'cookie': cookie,
        'origin': 'https://joypark.jd.com',
        'referer': 'https://joypark.jd.com'
      }
    })
    await wait(1000)
    await heartBeat()
    resolve(data)
  })
}


function merge() {
  return new Promise<void>(async resolve => {
    runtimes++;
    if (runtimes === 10) return
    let minLevel: Array<number> = [];
    for (let j of joys.data.activityJoyList) {
      minLevel.push(j.level)
    }
    minLevel = minLevel.sort()
    console.log('min:', minLevel)

    let mergeTemp = joys.data.activityJoyList.filter((j: Joy) => {
      return j.level === minLevel[0]
    })
    console.log(mergeTemp)

    if (mergeTemp.length >= 2) {
      console.log('aaa')
      await wait(1000)
      res = await api('joyMerge', {"joyOneId": mergeTemp[0].id, "joyTwoId": mergeTemp[1].id, "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
      console.log(res)
      joys = await joyList();
      await merge();
    } else if (mergeTemp.length === 1) {
      console.log('bbb')
      res = await api('joyBuy', {"level": level, "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
      console.log('joyBuy:', res)
      if (res.errMsg === '参数非法') level--
      joys = await joyList();
      await heartBeat()
      await merge()
    }

    await wait(1000)

    await heartBeat()

    resolve()
  })
}

function makeShareCodes() {
  return new Promise<void>(async resolve => {
    res = await api('joyBaseInfo', {"taskId": "167", "inviteType": "", "inviterPin": "", "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
    console.log('用户等级:', res.data.level, '助力码:', res.data.invitePin)
    shareCodes.push(res.data.invitePin)
    userLevel = res.data.level
    await wait(1000)
    await heartBeat()
    resolve()
  })
}

function heartBeat() {
  return new Promise<void>(resolve => {
    axios.get("https://api.m.jd.com/?functionId=gameHeartbeat&body={%22businessCode%22:1,%22linkId%22:%22LsQNxL7iWDlXUs6cFl-AAg%22}&_t=1625556213451&appid=activities_platform", {
      headers: {
        'host': 'api.m.jd.com',
        'User-agent': USER_AGENT,
        'cookie': cookie,
        'origin': 'https://joypark.jd.com',
        'referer': 'https://joypark.jd.com'
      }
    }).then(async () => {
      resolve()
    })
  })
}

function wait(t: number) {
  return new Promise<void>(resolve => {
    setTimeout(async () => {
      await heartBeat()
      resolve()
    }, 2000)
  })
}

function requireConfig() {
  return new Promise(resolve => {
    console.log('\n====================Hello World====================\n');
    console.log('开始获取配置文件\n');
    const jdCookieNode = require('./jdCookie.js');
    Object.keys(jdCookieNode).forEach((item) => {
      if (jdCookieNode[item]) {
        cookiesArr.push(jdCookieNode[item]);
      }
    })
    console.log(`共${cookiesArr.length}个京东账号\n`);
    resolve(0);
  })
}

function TotalBean() {
  return new Promise<void>(async resolve => {
    axios.get('https://me-api.jd.com/user_new/info/GetJDUserInfoUnion', {
      headers: {
        Host: "me-api.jd.com",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": USER_AGENT,
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }).then(res => {
      if (res.data) {
        let data = res.data
        if (data['retcode'] === "1001") {
          $.isLogin = false; //cookie过期
          return;
        }
        if (data['retcode'] === "0" && data['data'] && data.data.hasOwnProperty("userInfo")) {
          $.nickName = data.data.userInfo.baseInfo.nickname;
        }
      } else {
        console.log('京东服务器返回空数据');
      }
    }).catch(e => {
      console.log('Error:', e)
    })
    resolve();
  })
}
