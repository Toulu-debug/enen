/**
 *
 * Running time limit:
 * s >= 58 or s <= 30  => exchange()
 * s > 30 and s < 58  =>  wait...
 *
 */
import axios from 'axios';
import USER_AGENT, {requireConfig, TotalBean, wait} from './TS_USER_AGENTS';
import * as fs from 'fs';

const notify = require('./sendNotify')

let $: any = {};
let cookie: string = '', validate: string = '', UserName: string, index: number;
let target: number = process.env.JD_JOY_REWARD_NAME ? parseInt(process.env.JD_JOY_REWARD_NAME) : 500;

!(async () => {
  let validate_arr: string | Array<string> = fs.readFileSync('./validate.txt', 'utf-8')
  if (validate_arr.indexOf('\n')) {
    validate_arr = validate_arr.split('\n')
    validate_arr.pop()
  }
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
    let {data} = await axios.get(`https://jdjoy.jd.com/common/gift/getBeanConfigs?reqSource=h5&invokeKey=qRKHmL4sna8ZOP9F&validate=${validate}`, {
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
    let {data} = await axios.post(`https://jdjoy.jd.com/common/gift/new/exchange?reqSource=h5&invokeKey=qRKHmL4sna8ZOP9F&validate=${validate}`,
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
