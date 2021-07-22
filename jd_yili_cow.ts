import {format} from 'date-fns';
import axios from 'axios';
import USER_AGENT, {TotalBean, requireConfig, wait} from "./TS_USER_AGENTS";
import * as dotenv from 'dotenv';

const notify = require('./sendNotify')
dotenv.config()
let token: string, token2: string, actorUuid: string, shopId: number, pin: string, uuid: string;
let milk: number;
let cookie: string = '', res: any = '', UserName: string, index: number;

async function main() {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    try {
      cookie = cookiesArr[i];
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      index = i + 1;
      let {isLogin, nickName}: any = await TotalBean(cookie)
      if (!isLogin) {
        notify.sendNotify(__filename.split('/').pop(), `cookie已失效\n京东账号${index}：${nickName || UserName}`)
        continue
      }
      console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

      await getIsvToken();
      await getIsvToken2();
      await init();

      res = await api('https://lzdz-isv.isvjcloud.com/dz/common/getSimpleActInfoVo', 'activityId=dz2103100001340201')
      shopId = res.data.venderId
      res = await api('https://lzdz-isv.isvjcloud.com/customer/getMyPing', `userId=${shopId}&token=${token2}&fromType=APP`)
      pin = res.data.secretPin

      res = await api('https://lzdz-isv.isvjcloud.com/wxActionCommon/getUserInfo', `pin=${encodeURIComponent(pin)}`)
      if(res.data?.hasOwnProperty('id')){
        uuid = res.data.id
      }else{
        continue
      }

      res = await api('https://lzdz-isv.isvjcloud.com/common/accessLogWithAD',`venderId=1000013402&code=99&pin=${encodeURIComponent(pin)}&activityId=dz2103100001340201&pageUrl=https%3A%2F%2Flzdz-isv.isvjcloud.com%2Fdingzhi%2Fyili%2Fyangniu%2Factivity%2F4827909%3FactivityId%3Ddz2103100001340201%26shareUuid%3Db44243656a694b6f94bb30a4a5f2a45d%26adsource%3Dziying%26shareuserid4minipg%3D5Iufa9rY657S3OP3PLSpK07oeVP9kq2pYSH90mYt4m3fwcJlClpxrfmVYaGKuquQkdK3rLBQpEQH9V4tdrrh0w%3D%3D%26shopid%3D1000013402%26lng%3D114.062604%26lat%3D29.541501%26sid%3D6e9bfee3838075a72533536815d8f3ew%26un_area%3D4_48201_54794_0&subType=app&adSource=ziying`)

      res = await api('https://lzdz-isv.isvjcloud.com/dingzhi/yili/yangniu/activityContent', `activityId=dz2103100001340201&pin=${encodeURIComponent(pin)}&pinImg=null&nick=${cookie.match(/pt_pin=([^;]*)/)![1]}&cjyxPin=&cjhyPin=&shareUuid=`)
      actorUuid = res.data.actorUuid
      console.log('互助码：', actorUuid)
      milk = res.data.score2 / 10

      for (let j = 0; j < milk; j++) {
        res = await api('feedCow', `activityId=dz2103100001340201&actorUuid=${actorUuid}&pin=${encodeURIComponent(pin)}`)
        if (res.result) {
          console.log('喂奶成功，剩余：', res.data.score2)
        } else {
          console.log('喂奶失败：', res)
          break
        }
        await wait(2000)
      }

      while (1) {
        res = await api('start', `activityId=dz2103100001340201&actorUuid=${actorUuid}&pin=${encodeURIComponent(pin)}`)
        if (res.result) {
          console.log('抽奖成功：', res.data.name)
        } else if (res.errorMessage === '继续努力，多多喂养牛牛哦~') {
          console.log('抽奖失败，没有抽奖机会')
          break
        } else {
          console.log('抽奖失败：', res)
          break
        }
        await wait(3000)
      }


      let taskArr: any = [
        {taskType: 0},
        {taskType: 1},
        {taskType: 12},
        {taskType: 13, taskValue: 'ziying'},
        {taskType: 13, taskValue: 'pop'},
        {taskType: 21},
      ]
      for (let t of taskArr) {
        res = await api('saveTask', `activityId=dz2103100001340201&actorUuid=${actorUuid}&pin=${encodeURIComponent(pin)}&taskType=${t.taskType}&taskValue=${t.taskValue ?? ''}`)
        if (res.result)
          console.log('任务完成：', res.data.milkCount)
        else{
          console.log('任务失败：', res)
          break
        }
        await wait(2000)
      }
    } catch (e) {
      console.log(e)
    }

    break
  }
}

main().then()

function api(fn: string, body: Object): Object {
  let url: string;
  if (fn.indexOf('https://') > -1) {
    url = fn
  } else {
    url = `https://lzdz-isv.isvjcloud.com/dingzhi/yili/yangniu/${fn}`
  }
  return new Promise(async resolve => {
    let {data, headers} = await axios.post(url, body
      , {
        headers: {
          'Host': 'lzdz-isv.isvjcloud.com',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': 'https://lzdz-isv.isvjcloud.com/dingzhi/yili/yangniu/activity',
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
    axios.get("https://lzdz-isv.isvjcloud.com/dingzhi/yili/yangniu/activity", {
      headers: {
        'Host': 'lzdz-isv.isvjcloud.com',
        'User-Agent': USER_AGENT,
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
  if (setCookie) {
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
}
