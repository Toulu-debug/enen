/**
 * 提现金额，可选0.1 0.5 1 2 10
 * export CFD_CASHOUT_MONEY=0.1
 *
 * 顺序、数量必须与cookie一致
 * export CFD_CASH_TOKEN='[{"strPgtimestamp":"你的值","strPhoneID":"你的值","strPgUUNum":"你的值"},{"strPgtimestamp":"你的值","strPhoneID":"你的值","strPgUUNum":"你的值"}]'
 *
 * to be continued
 */

import {format} from 'date-fns';
import axios from 'axios';
import USER_AGENT, {requireConfig, TotalBean, wait} from './TS_USER_AGENTS';
import jxtoken from './jdJxToken'
import * as dotenv from 'dotenv';

const CryptoJS = require('crypto-js')
const notify = require('./sendNotify')
dotenv.config()
let appId: number = 10028, fingerprint: string | number, token: string = '', enCryptMethodJD: any;
let cookie: string = '', res: any = '', UserName: string, index: number;

let money: number = process.env.CFD_CASHOUT_MONEY ? parseFloat(process.env.CFD_CASHOUT_MONEY) * 100 : 10
let CFD_CASH_TOKEN: any = process.env.CFD_CASH_TOKEN ?? []

if (CFD_CASH_TOKEN.length === 0) {
  jxtoken.map((value) => {
    value.strPgtimestamp ? CFD_CASH_TOKEN.push(value) : ''
  })
} else {
  CFD_CASH_TOKEN = JSON.parse(CFD_CASH_TOKEN)
}

console.log(CFD_CASH_TOKEN)

interface Params {
  ddwMoney?: number,
  ddwPaperMoney?: number,
  strPgtimestamp?: string,
  strPgUUNum?: string,
  strPhoneID?: string,
  strBuildIndex?: string,
  dwType?: string,
  dwFirst?: number,
  __t?: number,
  strBT?: string,
  dwIdentityType?: number,
  strBussKey?: string,
  strMyShareId?: string,
  ddwCount?: number,
  taskId?: number,
  ddwConsumeCoin?: number,
  dwIsFree?: number,
}

!(async () => {
  await requestAlgo();
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
    if (!CFD_CASH_TOKEN[i]) {
      console.log('token数量不足')
      break
    }

    // TODO 激活资格
    for (let j = 0; j < 2; j++) {
      for (let b of ['food', 'fun', 'shop', 'sea']) {
        res = await api('user/CollectCoin', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strZone', {strBuildIndex: b, dwType: '1'})
        console.log(`${b}收金币:`, res.ddwCoin)
        await wait(500)
      }
    }

    while (1) {
      res = await speedUp('_cfd_t,bizCode,dwEnv,ptag,source,strBuildIndex,strZone')
      console.log('今日热气球:', res.dwTodaySpeedPeople)
      if (res.dwTodaySpeedPeople >= 20)
        break
      await wait(300)
    }

    res = await api('user/ComposeGameState', '', {dwFirst: 1})
    let strDT: string = res.strDT, strMyShareId: string = res.strMyShareId
    res = await api('user/RealTmReport', '', {dwIdentityType: 0, strBussKey: 'composegame', strMyShareId: strMyShareId, ddwCount: 5})
    await wait(1000)
    res = await api('user/ComposeGameAddProcess', '__t,strBT,strZone', {__t: Date.now(), strBT: strDT})

    res = await api('user/EmployTourGuideInfo', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    if (!res.TourGuideList) {
      console.log('手动雇佣4个试用导游')
    } else {
      for (let e of res.TourGuideList) {
        if (e.strBuildIndex !== 'food' && e.ddwRemainTm === 0) {
          let employ: any = await api('user/EmployTourGuide', '_cfd_t,bizCode,ddwConsumeCoin,dwEnv,dwIsFree,ptag,source,strBuildIndex,strZone',
            {ddwConsumeCoin: e.ddwCostCoin, dwIsFree: 0, strBuildIndex: e.strBuildIndex})
          if (employ.iRet === 0)
            console.log(`雇佣${e.strBuildIndex}导游成功`)
          await wait(300)
        }
      }
    }

    // 任务➡️
    let tasks: any
    tasks = await api('story/GetActTask', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    for (let t of tasks.Data.TaskList) {
      if (t.dwCompleteNum === t.dwTargetNum && t.dwAwardStatus === 2) {
        res = await api('Award', '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId', {taskId: t.ddwTaskId})
        if (res.ret === 0) {
          console.log(`${t.strTaskName}领奖成功:`, res.data.prizeInfo)
        }
        await wait(300)
      }
    }

    // 提现
    console.log('开始提现：', format(new Date(), 'hh:mm:ss:SSS'))
    res = await api('user/CashOutQuali',
      '_cfd_t,bizCode,dwEnv,ptag,source,strPgUUNum,strPgtimestamp,strPhoneID,strZone',
      {strPgUUNum: CFD_CASH_TOKEN[i].strPgUUNum, strPgtimestamp: CFD_CASH_TOKEN[i].strPgtimestamp, strPhoneID: CFD_CASH_TOKEN[i].strPhoneID})
    console.log('资格：', res)

    res = await api('user/CashOut',
      '_cfd_t,bizCode,ddwMoney,ddwPaperMoney,dwEnv,ptag,source,strPgUUNum,strPgtimestamp,strPhoneID,strZone',
      {ddwMoney: money, ddwPaperMoney: money * 10, strPgUUNum: CFD_CASH_TOKEN[i].strPgUUNum, strPgtimestamp: CFD_CASH_TOKEN[i].strPgtimestamp, strPhoneID: CFD_CASH_TOKEN[i].strPhoneID})
    console.log('提现', res)
  }
})()

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

function speedUp(stk: string) {
  return new Promise(async (resolve, reject) => {
    let url: string = `https://m.jingxi.com/jxbfd/user/SpeedUp?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&strBuildIndex=food&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(stk)}`
    url += '&h5st=' + decrypt(stk, url)
    try {
      let {data} = await axios.get(url, {
        headers: {
          'Host': 'm.jingxi.com',
          'Referer': 'https://st.jingxi.com/',
          'User-Agent': USER_AGENT,
          'Cookie': cookie
        }
      })
      resolve(data)
    } catch (e) {
      reject(502)
    }
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
