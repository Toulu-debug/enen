import axios from "axios";
import USER_AGENT, {TotalBean} from "./TS_USER_AGENTS";

const notify = require('./sendNotify')

let cookie: string = '', cookiesArr: string[] = [], res: any;
let token2: string = '', buyerNick: string = '', UserName: string;
let index: number, remain: number = 0;

!(async () => {
  await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    if (!isLogin) {
      notify.sendNotify(__filename.split('/').pop(), `cookie已失效\n京东账号${index}：${nickName || UserName}`)
      continue;
    }
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);
    await getIsvToken2();
    res = await api('setMixNick');
    buyerNick = res.data.data.msg

    res = await api('UserInfo')
    console.log('total:', res.data.data.totalChance, 'remain:', res.data.data.remainChance)
    remain = res.data.data.remainChance
    // 换豆
    if (remain > 50000) {
      console.log('乞丐版暂无换豆功能！')
    }

    // 333 * 3
    res = await api('SendCoinNum')
    if (res.data.data.missionTypes.hasGotNum !== res.data.data.missionTypes.dayTop) {
      for (let i = 0; i < 3; i++) {
        res = await mission('treeCoin', i, 'treeCoin')
        console.log(res)
        await wait(5000)
      }
    }

    // 日常任务
    let tasks: any = await api('DailyTask')
    for (let t of tasks.data.data) {
      if (t.dayTop !== t.hasGotNum) {
        // 没做完
        if (t.type === 'viewBanner') {
          for (let i = 1; i < 4; i++) {
            res = await mission('', i, t.type)
            if (res.errorCode === 200 || res.errorCode === '200') {
              console.log('任务完成，获得：', res.data.data.sendNum)
            } else {
              console.log('任务失败：', res)
            }
            await wait(5000)
          }
        }
        if (t.type === 'viewShop') {
          console.log(t.missionName)
          let shopList: any = await api('ShopList')
          for (let s of shopList.data.data) {
            console.log(s.id, s.shopTitle)
            res = await mission('', s.id, t.type)
            if (res.errorCode === 200 || res.errorCode === '200') {
              console.log('任务完成，获得：', res.data.data.sendNum)
            } else {
              console.log('任务失败：', res)
            }
            await wait(5000)
          }
        }
        if (t.type === 'viewGoods') {
          for (let i = 1; i < 5; i++) {
            res = await mission('', i, t.type)
            if (res.errorCode === 200 || res.errorCode === '200') {
              console.log('任务完成，获得：', res.data.data.sendNum)
            } else {
              console.log('任务失败：', res)
            }
            await wait(5000)
          }
        }
      } else {
        console.log(`${t.missionName}--已全部完成`)
      }
    }
  }
})()

function mission(fn: string, goodsNumId: number, missionType: string) {
  let body: any = {
    "jsonRpc": "2.0",
    "params": {
      "commonParameter": {
        "appkey": "51B59BB805903DA4CE513D29EC448375",
        "m": "POST",
        "sign": "0028b0b0431cdff0e69353b74a3aad8e",
        "timestamp": Date.now(),
        "userId": 10299171
      },
      "admJson": {
        "missionType": missionType,
        "method": "/foodRunning/complete/mission",
        "actId": "jd_food_running",
        "buyerNick": buyerNick,
        "pushWay": 1,
        "userId": 10299171
      }
    }
  }
  if (fn === 'jdAward1') {
    Object.assign(body.params.admJson, {awardId: fn})
  } else if (fn === 'treeCoin') {
    Object.assign(body.params.admJson, {which: goodsNumId})
  } else {
    Object.assign(body.params.admJson, {goodsNumId: goodsNumId})
  }
  return new Promise(async resolve => {
    let {data} = await axios.post(`https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171`,
      JSON.stringify(body), {
        headers: {
          'Origin': 'https://jinggengjcq-isv.isvjcloud.com',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': USER_AGENT,
          'Referer': 'https://jinggengjcq-isv.isvjcloud.com/paoku/index.html',
          'Content-Type': 'application/json; charset=UTF-8',
          'Host': 'jinggengjcq-isv.isvjcloud.com',
        }
      })
    resolve(data)
  })
}

function api(fn: string) {
  return new Promise(async resolve => {
    let {data} = await axios.post(`https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/${fn}?open_id=&mix_nick=&bizExtString=&user_id=10299171`,
      JSON.stringify({
        "jsonRpc": "2.0",
        "params": {
          "commonParameter": {
            "appkey": "51B59BB805903DA4CE513D29EC448375",
            "m": "POST",
            "sign": "c29adb1d2c970d64c233d66cbcf3fcdf",
            "timestamp": Date.now(),
            "userId": "10299171"
          },
          "admJson": {
            "source": "01",
            "strTMMixNick": token2,
            "method": `/foodRunning/${fn}`,
            "actId": "jd_food_running",
            "buyerNick": buyerNick,
            "pushWay": 1,
            "userId": "10299171"
          }
        }
      }), {
        headers: {
          'Origin': 'https://jinggengjcq-isv.isvjcloud.com',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': USER_AGENT,
          'Referer': 'https://jinggengjcq-isv.isvjcloud.com/paoku/index.html',
          'Content-Type': 'application/json; charset=UTF-8',
          'Host': 'jinggengjcq-isv.isvjcloud.com',
        }
      })
    resolve(data);
  })
}

function getIsvToken2() {
  return new Promise<void>(async resolve => {
    let {data} = await axios.post("https://api.m.jd.com/client.action?functionId=isvObfuscator&clientVersion=10.0.2&client=android&uuid=818aa057737ba6a4&st=1623934998790&sign=e571148c8dfb456a1795d249c6aa3956&sv=100", 'body=%7B%22id%22%3A%22%22%2C%22url%22%3A%22https%3A//xinruidddj-isv.isvjcloud.com%22%7D', {
      headers: {
        'Host': 'api.m.jd.com',
        'user-agent': USER_AGENT,
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': cookie
      }
    })
    token2 = data.token;
    cookie += 'IsvToken=' + token2 + ';'
    resolve();
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

function wait(t: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, t)
  })
}
