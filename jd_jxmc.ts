/**
 * 京喜牧场
 * 买、喂、收蛋、锄草、挑逗
 * export HELP_HW=true     // 默认帮助HelloWorld
 * export HELP_POOL=true   // 默认帮助助力池
 */

import axios from 'axios';
import {requireConfig, TotalBean, getBeanShareCode, getFarmShareCode, wait, requestAlgo, decrypt, getJxToken} from './TS_USER_AGENTS';
import {Md5} from "ts-md5";
import {accessSync} from "fs";

const notify = require('./sendNotify')

let A: any = require('./utils/jd_jxmcToken')
let cookie: string = '', res: any = '', shareCodes: string[] = [], homePageInfo: any, activeid: string = '', jxToken: any, UserName: string, index: number;
let HELP_HW: string = process.env.HELP_HW ? process.env.HELP_HW : "true";
console.log('帮助HelloWorld:', HELP_HW)
let HELP_POOL: string = process.env.HELP_POOL ? process.env.HELP_POOL : "true";
console.log('帮助助力池:', HELP_POOL)

!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    if (!isLogin) {
      notify.sendNotify(__filename.split('/').pop(), `cookie已失效\n京东账号${index}:${nickName || UserName}`)
      continue
    }
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

    jxToken = getJxToken(cookie)
    homePageInfo = await api('queryservice/GetHomePageInfo', 'activeid,activekey,channel,isgift,isquerypicksite,sceneid', {isgift: 0, isquerypicksite: 0})
    activeid = homePageInfo.data.activeid
    let lastgettime: number
    if (homePageInfo.data?.cow?.lastgettime) {
      lastgettime = homePageInfo.data.cow.lastgettime
    } else {
      continue
    }

    let food: number = 0
    try {
      food = homePageInfo.data.materialinfo[0].value;
    } catch (e) {
      console.log('未开通？黑号？')
      continue
    }
    let petid: number = homePageInfo.data.petinfo[0].petid;
    let coins = homePageInfo.data.coins;

    console.log('助力码:', homePageInfo.data.sharekey);
    shareCodes.push(homePageInfo.data.sharekey);
    try {
      await makeShareCodes(homePageInfo.data.sharekey);
    } catch (e) {
      console.log(e)
    }

    console.log('现有草:', food);
    console.log('金币:', coins);

    // 收牛牛
    res = await api('operservice/GetCoin', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,token', {token: A(lastgettime)})
    if (res.ret === 0)
      console.log('收牛牛:', res.data.addcoin)

    // 签到
    res = await api('queryservice/GetSignInfo', 'activeid,activekey,channel,sceneid')
    if (res.data.signlist) {
      for (let day of res.data.signlist) {
        if (day.fortoday && !day.hasdone) {
          res = await api('operservice/GetSignReward', 'channel,currdate,sceneid', {currdate: res.data.currdate})
          if (res.ret === 0) {
            console.log('签到成功!')
          } else {
            console.log(res)
          }
          break
        }
      }
    } else {
      console.log('没有获取到签到信息！')
    }

    let taskRetCode: number = 0;
    while (taskRetCode === 0) {
      taskRetCode = await getTask();
      console.log('taskRetCode:', taskRetCode)
      if (taskRetCode === 0) {
        await wait(5000);
      } else {
        break
      }
    }

    while (coins >= 5000 && food <= 500) {
      res = await api('operservice/Buy', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,type', {type: '1'})
      if (res.ret === 0) {
        console.log('买草成功:', res.data.newnum)
        coins -= 5000
        food += 100
      } else {
        console.log(res)
        break
      }
      await wait(5000)
    }
    await wait(4000)

    while (food >= 10) {
      try {
        res = await api('operservice/Feed', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp')
        if (res.ret === 0) {
          food -= 10
          console.log('剩余草:', res.data.newnum)
        } else if (res.ret === 2020) {
          if (res.data.maintaskId === 'pause') {
            console.log('收🥚')
            res = await api('operservice/GetSelfResult', 'channel,itemid,sceneid,type', {petid: petid, type: '11'})
            if (res.ret === 0) {
              console.log('收🥚成功:', res.data.newnum)
            }
          }
        } else {
          console.log(res)
          break
        }
        await wait(6000)
      } catch (e) {
        break
      }
    }
    await wait(3000)

    while (1) {
      try {
        res = await api('operservice/Action', 'activeid,activekey,channel,jxmc_jstoken,phoneid,sceneid,timestamp,type', {type: '2'})
        if (res.data.addcoins === 0 || JSON.stringify(res.data) === '{}') break
        console.log('锄草:', res.data.addcoins)
        await wait(4000)
        if (res.data.surprise) {
          res = await api("operservice/GetSelfResult", "activeid,activekey,channel,sceneid,type", {type: '14'})
          console.log('锄草奖励:', res.data.prizepool)
          await wait(4000)
        }
      } catch (e) {
        console.log('Error:', e)
        break
      }
    }
    await wait(3000)

    while (1) {
      try {
        res = await api('operservice/Action', 'activeid,activekey,channel,petid,sceneid,type', {type: '1', petid: petid})
        if (res.data.addcoins === 0 || JSON.stringify(res.data) === '{}') break
        console.log('挑逗:', res.data.addcoins)
        await wait(5000)
      } catch (e) {
        console.log('Error:', e)
        break
      }
    }
  }

  // 获取随机助力码
  /*
  if (HELP_HW === 'true') {
    try {
      let {data} = await axios.get("https://api.sharecode.ga/api/HW_CODES")
      shareCodes = [
        ...shareCodes,
        ...data.jxcfd
      ]
      console.log('获取HelloWorld助力码成功')
    } catch (e) {
      console.log('获取HelloWorld助力码出错')
    }
  }
  */
  if (HELP_POOL === 'true') {
    try {
      let {data} = await axios.get('https://api.sharecode.ga/api/jxmc/6', {timeout: 10000})
      console.log('获取到20个随机助力码:', data.data)
      shareCodes = [...shareCodes, ...data.data]
    } catch (e) {
      console.log('获取助力池失败')
    }
  } else {
    console.log('你的设置是不帮助助力池！')
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    for (let j = 0; j < shareCodes.length; j++) {
      if (i !== j) {
        console.log(`账号${i + 1}去助力${shareCodes[j]}`)
        res = await api('operservice/EnrollFriend', 'channel,sceneid,sharekey', {sharekey: shareCodes[j]})
        if (res.ret === 0) {
          console.log('助力成功，获得:', res.data.addcoins)
        } else {
          console.log('助力失败：', res)
        }
        await wait(4000)
      }
    }
  }
})()

interface Params {
  isgift?: number,
  isquerypicksite?: number,
  petid?: number,
  type?: string,
  taskId?: number
  configExtra?: string,
  sharekey?: string,
  currdate?: string,
  token?: string
}

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise(async (resolve, reject) => {
    let url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activeid=${activeid}&activekey=null&jxmc_jstoken=${jxToken.strPgUUNum}&timestamp=${Date.now()}&phoneid=${jxToken.strPhoneID}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2`
    if (Object.keys(params).length !== 0) {
      let key: (keyof Params)
      for (key in params) {
        if (params.hasOwnProperty(key))
          url += `&${key}=${params[key]}`
      }
    }
    url += '&h5st=' + decrypt(stk, url)
    try {
      let {data} = await axios.get(url, {
        headers: {
          'Cookie': cookie,
          'Host': 'm.jingxi.com',
          'User-Agent': 'jdpingou;iPhone;4.11.0;12.4.1;52cf225f0c463b69e1e36b11783074f9a7d9cbf0;network/wifi;model/iPhone11,6;appBuild/100591;ADID/C51FD279-5C69-4F94-B1C5-890BC8EB501F;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/503;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
          'Referer': 'https://st.jingxi.com/',
        }
      })
      resolve(data)
    } catch (e) {
      reject(401)
    }
  })
}

function getTask() {
  return new Promise<number>(async resolve => {
    let tasks: any = await taskAPI('GetUserTaskStatusList', 'bizCode,dateType,source')
    let doTaskRes: any = {ret: 1};
    for (let t of tasks.data.userTaskStatusList) {
      if ((t.dateType === 1 || t.dateType === 2) && t.completedTimes == t.targetTimes && t.awardStatus === 2) {
        // 成就任务
        t.dateType === 1
          ?
          console.log('成就任务可领取:', t.taskName, t.completedTimes, t.targetTimes)
          :
          console.log('每日任务可领取:', t.taskName, t.completedTimes, t.targetTimes)

        doTaskRes = await taskAPI('Award', 'bizCode,source,taskId', {taskId: t.taskId})
        await wait(4000)
        if (doTaskRes.ret === 0) {
          let awardCoin = doTaskRes['data']['prizeInfo'].match(/:(.*)}/)![1] * 1
          console.log('领奖成功:', awardCoin)
        }
      }
      if (t.dateType === 2 && t.completedTimes < t.targetTimes && t.awardStatus === 2 && t.taskType === 2) {
        console.log('可做每日任务:', t.taskName, t.taskId)
        doTaskRes = await taskAPI('DoTask', 'bizCode,configExtra,source,taskId', {taskId: t.taskId, configExtra: ''})
        if (doTaskRes.ret === 0) {
          console.log('任务完成')
          await wait(5000)
        }
      }
    }
    resolve(doTaskRes.ret)
  })
}

function taskAPI(fn: string, stk: string, params: Params = {}) {
  return new Promise(async resolve => {
    let url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?_=${Date.now()}&source=jxmc&bizCode=jxmc&_ste=1&sceneval=2&_stk=${encodeURIComponent(stk)}&g_login_type=1&g_ty=ajax`
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
        'Origin': 'https://st.jingxi.com',
        'Accept-Language': 'zh-cn',
        'Connection': 'keep-alive',
        'Host': 'm.jingxi.com',
        'Referer': 'https://st.jingxi.com/pingou/jxmc/index.html?nativeConfig=%7B%22immersion%22%3A1%2C%22toColor%22%3A%22%23e62e0f%22%7D&__mcwvt=sjcp&PTAG=139279.13.31&jxsid=16257474246337594063',
        'Accept': 'application/json',
        'User-Agent': 'jdpingou;iPhone;4.11.0;12.4.1;52cf225f0c463b69e1e36b11783074f9a7d9cbf0;network/wifi;model/iPhone11,6;appBuild/100591;ADID/C51FD279-5C69-4F94-B1C5-890BC8EB501F;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/503;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Cookie': cookie
      }
    })
    resolve(data)
  })
}

function makeShareCodes(code: string) {
  return new Promise(async (resolve, reject) => {
    let bean: string = await getBeanShareCode(cookie)
    let farm: string = await getFarmShareCode(cookie)
    let pin: string = cookie.match(/pt_pin=([^;]*)/)![1]
    pin = Md5.hashStr(pin)
    await axios.get(`https://api.sharecode.ga/api/autoInsert?db=jxmc&code=${code}&bean=${bean}&farm=${farm}&pin=${pin}`, {timeout: 10000})
      .then(res => {
        if (res.data.code === 200)
          console.log('已自动提交助力码')
        else
          console.log('提交失败！已提交farm的cookie才可提交cfd')
        resolve(200)
      })
      .catch(() => {
        reject('访问助力池出错')
      })
  })
}
