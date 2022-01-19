import axios from 'axios';
import USER_AGENT, {o2s, requireConfig, wait} from './TS_USER_AGENTS';

let cookie: string = '', res: any, shareCodes: string[] = [], UserName: string, index: number
let pin: string = '', uuid: string = '', shopId: string = '', tokenKey: string = '', token: string = ''

!(async () => {
  let cookiesArr: string[] = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    await getIsvToken();
    await getIsvToken2();
    await init();

    res = await api('https://lzdz-isv.isvjcloud.com/dz/common/getSimpleActInfoVo', 'activityId=90121061401');
    shopId = res.data.shopId
    console.log('shopId:', shopId)

    res = await api('https://lzdz-isv.isvjcloud.com/customer/getMyPing', `userId=1000361242&token=${token}&fromType=APP`)
    pin = res.data.secretPin
    console.log('pin:', pin)

    res = await api('myInfo', `activityId=90121061401&pin=${encodeURIComponent(pin)}`)
    let foodLeft: number = res.data.bags[1].totalNum - res.data.bags[1].useNum
    uuid = res.data.bags[0].uid
    console.log('剩余饲料', foodLeft)

    for (let j = 0; j < 20; j++) {
      res = await api('doTask', `taskId=interact&activityId=90121061401&pin=${encodeURIComponent(pin)}`)
      if (res.result) {
        console.log('互动成功', res.data.growUp)
        await wait(7000)
      } else {
        console.log('互动失败', res)
        break
      }
    }
    /*
    for (let t of res.data.task) {
      if (t.type === 0 && t.maxNeed === 10000000) {
        // 首页任务
        console.log(t.type, t.taskname)
        res = await api('doTask', `taskId=${t.taskid}&activityId=90121061401&pin=${encodeURIComponent(pin)}`)
        if (res.result) {
          console.log(`${t.taskname}成功:${res.data.growUp}`)
        } else {
          console.log(res.errorMessage)
        }
        await wait(5000)
      }

      if (t.curNum != t.need && t.type === 1) {
        console.log(t.taskname)
        if (t.taskid === 'signin') {
          let signRes: any = await api("signin", `taskId=signin&param=&activityId=90121061401&pin=${encodeURIComponent(pin)}`)
          console.log('签到:', signRes)
        }
        if (t.taskid === 'scanvideo') {
          let r: any = await api('doTask', `taskId=${t.taskid}&activityId=90121061401&pin=${encodeURIComponent(pin)}`)
          await wait(1000)
        }
        if (t.taskid === 'scansku' || t.taskid === 'add2cart') {
          let products: any = await api('getproduct', `type=${t.params}&activityId=90121061401&pin=${encodeURIComponent(pin)}`)
          await wait(1000)
          await api("doTask", `taskId=${t.taskid}&param=${products.data[0].id}&activityId=90121061401&pin=${encodeURIComponent(pin)}`)
          for (let p of products.data) {
            console.log(p.id)
          }
        }
        if (t.taskid === 'interact') {
          for (let i = 0; i < t.maxNeed - t.curNum; i++) {
            let playRes: any = await api('doTask', `taskId=${t.taskid}&activityId=90121061401&pin=${encodeURIComponent(pin)}`)
            if (playRes.result) {
              console.log('互动成功:', playRes.data.growUp)
            } else {
              console.log(res.errorMessage)
            }
            await wait(5000)
          }
        }
      }
    }
     */

    break
  }
})()

function api(fn: string, body: any) {
  let url: string;
  if (fn.indexOf('https://') > -1) {
    url = fn
  } else {
    url = `https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/${fn}?_=${Date.now()}`
  }
  return new Promise(async resolve => {
    let {data, headers}: any = await axios.post(url, typeof body === 'string' ? body : JSON.stringify(body)
      , {
        headers: {
          'Host': 'lzdz-isv.isvjcloud.com',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': 'https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/activity?activityId=90121061401',
          'User-Agent': USER_AGENT,
          'Accept': 'application/json',
          'Origin': 'https://lzdz-isv.isvjcloud.com',
          'Cookie': cookie
        }
      })
    resolve(data);
    reloadCookie(headers['set-cookie'])
  })
}

async function getIsvToken() {
  let body: string = await sign();
  let {data}: any = await axios.post(`https://api.m.jd.com/client.action?functionId=genToken`, body, {
    headers: {
      'Host': 'api.m.jd.com',
      'content-type': 'application/x-www-form-urlencoded',
      'referer': '',
      'user-agent': 'JD4iPhone/167863%20(iPhone;%20iOS;%20Scale/3.00)',
      'Cookie': cookie
    }
  })
  tokenKey = data.tokenKey;
  return
}

async function getIsvToken2() {
  let body: string = await isvObfuscator();
  let {data}: any = await axios.post("https://api.m.jd.com/client.action?functionId=isvObfuscator", body, {
    headers: {
      'Host': 'api.m.jd.com',
      'accept': '*/*',
      'content-type': 'application/x-www-form-urlencoded',
      'referer': '',
      'user-agent': 'JD4iPhone/167814 (iPhone; iOS 12.4.1; Scale/3.00)',
      'accept-language': 'zh-Hans-CN;q=1',
      'Cookie': cookie
    }
  })
  token = data.token;
  return
}

async function init() {
  let {headers} = await axios.get("https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/activity?activityId=90121061401", {
    headers: {
      'Host': 'lzdz-isv.isvjcloud.com',
      'User-Agent': USER_AGENT,
      'X-Requested-With': 'com.jingdong.app.mall',
      'Cookie': 'IsvToken=' + token
    }
  })
  reloadCookie(headers['set-cookie'])
}

async function sign() {
  let {data}: any = await axios.post("https://api.jds.codes/sign", {"fn": "genToken", "body": {"to": "https:\/\/lzdz-isv.isvjcloud.com\/dingzhi\/qqxing\/pasture\/activity?activityId=90121061401", "action": "to"}})
  return data.data.sign
}


async function isvObfuscator() {
  let {data}: any = await axios.post("https://api.jds.codes/sign", {"fn": "isvObfuscator", "body": {"url": "https:\/\/lzdz-isv.isvjcloud.com", "id": ""}})
  return data.data.sign
}

function reloadCookie(setCookie: string[]) {
  let cookieArr: string[] = cookie.split(';')
  cookieArr.pop();
  let cookieTEMP: any = {};
  for (let ck of cookieArr)
    cookieTEMP[ck.split('=')[0]] = ck.match(/(pt_key|pt_pin|LZ_TOKEN_KEY|LZ_TOKEN_VALUE|AUTH_C_USER|lz_jdpin_token|IsvToken)=([^;]*)/)![2]
  for (let ck of setCookie) {
    ck = ck.split(';')[0]
    cookieTEMP[ck.split('=')[0]] = ck.match(/(pt_key|pt_pin|LZ_TOKEN_KEY|LZ_TOKEN_VALUE|AUTH_C_USER|lz_jdpin_token|IsvToken)=([^;]*)/)![2]
  }
  cookie = ''
  for (let ck in cookieTEMP) {
    if (cookieTEMP.hasOwnProperty(ck)) {
      cookie += `${ck}=${cookieTEMP[ck]};`
    }
  }
}