/**
 * 极速版-发财大赢家
 * cron : 1 0,8,18 * * *
 */

import axios from 'axios';
import {requireConfig, requestAlgo, wait} from './TS_USER_AGENTS';


let cookie: string, res: any, UserName: string, index: number;
let shareCodesSelf: { redEnvelopeId: string, inviter: string }[] = [], shareCodes: { redEnvelopeId: string, inviter: string }[] = [], shareCodesHW: any, id: string = 'PFbUR7wtwUcQ860Sn8WRfw';
!(async () => {
  await requestAlgo('c8bce')
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    // res = await api('openRedEnvelopeInteract', `{%22linkId%22:%22PFbUR7wtwUcQ860Sn8WRfw%22}`);
    //
    // if (res.code === 0) {
    //   console.log('当前进度:', res.data.amount * 1, ' 还需要:', res.data.needAmount * 1 ?? (10 - res.data.needAmount * 1).toFixed(2))
    //   await wait(1000)
    // } else {
    //   console.log('火爆？')
    // }

    res = await api('redEnvelopeInteractHome', `{%22linkId%22:%22${id}%22,%22redEnvelopeId%22:%22%22,%22inviter%22:%22%22,%22helpType%22:%22%22}`)
    if (res.data) {
      shareCodesSelf.push({
        redEnvelopeId: res.data.redEnvelopeId,
        inviter: res.data.markedPin
      })
    }
    await wait(2000)
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
      if (boss.redEnvelopeId && boss.inviter) {
        console.log(`账号${i + 1} ${UserName} 去助力 `, boss.redEnvelopeId)
        res = await api('openRedEnvelopeInteract', `{%22linkId%22:%22${id}%22,%22redEnvelopeId%22:%22${boss.redEnvelopeId}%22,%22inviter%22:%22${boss.inviter}%22,%22helpType%22:%222%22}`)
        console.log(JSON.stringify(res))
        if (res.code === 16020) {
          await wait(3000)
          break
        }
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
  }
})()

async function api(fn: string, body: any) {
  let t = Date.now()
  let url = `https://api.m.jd.com/?functionId=${fn}&body=${body}&t=${t}&appid=activities_platform&client=H5&clientVersion=1.0.0`
  try {
    let {data} = await axios.get(url, {
      headers: {
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://618redpacket.jd.com',
        'User-Agent': 'jdltapp;',
        'Referer': 'https://618redpacket.jd.com/?activityId=PFbUR7wtwUcQ860Sn8WRfw',
        'Accept-Language': 'zh-CN,en-US;q=0.9',
        'X-Requested-With': 'com.jd.jdlite',
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

function randomString(e: number) {
  e = e || 32;
  let t = "0123456789", a = t.length, n = "";
  for (let i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}