/**
 * 极速版-发财大赢家
 * cron : 1 0,8,18 * * *
 */

import axios from 'axios';
import {requireConfig, requestAlgo, wait, h5st} from './TS_USER_AGENTS';


let cookie: string, res: any, UserName: string, index: number;
let shareCodesSelf: { redEnvelopeId: string, inviter: string }[] = [], shareCodes: { redEnvelopeId: string, inviter: string }[] = [], shareCodesHW: any;

!(async () => {
  await requestAlgo('c8bce')
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    res = await api('openRedEnvelopeInteract', {"linkId": "PFbUR7wtwUcQ860Sn8WRfw"});
    if (res.code === 0) {
      console.log('当前进度:', res.data.amount * 1, ' 还需要:', res.data.needAmount * 1 ?? (10 - res.data.needAmount * 1).toFixed(2))
      await wait(1000)
      res = await api('redEnvelopeInteractHome', {"linkId": "PFbUR7wtwUcQ860Sn8WRfw", "redEnvelopeId": "", "inviter": "", "helpType": ""})
      shareCodesSelf.push({
        redEnvelopeId: res.data.redEnvelopeId,
        inviter: res.data.markedPin
      })
      await wait(1000)
    } else {
      console.log(res)
      console.log('火爆？')
    }
    await wait(4000)
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
      res = await api('openRedEnvelopeInteract', {"linkId": "PFbUR7wtwUcQ860Sn8WRfw", "redEnvelopeId": boss.redEnvelopeId, "inviter": boss.inviter, "helpType": "1"})
      if (res.code === 16020)
        continue
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
        console.log('其他错误', res.errMsg)
      }
      await wait(3000)
    }
  }
})()

async function api(fn: string, params: object) {
  let t = Date.now()
  let url = `https://api.m.jd.com/?functionId=${fn}&t=${t}&appid=activities_platform&client=H5&clientVersion=1.0.0&body=${encodeURIComponent(JSON.stringify(params))}`
  try {
    let {data} = await axios.get(url, {
      headers: {
        'Host': 'api.m.jd.com',
        'Origin': 'https://618redpacket.jd.com',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'jdltapp;',
        'Referer': 'https://618redpacket.jd.com/?activityId=PFbUR7wtwUcQ860Sn8WRfw',
        'Cookie': cookie
      }
    })
    return data;
  } catch (e) {
    return {code: -1}
  }
}

async function getCodesHW() {
  try {
    let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/HW_CODES`, {timeout: 10000})
    console.log('获取HW_CODES成功(api)')
    shareCodesHW = data['fcdyj'] || []
  } catch (e: any) {
    console.log('获取HW_CODES失败(api)')
  }
}