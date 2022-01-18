import axios from "axios";
import {format} from "date-fns";

const CryptoJS = require('crypto-js')

let fp: string = '', tk: string = '', genKey: any = null

function getRandomIDPro() {
  let e, a = 10, n = 'number', i = '';
  switch (n) {
    case 'alphabet':
      e = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;
    case 'max':
      e = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
      break;
    case 'number':
    default:
      e = '0123456789';
  }
  for (; a--;) i += e[(Math.random() * e.length) | 0];
  return i;
}

async function requestAlgo(appId: string, USER_AGENT: string) {
  let s = "", a = "0123456789", u = a, c = (Math.random() * 10) | 0;
  do {
    let ss = getRandomIDPro() + ""
    if (s.indexOf(ss) == -1) s += ss
  } while (s.length < 3)
  for (let i of s.slice()) u = u.replace(i, '')
  fp = getRandomIDPro() + "" + s + getRandomIDPro() + c + ""

  let {data} = await axios.post(`https://cactus.jd.com/request_algo?g_ty=ajax`, `{"version":"3.0","fp":"${fp}","appId":"${appId}","timestamp":${Date.now()},"platform":"web","expandParams":""}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      'Origin': 'https://prodev.m.jd.com',
      'Referer': 'https://prodev.m.jd.com/',
      'User-Agent': USER_AGENT
    }
  })
  tk = data.data.result.tk;
  genKey = new Function(`return ${data.data.result.algo}`)();
}

function geth5st(t: { key: string, value: string } [], appId: string) {
  let a = t.map(function (e) {
    return e["key"] + ":" + e["value"]
  })["join"]("&")
  let time = Date.now()
  let timestamp = format(time, "yyyyMMddhhmmssSSS");
  let hash1 = genKey(tk, fp.toString(), timestamp.toString(), appId.toString(), CryptoJS).toString();
  const hash2 = CryptoJS.HmacSHA256(a, hash1.toString()).toString();
  return ["".concat(timestamp.toString()), "".concat(fp.toString()), "".concat(appId.toString()), "".concat(tk), "".concat(hash2), "3.0", "".concat(time.toString())].join(";")
}

export {
  requestAlgo,
  geth5st
}
