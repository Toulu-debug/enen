/**
 * 财富岛热气球挂后台
 * export CFD_LOOP_DELAY=20000  // 捡气球间隔时间，单位毫秒
 */

import axios from 'axios'
import USER_AGENT, {requireConfig, wait, getRandomNumberByRange, requestAlgo, decrypt, h5st} from './TS_USER_AGENTS'
import * as dotenv from 'dotenv'

const crypto = require('crypto')
const fs = require('fs')
const notify = require('./sendNotify')
dotenv.config()

let cookie: string = '', res: any = '', balloon: number = 1;
process.env.CFD_LOOP_DELAY ? console.log('设置延迟:', parseInt(process.env.CFD_LOOP_DELAY)) : console.log('设置延迟:10000~25000随机')

let UserName: string, index: number;
!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();

  let filename: string = __filename.split('/').pop()!
  let stream = fs.createReadStream(filename);
  let fsHash = crypto.createHash('md5');

  stream.on('data', (d: any) => {
    fsHash.update(d);
  });

  stream.on('end', () => {
    let md5 = fsHash.digest('hex');
    console.log(`${filename}的MD5是:`, md5);
    if (filename.indexOf('JDHelloWorld_jd_scripts_') > -1) {
      filename = filename.replace('JDHelloWorld_jd_scripts_', '')
    }
    axios.get('https://api.jdsharecode.xyz/api/md5?filename=' + filename, {timeout: 10000})
      .then((res: any) => {
        console.log('local: ', md5)
        console.log('remote:', res.data)
        if (md5 !== res.data) {
          notify.sendNotify("Warning", `${filename}\nMD5校验失败！你的脚本疑似被篡改！`)
        } else {
          console.log('MD5校验通过！')
        }
      }).catch(() => {

    })
  });

  while (1) {
    for (let i = 0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i];
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      index = i + 1;
      console.log(`\n开始【京东账号${index}】${UserName}\n`);
      try {
        if (balloon !== 500) {
          res = await speedUp('_cfd_t,bizCode,dwEnv,ptag,source,strBuildIndex,strZone')
          if (res.iRet !== 0) {
            console.log('手动建造4个房子')
            continue
          }
          console.log('今日热气球:', res.dwTodaySpeedPeople)
          if (res.dwTodaySpeedPeople === 500) {
            balloon = 500
          }
        }

        let shell: any = await speedUp('_cfd_t,bizCode,dwEnv,ptag,source,strZone')
        if (shell.Data.hasOwnProperty('NormShell')) {
          for (let s of shell.Data.NormShell) {
            for (let j = 0; j < s.dwNum; j++) {
              res = await speedUp('_cfd_t,bizCode,dwEnv,dwType,ptag,source,strZone', s.dwType)
              if (res.iRet !== 0) {
                console.log(res)
                break
              }
              console.log('捡贝壳:', res.Data.strFirstDesc)
              await wait(500)
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    let t: number = process.env.CFD_LOOP_DELAY ? parseInt(process.env.CFD_LOOP_DELAY) : getRandomNumberByRange(1000 * 30, 1000 * 60)
    await wait(t)
  }
})()

function speedUp(stk: string, dwType?: number) {
  return new Promise(async (resolve, reject) => {
    let url: string = `https://m.jingxi.com/jxbfd/user/SpeedUp?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&strBuildIndex=food&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(stk)}`
    if (stk === '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
      url = `https://m.jingxi.com/jxbfd/story/queryshell?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1&_=${Date.now()}&sceneval=2`
    if (stk === '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strZone')
      url = `https://m.jingxi.com/jxbfd/story/pickshell?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&dwType=${dwType}&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrZone&_ste=1&_=${Date.now()}&sceneval=2`
    url = h5st(url, stk, {})
    axios.get(url, {
      headers: {
        'Host': 'm.jingxi.com',
        'Referer': 'https://st.jingxi.com/',
        'User-Agent': USER_AGENT,
        'Cookie': cookie
      }
    }).then((res: any) => {
      resolve(res.data)
    }).catch(e => {
      reject(e.data)
    })
  })
}