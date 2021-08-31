import axios from 'axios';
import USER_AGENT from './TS_USER_AGENTS';

let $: any = {};
let cookie: string = '', cookiesArr: string[] = [], res: any, shareCodes: string[] = [];
let token: string = '', token2: string = '', pin: string = '', uuid: string = '';
let shopId: string = '';

!(async () => {
  await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    $.index = i + 1;
    $.isLogin = true;
    $.nickName = '';
    console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);

    await getIsvToken();
    await getIsvToken2();
    await init();

    res = await api('https://lzdz-isv.isvjcloud.com/dz/common/getSimpleActInfoVo', 'activityId=90121061401');
    shopId = res.data.shopId
    console.log('shopId:', shopId)

    res = await api('https://lzdz-isv.isvjcloud.com/customer/getMyPing', `userId=1000361242&token=${token2}&fromType=APP`)
    pin = res.data.secretPin
    console.log('pin:', pin)

    res = await api('myInfo', `activityId=90121061401&pin=${encodeURIComponent(pin)}`)
    let foodLeft: number = res.data.bags[1].totalNum - res.data.bags[1].useNum
    console.log(foodLeft)

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
            await wait(1000)
          }
        }
      }

    }
  }
})()

function api(fn: string, body: Object): Object {
  let url: string;
  if (fn.indexOf('https://') > -1) {
    url = fn
  } else {
    url = `https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/${fn}?_=${Date.now()}`
  }
  return new Promise(async resolve => {
    let {data, headers} = await axios.post(url, body
      // `activityId=90121061401&pin=${encodeURIComponent(pin)}&actorUuid=${uuid}&userUuid=${uuid}`
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
    reloadCookie(headers['set-cookie'])
    resolve(data);
  })
}

function getIsvToken() {
  return new Promise<void>(async resolve => {
    let {data} = await axios.post("https://api.m.jd.com/client.action?functionId=genToken&clientVersion=10.0.2&client=android&uuid=818aa057737ba6a4&st=1623934987178&sign=0877498be29cda51b9628fa0195f412f&sv=111",
      `body=${escape('{"action":"to","to":"https%3A%2F%2Fh5.m.jd.com%2FbabelDiy%2FZeus%2F3KSjXqQabiTuD1cJ28QskrpWoBKT%2Findex.html%3FbabelChannel%3D45%26collectionId%3D519"}')}`, {
        headers: {
          'Host': 'api.m.jd.com',
          'charset': 'UTF-8',
          'User-Agent': USER_AGENT,
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'cookie': cookie
        }
      });
    token = data.tokenKey;
    resolve();
  })
}

function getIsvToken2() {
  return new Promise<void>(async resolve => {
    let {data} = await axios.post("https://api.m.jd.com/client.action?functionId=isvObfuscator&clientVersion=10.0.2&client=android&uuid=818aa057737ba6a4&st=1623934998790&sign=e571148c8dfb456a1795d249c6aa3956&sv=100", 'body=%7B%22id%22%3A%22%22%2C%22url%22%3A%22https%3A//xinruidddj-isv.isvjcloud.com%22%7D', {
      headers: {
        'Host': 'api.m.jd.com',
        'user-agent': USER_AGENT,
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': cookie
      }
    })
    token2 = data.token;
    cookie += 'IsvToken=' + token2 + ';'
    resolve();
  })
}

function init() {
  return new Promise<void>(resolve => {
    axios.get("https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/activity?activityId=90121061401?activityId=90121061401", {
      headers: {
        'Host': 'lzdz-isv.isvjcloud.com',
        'User-Agent': USER_AGENT,
        'X-Requested-With': 'com.jingdong.app.mall',
        'Cookie': 'IsvToken=' + token
      }
    }).then(res => {
      reloadCookie(res.headers['set-cookie'])
      resolve();
    })
  })
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

function wait(t: number) {
  return new Promise<void>(resolve => {
    setTimeout(async () => {
      resolve()
    }, t)
  })
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
