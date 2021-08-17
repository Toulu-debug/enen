import {format} from 'date-fns';
import axios from 'axios';
import {requireConfig, TotalBean, getBeanShareCode, getFarmShareCode, getRandomNumberByRange, wait} from './TS_USER_AGENTS';
import {Md5} from 'ts-md5'
import * as dotenv from 'dotenv';

const CryptoJS = require('crypto-js')
const notify = require('./sendNotify')
const USER_AGENT = 'jdpingou'
dotenv.config()
let appId: number = 10028, fingerprint: string | number, token: string = '', enCryptMethodJD: any;
let cookie: string = '', res: any = '', factoryId: number;

let UserName: string, index: number;
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

    for (let k = 0; k < 10; k++) {
      res = await getTask()
      console.log(JSON.stringify(res))
      for (let t of res.data.taskConfig) {
        if (t.itemCount !== t.finishCount) {
          let body = {
            "configCode": "e1a458713a854e2abb1db2772e540532",
            "taskType": t.taskType,
            "itemId": t.taskItem.itemId
          }
          res = await api('doTask', body)
          console.log(res)
          await wait(2000)
          res = await api("getReward", body)
          console.log(res)

          await wait(t.viewTime)
          break
        }
      }
    }

    res = await getTask()
    console.log(`有${res.data.chanceLeft}次抽奖机会`)
    for (let j = 0; j < res.data.chanceLeft; j++) {
      await join()
      await wait(5000)
    }
  }
})()

async function api(fn: string, body: any) {
  let {data} = await axios.post(`https://jdjoy.jd.com/module/task/draw/${fn}`, body, {
    headers: {
      'Host': 'jdjoy.jd.com',
      'Referer': 'https://prodev.m.jd.com/mall/active/ebLz35DwiVumB6pcrGkqmnhCgmC/index.html',
      'User-Agent': USER_AGENT,
      'Origin': 'https://prodev.m.jd.com',
      'Content-Type': 'application/json',
      'Cookie': cookie
    }
  })
  return data
}

async function getTask() {
  let {data} = await axios.get("https://jdjoy.jd.com/module/task/draw/get?configCode=e1a458713a854e2abb1db2772e540532&unionCardCode=", {
    headers: {'user-agent': USER_AGENT, 'cookie': cookie}
  })
  return data
}

async function join() {
  let {data} = await axios.get("https://jdjoy.jd.com/module/task/draw/join?configCode=e1a458713a854e2abb1db2772e540532&fp=&eid=", {
    headers: {'user-agent': USER_AGENT, 'cookie': cookie}
  })
  console.log(`抽中：${data.data.rewardName}`)
  return
}