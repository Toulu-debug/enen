import axios from 'axios';
import USER_AGENT from './TS_USER_AGENTS';
// @ts-ignore
import {getBody} from './a'

let $: any = {};
let cookie: string = '', cookiesArr: Array<string> = [], res: any = '', shareCodes: Array<string> = [];
let joyId: Array<number> = [], workJoyInfoList: any = [];
let joyId1: number, userLevel: number, Joys: Joy[] = [];
let joys: any;
let level: number = 5, runtimes: number = 0;

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
    let tasks: any

    let allTask: any = await api('olympicgames_getTaskDetail', {"taskId": "", "appSign": "1"})

    console.log(allTask.data.result.taskVos[1].taskName)

    let ss = await getBody('doTaskDetail', 9, 9, cookie)
    ss = {
      taskId: 9,
      taskToken: allTask.data.result.taskVos[1].browseShopVo[0].taskToken,
      ss: ss,
      actionType: 1
    }
    console.log(ss)
    res = await api('olympicgames_doTaskDetail', ss)
    console.log(res)
    console.log('等待中...')
    await wait(6500)
    res = await api('olympicgames_getTaskDetail', {"taskId": 9, "appSign": "1"})
    console.log(JSON.stringify(res.data.result.taskVos))


    /**
     * 1           shoppingActivityVos
     * 17 浏览商品0 productInfoVos
     * 9  浏览店铺6 browseShopVo
     * 7          shoppingActivityVos
     */
    for (let i = 1; i < 3; i++) {
      let ss = await getBody('collectCurrency', '', '', cookie)
      res = await api('olympicgames_collectCurrency', {
        type: i,
        ss: ss
      })
      console.log(res)
      await wait(1000)
    }

    tasks = await api('olympicgames_getTaskDetail', {"taskId": 17, "appSign": "1"})
    for (let t of tasks.data.result.taskVos) {
      if (t.productInfoVos) {
        console.log(t.waitDuration)
        for (let tp of t.productInfoVos) {
          if (tp.status === 1) {
            console.log(tp.title, tp.taskToken, t.taskId)
            let ss = await getBody('doTaskDetail', 9, 9, cookie)
            res = await api('olympicgames_doTaskDetail', {
              taskId: 17,
              taskToken: tp.taskToken,
              ss: ss
            })
            console.log(res)
            if (res.data.bizMsg === '这个任务做完啦~！') break
            console.log('等待中...')
            await wait(t.waitDuration * 1100)
            await api('olympicgames_getTaskDetail', {"taskId": '9', "appSign": "1"})
          }
        }
      }
    }


    tasks = await api('olympicgames_getTaskDetail', {"taskId": 7, "appSign": "1"})
    for (let t of tasks.data.result.taskVos) {
      if (t.shoppingActivityVos) {
        console.log(t.waitDuration)
        for (let tp of t.shoppingActivityVos) {
          if (tp.status === 1) {
            console.log(tp.shopName, tp.taskToken, t.taskId)
            let ss = await getBody('doTaskDetail', 9, 9, cookie)
            ss = {
              taskId: 7,
              taskToken: tp.taskToken,
              ss: ss
            }
            console.log(ss)

            res = await api('olympicgames_doTaskDetail', ss)
            console.log(res)
            console.log('等待中...')
            await wait(t.waitDuration * 1100)
            await api('olympicgames_getTaskDetail', {"taskId": '9', "appSign": "1"})
          }
        }
      }
    }

    /*
        tasks = await api('olympicgames_getTaskDetail', {"taskId": 5, "appSign": "1"})
        for (let t of tasks.data.result.taskVos) {
          if (t.shoppingActivityVos) {
            console.log(t.waitDuration)
            for (let tp of t.shoppingActivityVos) {
              if (tp.status === 1) {
                console.log(tp.title, tp.taskToken, t.taskId)
                let ss = await getBody('doTaskDetail', 9, 9, cookie)
                ss = {
                  taskId: 5,
                  taskToken: tp.taskToken,
                  ss: ss
                }
                console.log(ss)
                res = await api('olympicgames_doTaskDetail', ss)
                console.log(res)
                console.log('等待中...')
                await wait(t.waitDuration * 1100)
                await api('olympicgames_getTaskDetail', {"taskId": '9', "appSign": "1"})
              }
            }
          }
        }
    */
    break
  }
})()

function api(fn: string, body: any): Object {
  return new Promise(async resolve => {
    let {data} = await axios.post(`https://api.m.jd.com/client.action?advId=${fn}`,
      `functionId=${fn}&body=${JSON.stringify(body)}&client=wh5&clientVersion=1.0.0&appid=o2_act`, {
        headers: {
          'Referer': 'https://wbbny.m.jd.com/babelDiy/Zeus/2rtpffK8wqNyPBH6wyUDuBKoAbCt/index.html',
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://wbbny.m.jd.com',
          'Accept': 'application/json',
          'Host': 'api.m.jd.com',
          'Cookie': cookie
        }
      })
    resolve(data);
  })
}

function makeShareCodes() {
  return new Promise<void>(async resolve => {
    res = await api('joyBaseInfo', {"taskId": "167", "inviteType": "", "inviterPin": "", "linkId": "LsQNxL7iWDlXUs6cFl-AAg"})
    console.log('用户等级:', res.data.level, '助力码:', res.data.invitePin)
    shareCodes.push(res.data.invitePin)
    userLevel = res.data.level
    await wait(1000)
    resolve()
  })
}

function wait(t: number) {
  return new Promise<void>(resolve => {
    setTimeout(async () => {
      resolve()
    }, t === 0 ? 1000 : t)
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
