/**
 * 京喜财富岛库存监控
 * 非死循环脚本
 * 自行设置cron
 *
 * 添加需要监控的品名，&分隔
 * export CFD_STOCK="必胜客50元美食卡&星巴克50元代金券"
 *
 */

import {format} from 'date-fns';
import axios from 'axios';
import USER_AGENT from './TS_USER_AGENTS';
import * as dotenv from 'dotenv';

const CryptoJS = require('crypto-js')
const notify = require('./sendNotify.js')
dotenv.config()
let appId: number = 10028, fingerprint: string | number, token: string = '', enCryptMethodJD: any;
let cookie: string = '', cookiesArr: string[] = [], res: any = '';

let target: string[] = process.env.CFD_STOCK
  ? process.env.CFD_STOCK.split('&')
  : ['必胜客50元美食卡', '星巴克50元代金券']

!(async () => {
  await requestAlgo();
  await requireConfig();
  cookie = cookiesArr[0]
  res = await api('user/ExchangeState', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strZone', {dwType: '0'})

  for (let j of res.goods) {
    let name = j.strPrizeName.trim()
    let stock = j.dwStockNum
    console.log(name, stock)
    if (target.includes(name) && stock !== 0) {
      notify.sendNotify(`财富岛补货\n\n${name}`, `库存：${stock}`, '', '\n\n你好，世界！')
    }
  }
})()

interface Params {
  dwType?: string,
}

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise(async resolve => {
    let url = `https://m.jingxi.com/jxbfd/${fn}?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(stk)}`
    if (['GetUserTaskStatusList', 'Award', 'DoTask'].includes(fn)) {
      console.log('api2')
      url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?strZone=jxbfd&bizCode=jxbfddch&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2`
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
        'Host': 'm.jingxi.com',
        'Referer': 'https://st.jingxi.com/',
        'User-Agent': USER_AGENT,
        'Cookie': cookie
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

function wait(t: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, t)
  })
}
