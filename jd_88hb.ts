/**
 * 京喜app->领88元红包
 * 先内部，后助力HW.ts
 * cron: 5 0,6,20 * * *
 */

import {requireConfig, wait, h5st} from "./TS_USER_AGENTS";
import axios from "axios";
import * as path from 'path';
import {accessSync, readFileSync} from "fs";

let cookie: string = '', res: any = '', UserName: string, index: number, UA: string = '';
let shareCodesInternal: string[] = [];

!(async () => {
  let except: string[];
  try {
    accessSync('./utils/exceptCookie.json')
    except = JSON.parse(readFileSync('./utils/exceptCookie.json').toString())[path.basename(__filename)]
  } catch (e) {
    except = []
  }

  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    res = await api('GetUserInfo', 'activeId,channel,phoneid,publishFlag,stepreward_jstoken,timestamp,userDraw', {userDraw: 1})
    await wait(10000)
    let strUserPin: string = res.Data.strUserPin
    console.log('助力码：', strUserPin)
    shareCodesInternal.push(strUserPin)
    await wait(2000)

    res = await api('JoinActive', 'activeId,channel,phoneid,publishFlag,stepreward_jstoken,timestamp')
    if (res.iRet === 0) {
      console.log('JoinActive: 成功')
    } else {
      console.log(JSON.stringify(res))
    }
    await wait(2000)
  }

  console.log('内部助力码：', shareCodesInternal)
  await wait(2000)
  res = await getCodes();
  if (res.length !== 0) {
    console.log('追加HW.ts助力码')
    shareCodesInternal = [...shareCodesInternal, ...res]
    console.log('助力排队：', shareCodesInternal)
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])

    for (let j = 0; j < shareCodesInternal.length; j++) {
      console.log(`账号${i + 1} ${UserName} 去助力 ${shareCodesInternal[j]}`)
      res = await api('EnrollFriend', 'activeId,channel,joinDate,phoneid,publishFlag,stepreward_jstoken,strPin,timestamp', {joinDate: '20211004', strPin: shareCodesInternal[j]})
      if (res.iRet === 0) {
        console.log('成功')
      } else if (res.iRet === 2015) {
        console.log('上限')
        break
      } else if (res.iRet === 2016) {
        console.log('火爆')
        break
      } else {
        console.log('其他错误:', res)
      }
      await wait(5000)
    }
  }

  // 拆红包
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName} 拆红包\n`);

    res = await api('GetUserInfo', 'activeId,channel,phoneid,publishFlag,stepreward_jstoken,timestamp,userDraw', {userDraw: 1})
    let strUserPin: string = res.Data.strUserPin, dwHelpedTimes: number = res.Data.dwHelpedTimes;
    console.log('收到助力:', dwHelpedTimes)
    await wait(2000)

    for (let t of res.Data.gradeConfig) {
      if (dwHelpedTimes >= t.dwHelpTimes) {
        res = await api('DoGradeDraw',
          'activeId,channel,grade,phoneid,publishFlag,stepreward_jstoken,strPin,timestamp',
          {grade: t.dwGrade, strPin: strUserPin})
        if (res.iRet === 2018)
          console.log(`等级${t.dwGrade}红包已打开过`)
        else if (res.iRet === 0)
          console.log(`等级${t.dwGrade}红包打开成功`)
        else {
          console.log('其他错误', res.sErrMsg ?? JSON.stringify(res))
          break
        }
        await wait(15000)
      } else {
        break
      }
    }
  }
})()

interface Params {
  userDraw?: number,
  grade?: number,
  joinDate?: string,
  strPin?: string,
}

async function api(fn: string, stk: string, params: Params = {}) {
  let url: string = `https://m.jingxi.com/cubeactive/steprewardv3/${fn}?activeId=489177&publishFlag=1&channel=7&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2`
  UA = `jdpingou;iPhone;4.13.0;14.4.2;${randomString(40)};network/wifi;model/iPhone10,2;appBuild/100609;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/${Math.random() * 98 + 1};pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`
  let phoneid = UA.split(';') && UA.split(';')[4] || ''
  url += `&phoneid=${phoneid}`
  url += `&stepreward_jstoken=${
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  }`
  url = h5st(url, stk, params, 10010)
  try {
    let {data}: any = await axios.get(url, {
      headers: {
        'User-Agent': UA,
        'Referer': 'https://st.jingxi.com/pingou/jxmc/index.html',
        'Host': 'm.jingxi.com',
        'Cookie': cookie
      }
    })
    if (typeof data === 'string')
      return JSON.parse(data.replace(/jsonpCBK.?\(/, '').split('\n')[0])
    return data
  } catch (e: any) {
    return {}
  }
}

async function getCodes() {
  try {
    let {data}: any = await axios.get('https://api.jdsharecode.xyz/api/HW_CODES', {timeout: 5000})
    return data['88hb']
  } catch (e: any) {
    return []
  }
}

function randomString(e: number) {
  e = e || 32;
  let t = "0123456789abcdef", a = t.length, n = "";
  for (let i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}