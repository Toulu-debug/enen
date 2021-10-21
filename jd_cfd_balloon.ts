/**
 * 财富岛热气球挂后台
 * cron: 10 0 * * *
 */

import axios from 'axios'
import USER_AGENT, {requireConfig, wait, requestAlgo, h5st} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', flag: boolean = true;
let UserName: string, index: number;
!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();

  while (1) {
    if (!flag)
      break
    for (let i = 0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i];
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      index = i + 1;
      console.log(`\n开始【京东账号${index}】${UserName}\n`);
      try {
        res = await speedUp('_cfd_t,bizCode,dwEnv,ptag,source,strBuildIndex,strZone')
        if (res.iRet !== 0) {
          console.log('手动建造4个房子')
          flag = false
        }
        console.log('今日热气球:', res.dwTodaySpeedPeople)
        if (res.dwTodaySpeedPeople === 500) {
          flag = false
        }
      } catch (e) {
        console.log(e)
        flag = false
      }
      await wait(1000)
    }
    await wait(30 * 1000)
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