import axios from "axios";
import {format} from "date-fns";
import {getBeanShareCode, getFarmShareCode, o2s, randomWord} from "../TS_USER_AGENTS";
import {Md5} from "ts-md5";

const CryptoJS = require('crypto-js')

let fp: string = '', tk: string = '', genKey: any = null

interface jxToken {
  farm_jstoken: string,
  phoneid: string,
  timestamp: string
}


async function requestAlgo(appId: string, USER_AGENT: string = 'jdpingou;') {
  function generateFp() {
    let e = "0123456789";
    let a = 13;
    let i = '';
    for (; a--;)
      i += e[Math.random() * e.length | 0];
    return (i + Date.now()).slice(0, 16)
  }

  fp = generateFp()

  let {data} = await axios.post(`https://cactus.jd.com/request_algo?g_ty=ajax`, `{"version":"3.0","fp":"${fp}","appId":"${appId}","timestamp":${Date.now()},"platform":"web","expandParams":""}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      'host': 'cactus.jd.com',
      'Referer': 'https://cactus.jd.com',
      'User-Agent': USER_AGENT
    }
  })
  tk = data.data.result.tk;
  genKey = new Function(`return ${data.data.result.algo}`)();
  return {fp, tk, genKey}
}

function geth5st(t: { key: string, value: string } [], appId: string) {
  let a = t.map(function (e) {
    return e["key"] + ":" + e["value"]
  })["join"]("&")
  let time = Date.now()
  let timestamp = format(time, "yyyyMMddhhmmssSSS");
  let hash1 = genKey(tk, fp.toString(), timestamp.toString(), appId.toString(), CryptoJS).toString();
  const hash2 = CryptoJS.HmacSHA256(a, hash1).toString();
  return ["".concat(timestamp.toString()), "".concat(fp.toString()), "".concat(appId.toString()), "".concat(tk), "".concat(hash2), "3.0", "".concat(time.toString())].join(";")
}

async function get(fn: string, stk: string, params: object, jxToken: jxToken, cookie: string, ua: string = 'jdpingou;') {
  let url: string, t: { key: string, value: string } [] = [
    {key: 'activeid', value: 'jxmc_active_0001'},
    {key: 'activekey', value: 'null'},
    {key: 'channel', value: '7'},
    {key: 'jxmc_jstoken', value: jxToken.farm_jstoken},
    {key: 'phoneid', value: jxToken.phoneid},
    {key: 'sceneid', value: '1001'},
    {key: 'timestamp', value: jxToken.timestamp.toString()},
  ]
  if (['GetUserTaskStatusList', 'DoTask', 'Award'].indexOf(fn) > -1)
    url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?_=${Date.now()}&source=jxmc&bizCode=jxmc&_stk=${encodeURIComponent(stk)}&_ste=1&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
  else
    url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activeid=jxmc_active_0001&activekey=null&jxmc_jstoken=${jxToken.farm_jstoken}&timestamp=${jxToken.timestamp}&phoneid=${jxToken.phoneid}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`

  for (let [key, value] of Object.entries(params)) {
    t.push({key, value})
    url += `&${key}=${value}`
  }
  let h5st = geth5st(t, '00df8')
  url += `&h5st=${h5st}`
  try {
    let {data}: any = await axios.get(url, {
      headers: {
        'Host': 'm.jingxi.com',
        'Accept': '*/*',
        'User-Agent': ua ?? 'jdpingou;',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Referer': 'https://st.jingxi.com/',
        'Cookie': cookie
      }
    })
    return JSON.parse(data.match(/jsonpCBK.?\((.*)/)![1])
  } catch (e) {
    o2s(e)
  }
}

async function makeShareCodes(code: string, cookie: string) {
  try {
    let bean: string = await getBeanShareCode(cookie)
    let farm: string = await getFarmShareCode(cookie)
    let pin: string = Md5.hashStr(cookie.match(/pt_pin=([^;]*)/)![1])
    let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/autoInsert/jxmc?sharecode=${code}&bean=${bean}&farm=${farm}&pin=${pin}`)
    console.log(data.message)
  } catch (e) {
    console.log('自动提交失败')
    console.log(e)
  }
}

export {
  requestAlgo,
  geth5st,
  get,
  makeShareCodes,
}
