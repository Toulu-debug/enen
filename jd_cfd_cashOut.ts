/**
 * 0～30秒开始执行，31～59秒死循环等待
 * 提现金额：0.1、0.5、1、2、10
 * 解锁提现方式：升级1个建筑，留金币够升级一个建筑
 * 自动模拟提现token，不需要抓包
 */

import {format} from 'date-fns';
import axios from 'axios';
import {Md5} from 'ts-md5'
import USER_AGENT, {requireConfig, wait} from './TS_USER_AGENTS';
import * as dotenv from 'dotenv';

const CryptoJS = require('crypto-js')
dotenv.config()
let appId: number = 10028, fingerprint: string | number, token: string = '', enCryptMethodJD: any;
let cookie: string = '', res: any = '', UserName: string, index: number;

interface Params {
  ddwMoney?: number,
  ddwPaperMoney?: number,
  strPgtimestamp?: string,
  strPgUUNum?: string,
  strPhoneID?: string,
  strBuildIndex?: string,
  ddwCostCoin?: number,
}

!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    while (1) {
      if (new Date().getSeconds() < 30) {
        break
      } else {
        await wait(100)
      }
    }

    // 只在00:00:xx和12:00:xx升级建筑
    if ((new Date().getHours() === 0 && (new Date().getMinutes() === 0)) || (new Date().getHours() === 12 && new Date().getMinutes() === 0)) {
      for (let b of ['food', 'fun', 'shop', 'sea']) {
        res = await api('user/GetBuildInfo', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strZone', {strBuildIndex: b})
        if (res.dwCanLvlUp === 1) {
          res = await api('user/BuildLvlUp', '_cfd_t,bizCode,ddwCostCoin,dwEnv,ptag,source,strBuildIndex,strZone', {ddwCostCoin: res.ddwNextLvlCostCoin, strBuildIndex: b})
          if (res.iRet === 0) {
            console.log(`升级成功:`, res)
            break
          }
        }
      }
    }

    // 提现
    console.log('解锁：', format(new Date(), 'hh:mm:ss:SSS'))
    let token: any = await getJxToken(cookie)
    res = await api('user/CashOutQuali',
      '_cfd_t,bizCode,dwEnv,ptag,source,strPgUUNum,strPgtimestamp,strPhoneID,strZone',
      {strPgUUNum: token.strPgUUNum, strPgtimestamp: token.strPgtimestamp, strPhoneID: token.strPhoneID})
    console.log('资格:', res)
    await wait(4000)
    console.log('提现：', format(new Date(), 'hh:mm:ss:SSS'))
    let money: number = 100
    money = process.env.CFD_CASHOUT_MONEY ? parseFloat(process.env.CFD_CASHOUT_MONEY) * 100 : money

    money = new Date().getHours() >= 12 ? 50 : money

    console.log('本次计划提现：', money / 100)
    res = await api('user/CashOut', '_cfd_t,bizCode,ddwMoney,ddwPaperMoney,dwEnv,ptag,source,strPgUUNum,strPgtimestamp,strPhoneID,strZone',
      {ddwMoney: money, ddwPaperMoney: money * 10, strPgUUNum: token.strPgUUNum, strPgtimestamp: token.strPgtimestamp, strPhoneID: token.strPhoneID})
    console.log('提现:', res)

    /*
    await wait(3000)
    money = 10
    res = await api('user/CashOut',
      '_cfd_t,bizCode,ddwMoney,ddwPaperMoney,dwEnv,ptag,source,strPgUUNum,strPgtimestamp,strPhoneID,strZone',
      {ddwMoney: money, ddwPaperMoney: money * 10, strPgUUNum: token.strPgUUNum, strPgtimestamp: token.strPgtimestamp, strPhoneID: token.strPhoneID})
    console.log('提现:', res)
     */
  }
})()

function getJxToken(cookie: string) {
  function generateStr(input: number) {
    let src = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let res = '';
    for (let i = 0; i < input; i++) {
      res += src[Math.floor(src.length * Math.random())];
    }
    return res;
  }

  return new Promise(resolve => {
    let phoneId = generateStr(40);
    let timestamp = Date.now().toString();
    if (!cookie['match'](/pt_pin=([^; ]+)(?=;?)/)) {
      console.log('此账号cookie填写不规范,你的pt_pin=xxx后面没分号(;)\n');
      resolve({});
    }
    let nickname = cookie.match(/pt_pin=([^;]*)/)![1];
    let jstoken = Md5.hashStr('' + decodeURIComponent(nickname) + timestamp + phoneId + 'tPOamqCuk9NLgVPAljUyIHcPRmKlVxDy');
    resolve({
      'strPgtimestamp': timestamp,
      'strPhoneID': phoneId,
      'strPgUUNum': jstoken
    })
  });
}

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise(async resolve => {
    let url = `https://m.jingxi.com/jxbfd/${fn}?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=138631.26.55&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(stk)}`
    if (['GetUserTaskStatusList', 'Award', 'DoTask'].includes(fn)) {
      console.log('api2')
      url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?strZone=jxbfd&bizCode=jxbfddch&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=138631.26.55&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2`
    }
    if (Object.keys(params).length !== 0) {
      let key: (keyof Params)
      for (key in params) {
        if (params.hasOwnProperty(key))
          url += `&${key}=${params[key]}`
      }
    }
    url += '&h5st=' + decrypt(stk, url)
    let {data} = await axios.get(url, {
      headers: {
        Cookie: cookie,
        Referer: "https://st.jingxi.com/fortune_island/index.html?ptag=138631.26.55",
        Host: "m.jingxi.com",
        "User-Agent": `jdpingou`,
      }
    })
    resolve(data)
  })
}

async function requestAlgo() {
  fingerprint = await generateFp();
  return new Promise<void>(async resolve => {
    let {data} = await axios.post('https://cactus.jd.com/request_algo?g_ty=ajax', {
      "version": "1.0",
      "fp": fingerprint,
      "appId": appId,
      "timestamp": Date.now(),
      "platform": "web",
      "expandParams": ""
    }, {
      "headers": {
        'Authority': 'cactus.jd.com',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/json',
        'Origin': 'https://st.jingxi.com',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://st.jingxi.com/',
        'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
      },
    })
    if (data['status'] === 200) {
      token = data.data.result.tk;
      console.log('token:', token)
      let enCryptMethodJDString = data.data.result.algo;
      if (enCryptMethodJDString) enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
    } else {
      console.log(`fp: ${fingerprint}`)
      console.log('request_algo 签名参数API请求失败:')
    }
    resolve()
  })
}

function decrypt(stk: string, url: string) {
  const timestamp = (format(new Date(), 'yyyyMMddhhmmssSSS'))
  let hash1: string;
  if (fingerprint && token && enCryptMethodJD) {
    hash1 = enCryptMethodJD(token, fingerprint.toString(), timestamp.toString(), appId.toString(), CryptoJS).toString(CryptoJS.enc.Hex);
  } else {
    const random = '5gkjB6SpmC9s';
    token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
    fingerprint = 9686767825751161;
    // $.fingerprint = 7811850938414161;
    const str = `${token}${fingerprint}${timestamp}${appId}${random}`;
    hash1 = CryptoJS.SHA512(str, token).toString(CryptoJS.enc.Hex);
  }
  let st: string = '';
  stk.split(',').map((item, index) => {
    st += `${item}:${getQueryString(url, item)}${index === stk.split(',').length - 1 ? '' : '&'}`;
  })
  const hash2 = CryptoJS.HmacSHA256(st, hash1.toString()).toString(CryptoJS.enc.Hex);
  return encodeURIComponent(["".concat(timestamp.toString()), "".concat(fingerprint.toString()), "".concat(appId.toString()), "".concat(token), "".concat(hash2)].join(";"))
}

function generateFp() {
  let e = "0123456789";
  let a = 13;
  let i = '';
  for (; a--;)
    i += e[Math.random() * e.length | 0];
  return (i + Date.now()).slice(0, 16)
}

function getQueryString(url: string, name: string) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = url.split('?')[1].match(reg);
  if (r != null) return unescape(r[2]);
  return '';
}
