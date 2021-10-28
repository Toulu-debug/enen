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

    res = await api('openRedEnvelopeInteract', '', '');
    if (res.code === 0) {
      console.log('当前进度:', res.data.amount * 1, ' 还需要:', res.data.needAmount * 1 ?? (10 - res.data.needAmount * 1).toFixed(2))
      await wait(1000)
    } else {
      console.log('需要先手动打开红包。火爆？')
    }

    res = await api('redEnvelopeInteractHome', '', '')
    if (res.data) {
      console.log('助力码:', res.data.redEnvelopeId, res.data.inviter)
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
        boss.inviter
          ? res = await api('openRedEnvelopeInteract', boss.redEnvelopeId, boss.inviter, 2)
          : res = await api('openRedEnvelopeInteract', boss.redEnvelopeId, boss.inviter, 1)
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

async function api(fn: string, redEnvelopeId: string, inviter: string, helpType: number = 2) {
  let linkId: string = 'PFbUR7wtwUcQ860Sn8WRfw'
  try {
    let {data} = await axios.get(`https://api.m.jd.com/?functionId=openRedEnvelopeInteract&body={%22linkId%22:%22${linkId}%22,%22redEnvelopeId%22:%22${redEnvelopeId}%22,%22inviter%22:%22${inviter}%22,%22helpType%22:%22${helpType}%22}&t=${Date.now()}&appid=activities_platform&clientVersion=3.5.0`, {
      headers: {
        'Host': 'api.m.jd.com',
        'accept': 'application/json, text/plain, */*',
        'origin': 'https://618redpacket.jd.com',
        'user-agent': 'jdltapp;iPhone;3.5.0;14.2;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone10,2;hasOCPay/0;appBuild/1066;supportBestPay/0;pv/7.0;apprpd/;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'accept-language': 'zh-cn',
        'referer': `https://618redpacket.jd.com/?activityId=${linkId}&redEnvelopeId=${redEnvelopeId}&inviterId=${inviter}&helpType=1&lng=&lat=&sid=`,
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