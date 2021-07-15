/**
 * 极速版-发财大赢家
 *
 * 要先手动开红包
 *
 * 只有内部互助
 *
 * 其他功能下次
 */

import axios from 'axios'
import USER_AGENT, {TotalBean} from './TS_USER_AGENTS'
import * as dotenv from 'dotenv'

const notify = require('./sendNotify')
dotenv.config()

let UserName: string, index: number, cookie: string = '', cookiesArr: string[] = [], res: any = '';
let shareCodes: userInfo[] = []

// let HELP_HW: string = process.env.HELP_HW ? process.env.HELP_HW : "true";
// console.log('帮助HelloWorld:', HELP_HW)
// let HELP_POOL: string = process.env.HELP_POOL ? process.env.HELP_POOL : "true";
// console.log('帮助助力池:', HELP_POOL)

interface userInfo {
  redEnvelopeId: string,
  markedPin: string
}

!(async () => {
  await requireConfig();
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

    await makeShareCodes();
    await wait(2000)
  }

  console.log(shareCodes)

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    for (let share of shareCodes) {
      await help(share.redEnvelopeId, share.markedPin)
      await wait(2000)
    }
  }
})()

function makeShareCodes() {
  return new Promise<void>(async resolve => {
    let {data} = await axios.get(`https://api.m.jd.com/?functionId=redEnvelopeInteractHome&body={%22linkId%22:%22yMVR-_QKRd2Mq27xguJG-w%22,%22redEnvelopeId%22:%22%22,%22inviter%22:%22%22,%22helpType%22:%22%22}&t=${Date.now()}&appid=activities_platform&clientVersion=3.5.8`, {
      headers: {
        'host': 'api.m.jd.com',
        'Origin': 'https://618redpacket.jd.com',
        'Cookie': cookie,
        'User-Agent': USER_AGENT,
        'Referer': 'https://618redpacket.jd.com/',
      }
    })
    let userInfo: userInfo = {
      redEnvelopeId: data.data.redEnvelopeId,
      markedPin: data.data.markedPin
    }
    console.log(userInfo)
    shareCodes.push(userInfo)
    resolve()
  })
}

function help(redEnvelopeId: string, inviter: string) {
  return new Promise<void>(async resolve => {
    let {data} = await axios.get(`https://api.m.jd.com/?functionId=redEnvelopeInteractHome&body={%22linkId%22:%22yMVR-_QKRd2Mq27xguJG-w%22,%22redEnvelopeId%22:%22${redEnvelopeId}%22,%22inviter%22:%22${inviter}%22,%22helpType%22:%221%22}&t=${Date.now()}&appid=activities_platform&clientVersion=3.5.8`, {
      headers: {
        'host': 'api.m.jd.com',
        'Origin': 'https://618redpacket.jd.com',
        'Cookie': cookie,
        'User-Agent': USER_AGENT,
        'Referer': 'https://618redpacket.jd.com/',
      }
    })

    console.log(data)

    resolve()
  })
}

function requireConfig() {
  return new Promise<void>(resolve => {
    console.log('开始获取配置文件\n')
    const jdCookieNode = require('./jdCookie.js');
    Object.keys(jdCookieNode).forEach((item) => {
      if (jdCookieNode[item]) {
        cookiesArr.push(jdCookieNode[item])
      }
    })
    console.log(`共${cookiesArr.length}个京东账号\n`)
    resolve()
  })
}

function wait(t: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, t)
  })
}
