import {format} from 'date-fns';

const CryptoJS = require('crypto-js')
import axios from 'axios';
import USER_AGENT from './TS_USER_AGENTS';

// console.log('时间戳：', format(new Date(), 'yyyyMMddHHmmssSSS'));

let appId: number = 10028, fingerprint: string | number, token: string, enCryptMethodJD: any;
let cookie: string = '', cookiesArr: Array<string> = [], res: any = '', shareCodes: Array<string>;
let homePageInfo: any;

let UserName: string, index: number, isLogin: boolean, nickName: string
!(async () => {
  await requestAlgo();
  await requireConfig();

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    isLogin = true;
    nickName = '';
    await TotalBean();
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

    homePageInfo = await api('queryservice/GetHomePageInfo', 'channel,sceneid')
    let food: number = homePageInfo.data.materialinfo[0].value;
    let petid: number = homePageInfo.data.petinfo[0].petid
    let coins = homePageInfo.data.coins;

    console.log('pet id:', petid)
    console.log('现有草:', food);
    console.log('金币:', coins);

    while (coins >= 5000 && food <= 500) {
      res = await api('operservice/Buy', 'channel,sceneid,type', {type: '1'})
      if (res.ret === 0) {
        console.log('买草成功:', res.data.newnum)
        coins -= 5000
        food += 100
      } else {
        console.log(res)
        break
      }
      await wait(1500)
    }
    await wait(2000)

    while (food >= 10) {
      res = await api('operservice/Feed', 'channel,sceneid')
      if (res.ret === 0) {
        food -= 10
        console.log('剩余草:', res.data.newnum)
      } else if (res.data.maintaskId === 'pause' && res.ret === 2020) {
        console.log('收🥚')
        res = await api('operservice/GetSelfResult', 'channel,itemid,sceneid,type', {petid: petid, type: '11'})
        if (res.ret === 0) {
          console.log('收🥚成功:', res.data.newnum)
        }
      } else {
        console.log(res)
        break
      }
      await wait(3000)
    }
    await wait(2000)

    while (1) {
      res = await api('operservice/Action', 'channel,sceneid,type', {type: '2'})
      console.log(res)
      if (res.data.addcoins === 0) break
      console.log('锄草:', res.data.addcoins)
      await wait(1500)
    }
    await wait(2000)

    while (1) {
      res = await api('operservice/Action', 'channel,sceneid,type', {type: '1', petid: petid})
      console.log(res)
      if (res.data.addcoins === 0) break
      console.log('挑逗:', res.data.addcoins)
      await wait(1500)
    }
    await wait(2000)

    let tasks: any

    break
  }
})()

interface Params {
  petid?: number,
  type?: string,

}

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise(async resolve => {
    let url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(stk)}`
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
        'User-Agent': USER_AGENT,
        'Referer': 'https://st.jingxi.com/pingou/jxmc/index.html',
        'Host': 'm.jingxi.com',
        'Cookie': cookie
      }
    })

    resolve(data)
  })
}

async function requestAlgo() {
  fingerprint = await generateFp();
  return new Promise(async resolve => {
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
      let enCryptMethodJDString = data.data.result.algo;
      if (enCryptMethodJDString) enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
    } else {
      console.log(`fp: ${fingerprint}`)
      console.log('request_algo 签名参数API请求失败:')
    }
    resolve(200)
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
          isLogin = false; //cookie过期
          return;
        }
        if (data['retcode'] === "0" && data['data'] && data.data.hasOwnProperty("userInfo")) {
          nickName = data.data.userInfo.baseInfo.nickname;
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
    setTimeout(async () => {
      resolve()
    }, t === 0 ? 1000 : t)
  })
}