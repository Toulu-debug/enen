import axios from 'axios';
import USER_AGENT from './TS_USER_AGENTS';

let $: any = {};
let cookie: string = '', cookiesArr: Array<string> = [];
let balance: number;

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
    let taskVos: any = await api('healthyDay_getHomeData', {"appId": "1EFVQwQ", "taskToken": "", "channelId": 1});
    balance = taskVos.data.result.userInfo.userScore * 1
    console.log('余额:', balance)
    while (balance >= 500) {
      console.log('exchange()')
      let res: any = await api('interact_template_getLotteryResult', {"appId": "1EFVQwQ"})
      // console.log('抽奖结果:', res.data.result.lotteryReturnCode)
      console.log('抽奖结果:', res.data)
      balance -= 500
    }

    let tasks: any = taskVos.data.result.taskVos
    for (let t of tasks) {
      console.log(t.taskName)
      if (t.status === 1) {
        if (t.shoppingActivityVos) {
          for (let tp of t.shoppingActivityVos) {
            await doTask(tp.taskToken, t.taskId, t.waitDuration)
          }
        }

        if (t.productInfoVos) {
          for (let tp of t.productInfoVos) {
            console.log(tp.skuName, tp.taskToken)
            await doTask(tp.taskToken, t.taskId, t.waitDuration)
          }
        }

        if (t.followShopVo) {
          for (let tp of t.followShopVo) {
            console.log(tp.shopName, tp.taskToken)
            await doTask(tp.taskToken, t.taskId, 0)
          }
        }
      }
    }
    console.log('-------------------------------')
    await wait(1000)
  }
})()

function api(Fn: string, body: Object): Object {
  return new Promise(async resolve => {
    let {data} = await axios.post(`https://api.m.jd.com/client.action`,
      `functionId=${Fn}&body=${JSON.stringify(body)}&client=wh5&clientVersion=1.0.0`,
      {
        headers: {
          'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/UQwNm9fNDey3xNEUTSgpYikqnXR/index.html',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://h5.m.jd.com',
          'User-Agent': USER_AGENT,
          'Host': 'api.m.jd.com',
          'cookie': cookie
        }
      })
    resolve(data);
  })
}

function doTask(taskToken: string, taskId: number, timeout: number) {
  return new Promise<void>(async resolve => {
    let res: any;
    if (timeout !== 0) {
      res = await api('harmony_collectScore', {"appId": "1EFVQwQ", "taskToken": taskToken, "taskId": taskId, "actionType": 1})
      console.log('领取任务: ', res.data.bizMsg, '\n等待中...');
      await wait(timeout * 1000);
    }
    res = await api('harmony_collectScore', {"appId": "1EFVQwQ", "taskToken": taskToken, "taskId": taskId, "actionType": 0});
    if (res.code === 0) {
      try {
        console.log(`任务成功: 获得${res.data.result.score * 1} 余额: ${res.data.result.userScore * 1}`);
      } catch (e) {
        console.log(`任务错误: `, JSON.stringify(res))
      }
    }
    await wait(1000);
    resolve();
  })
}

function wait(t: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, t)
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
