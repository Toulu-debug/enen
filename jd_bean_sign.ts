import axios from "axios";
import {httpsOverHttp} from 'tunnel'
import {readFileSync, writeFileSync, unlinkSync} from "fs";
import {execSync} from "child_process";
import {requireConfig} from "./TS_USER_AGENTS";
import {TotalBean} from "../TS_USER_AGENTS";

const notify = require('./sendNotify')

let cookie: string = '', UserName: string, index: number;

async function main() {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    if (!isLogin) {
      notify.sendNotify(__filename.split('/').pop(), `cookie已失效\n京东账号${index}：${nickName || UserName}`)
      continue
    }
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

    const tunnelProxy = httpsOverHttp({
      proxy: {
        host: '127.0.0.1',
        port: parseInt('1080'),
      },
    });

    let data: any;

    try {
      data = await axios.get('https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js', {timeout: 5000})
      data = data.data
    } catch (e) {
      try {
        data = await axios.get('https://ghproxy.com/https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js', {timeout: 10000})
        data = data.data
      } catch (e) {
        data = '非脚本问题！网络错误，访问github失败'
      }
    }
    console.log(data)
    if (data.indexOf('京东多合一签到脚本') > -1) {
      data = data.replace("var Key = ''", `var Key = '${cookie}'`)
      writeFileSync('./sign.js', data)
      execSync('node ./sign.js>>./sign.log')
      let msg = readFileSync('./sign.log')
      unlinkSync('./sign.js')
      unlinkSync('./sign.log')
      await notify.sendNotify(`多合一签到  ${UserName}`, msg, '', '\n\n你好，世界！')
    } else {
      await notify.sendNotify(`多合一签到  ${UserName}`, data, '', '\n\n你好，世界！')
    }
  }
}

main().then()