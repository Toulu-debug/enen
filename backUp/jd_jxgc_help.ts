/**
 * cron: 5 * * * *
 */

import axios from 'axios';
import {requireConfig, wait, requestAlgo, h5st} from '../TS_USER_AGENTS';
import {jxfactory} from "../utils/shareCodesTool";

let cookie: string = '', res: any = '', UserName: string, index: number;
let shareCodes: string[] = [], shareCodesInternal: string[] = [], empCookie: string[] = [], HELP_HW: string = process.env.HELP_HW ?? "true";
let HW_CODE = ['INcGtFWIUwvLFFvpQtKFCQ==', 'AZV37CNsgm_Q9Xid7tt-eA==', 'K6AGuw2dq_U2kEpg4mTmHQ==', 'c3anbYUBmLe9Qh1TIM4dEg==', 'zfzxrqaM7n3s4FhUZQmA8Q=='];
console.log('帮助HelloWorld:', HELP_HW)

interface Params {
  name?: string,
  sharepin?: string
}

!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    let sharecode = await jxfactory(cookie)
    console.log('助力码:', sharecode)
    shareCodesInternal.push(sharecode)

    res = await api('friend/QueryFriendList', '_time,zone')
    console.log('收到助力:', res.data.hireListToday.length, '/', res.data.hireNumMax)
    if (res.data.assistListToday.length !== 3) {
      // 只要有剩余助力的
      empCookie.push(cookie)
    }
  }

  console.log('\n内部助力码:', shareCodesInternal, '\n')

  for (let emp of empCookie) {
    cookie = emp
    let empName: string = decodeURIComponent(emp.match(/pt_pin=([^;]*)/)![1])
    let sharecode = await jxfactory(emp)

    await getShareCodes()

    for (let boss of shareCodes) {
      if (sharecode === boss) {
        console.log('不给自己助力')
      } else {
        console.log(`${empName}给${boss}助力`)
        res = await api('friend/AssistFriend', '_time,sharepin,zone', {sharepin: boss})
        if (res.ret === 0) {
          console.log('助力成功')
          break
        } else if (res.ret === 11009) {
          console.log('助力失败:', res.msg)
          break
        } else {
          console.log('助力失败:', res.msg)
        }
        await wait(3000)
      }
    }
    console.log('')
  }
})()

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise(async (resolve, reject) => {
    let url = `https://m.jingxi.com/dreamfactory/${fn}?zone=dream_factory&_time=${Date.now()}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2`
    url = h5st(url, stk, params, 10001)
    try {
      let {data} = await axios.get(url, {
        headers: {
          'Cookie': cookie,
          'Host': 'm.jingxi.com',
          'User-Agent': 'jdpingou;',
          'Referer': 'https://actst.jingxi.com/pingou/dream_factory/index.html',
        }
      })
      resolve(data)
    } catch (e) {
      reject(401)
    }
  })
}

async function getShareCodes() {
  try {
    let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/jxfactory/30`)
    console.log(`从助力池获取到30个:${JSON.stringify(data.data)}`)
    HELP_HW === 'true'
      ? shareCodes = Array.from(new Set([...shareCodesInternal, ...HW_CODE, ...data.data]))
      : shareCodes = Array.from(new Set([...shareCodesInternal, ...data.data]))
  } catch (e) {
    HELP_HW === 'true'
      ? shareCodes = Array.from(new Set([...shareCodesInternal, ...HW_CODE]))
      : shareCodes = Array.from(new Set([...shareCodesInternal]))
  }
}