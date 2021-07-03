/**
 *
 * Running time limit:
 * s >= 58 or s <= 30  => exchange()
 * s > 30 and s < 58  =>  wait...
 * 
 */
import axios from 'axios';
import USER_AGENT from './TS_USER_AGENTS';
import * as fs from 'fs';

let $: any = {};
let cookie: string = '', cookiesArr: Array<string> = [], validate: string = '';
let target: number = process.env.JD_JOY_REWARD_NAME ? parseInt(process.env.JD_JOY_REWARD_NAME) : 500;

!(async () => {
  let validate_arr: string | Array<string> = fs.readFileSync('./validate.txt', 'utf-8')
  if (validate_arr.indexOf('\n')) {
    validate_arr = validate_arr.split('\n')
    validate_arr.pop()
  }
  await requireConfig();

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    $.index = i + 1;
    $.isLogin = true;
    $.nickName = '';
    await TotalBean();
    console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);

    if (i < validate_arr.length)
      validate = validate_arr[i]
    else {
      console.log('预存验证码不够用，退出！')
      break
    }

    let tasks: any = await init();
    let h: number = new Date().getHours();
    let config: any;

    if (h >= 0 && h < 8)
      config = tasks.data['beanConfigs0']
    if (h >= 8 && h < 16)
      config = tasks.data['beanConfigs8']
    if (h >= 16 && h < 24)
      config = tasks.data['beanConfigs16']
    for (let bean of config) {
      console.log(bean.id, bean.giftName, bean.leftStock)
      if (bean.giftValue === target) {
        await exchange(bean.id)
      }
    }
  }
})()

function init() {
  return new Promise(async resolve => {
    let {data} = await axios.get(`https://jdjoy.jd.com/common/gift/getBeanConfigs?reqSource=h5&invokeKey=NRp8OPxZMFXmGkaE&validate=${validate}`, {
      headers: {
        'Host': 'jdjoy.jd.com',
        'content-type': 'application/json',
        'origin': 'https://h5.m.jd.com',
        "User-Agent": USER_AGENT,
        'referer': 'https://jdjoy.jd.com/',
        'cookie': cookie
      }
    })
    resolve(data);
  })
}

function exchange(beanId: number) {
  console.log('exchange()')
  return new Promise<void>(async resolve => {
    while (1) {
      let s: number = new Date().getSeconds();
      if (s >= 58 || s <= 30) {
        break
      } else {
        await wait(500)
      }
    }
    let {data} = await axios.post(`https://jdjoy.jd.com/common/gift/new/exchange?reqSource=h5&invokeKey=NRp8OPxZMFXmGkaE&validate=${validate}`,
      JSON.stringify({"buyParam": {"orderSource": 'pet', "saleInfoId": beanId}, "deviceInfo": {}}), {
        headers: {
          "Host": "jdjoy.jd.com",
          "Accept-Language": "zh-cn",
          "Content-Type": "application/json",
          "Origin": "https://jdjoy.jd.com",
          "User-Agent": USER_AGENT,
          "Referer": "https://jdjoy.jd.com/pet/index",
          "Cookie": cookie
        }
      })
    console.log(data);
    resolve();
  })
}

function wait(t: number) {
  return new Promise(e => setTimeout(e, t))
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
