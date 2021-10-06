import axios from "axios";
import {readFileSync, writeFileSync, unlinkSync, accessSync} from "fs";
import {execSync} from "child_process";
import {requireConfig} from "./TS_USER_AGENTS";

let notify = require('./sendNotify'), message: string = '';

async function main() {
  let cookiesArr: any = await requireConfig();
  let cookiesNobyDa: {
    cookie: string
  }[] = []

  for (let i = 0; i < cookiesArr.length; i++) {
    cookiesNobyDa.push({cookie: cookiesArr[i]})
  }
  let data: any = '';
  try {
    data = await axios.get('https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js', {timeout: 5000})
    data = data.data
    console.log('raw')
  } catch (e) {
    try {
      data = await axios.get('https://ghproxy.com/https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js', {timeout: 10000})
      data = data.data
      console.log('ghproxy')
    } catch (e) {
      data = '非脚本问题！网络错误，访问github失败'
    }
  }

  if (data.indexOf('京东多合一签到脚本') > -1) {
    data = data.replace('var OtherKey = ``;', `var OtherKey = \`${JSON.stringify(cookiesNobyDa)}\`;`)
    writeFileSync('./sign.js', data, 'utf-8')
    execSync('node ./sign.js >> ./sign.log')
    data = readFileSync('./sign.log', 'utf-8')
    data = data.match(/【.*/gm)
    message += data.join('\n').replace(/红包/g, '红包\n\n')
    unlinkSync('./sign.js')
    unlinkSync('./sign.log')
  }
  await notify.sendNotify('京东多合一签到脚本 via NobyDa@Github', message)
}

main().then()
