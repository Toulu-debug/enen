import axios from 'axios';
import {Md5} from 'ts-md5'
import {getDate} from 'date-fns';
import {requireConfig, wait, requestAlgo, h5st, getJxToken, getRandomNumberByRange} from './TS_USER_AGENTS';

let cookie: string = '', res: any = '', UserName: string, index: number;
let shareCodes: string[] = [], shareCodesSelf: string[] = [], shareCodesHW: string[] = [], isCollector: Boolean = false, USER_AGENT = 'jdpingou;', token: any = {};

interface Params {
  strBuildIndex?: string,
}

!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    res = await api()
    console.log(JSON.stringify(res))


    await wait(2000)
  }
})()

async function api() {
  let {data} = await axios.post("https://api.m.jd.com/api",
    `appid=china-joy&functionId=star_push_jd_prod&body={"apiMapping":"/api/task/doSign"}&t=${Date.now()}`, {
      headers: {
        'Host': 'api.m.jd.com',
        'Origin': 'https://starintroducer.jd.com',
        'User-Agent': USER_AGENT,
        'Referer': 'https://starintroducer.jd.com/',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie
      }
    })
  return data
}