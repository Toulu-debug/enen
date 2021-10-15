/**
 * 极速版-发财大赢家
 * cron : 0 0,8,20 * * *
 */

import axios from 'axios';
import {requireConfig, requestAlgo, wait} from './TS_USER_AGENTS';

let cookie: string, res: any, UserName: string, index: number;
let shareCodesSelf: { redEnvelopeId: string, inviter: string }[] = [], shareCodes: { redEnvelopeId: string, inviter: string }[] = [], shareCodesHW: any;

!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();
  await wait(30 * 1000)
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    res = await api('openRedEnvelopeInteract', {"linkId": "yMVR-_QKRd2Mq27xguJG-w"});
    if (res.code === 0) {
      console.log('当前进度:', res.data.amount * 1, ' 还需要:', res.data.needAmount * 1 ?? (10 - res.data.needAmount * 1).toFixed(2))
      await wait(1000)
      res = await api('redEnvelopeInteractHome', {"linkId": "yMVR-_QKRd2Mq27xguJG-w", "redEnvelopeId": "", "inviter": "", "helpType": ""})
      shareCodesSelf.push({
        redEnvelopeId: res.data.redEnvelopeId,
        inviter: res.data.markedPin
      })
      await wait(1000)
    } else {
      console.log('火爆？')
    }
  }

  console.log('内部助力码:', shareCodesSelf)

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    await getCodesHW();
    if (i === 0)
      shareCodes = [...shareCodesHW, ...shareCodesSelf]
    else
      shareCodes = [...shareCodesSelf, ...shareCodesHW]

    for (let boss of shareCodes) {
      console.log(`账号${i + 1} ${UserName} 去助力 `, boss.redEnvelopeId)
      res = await api('openRedEnvelopeInteract', {"linkId": "yMVR-_QKRd2Mq27xguJG-w", "redEnvelopeId": boss.redEnvelopeId, "inviter": boss.inviter, "helpType": "1"})
      res = res.data.helpResult
      if (res.code === 16013) {
        console.log('上限')
        break
      } else if (res.code === 16012) {
        console.log('已助力过')
      } else if (res.code === 0) {
        console.log('成功', res.data.amount)
      } else if (res.code === 16004) {
        console.log('不助力自己')
      } else {
        console.log('其他错误:', JSON.stringify(res.data.helpResult))
      }
      await wait(3000)
    }
  }
})()

async function api(fn: string, params: object, stk: string = '') {
  let t = Date.now()
  let url = `https://api.m.jd.com/?functionId=${fn}&t=${t}&appid=activities_platform&client=H5&clientVersion=1.0.0&body=${encodeURIComponent(JSON.stringify(params))}`
  try {
    let {data} = await axios.get(url, {
      headers: {
        Host: 'api.m.jd.com',
        Origin: 'https://618redpacket.jd.com',
        Cookie: cookie,
        'User-Agent': 'jdltapp;',
        Referer: 'https://618redpacket.jd.com/'
      }
    })
    return data;
  } catch (e) {
    return {code: -1}
  }
}

async function getCodesHW() {
  try {
    let {data}: any = await axios.get(`${require('./USER_AGENTS').hwApi}HW_CODES`, {timeout: 10000})
    console.log('获取HW_CODES成功(api)')
    shareCodesHW = data['fcdyj']
  } catch (e: any) {
    console.log('获取HW_CODES失败(api)')
  }
}