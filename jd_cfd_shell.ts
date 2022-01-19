/**
 * 财富岛捡贝壳挂后台
 * cron: 10 0 * * *
 */

import axios from 'axios'
import {requireConfig, wait, requestAlgo, h5st, randomWord} from './TS_USER_AGENTS'

let cookie: string = '', res: any = ''
process.env.CFD_LOOP_DELAY ? console.log('设置延迟:', parseInt(process.env.CFD_LOOP_DELAY)) : console.log('设置延迟:10000~25000随机')

let UserName: string, index: number
!(async () => {
  await requestAlgo()
  let cookiesArr: string[] = await requireConfig()

  while (1) {
    if (new Date().getHours() === 0 && new Date().getMinutes() < 10)
      break
    for (let i = 0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i]
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      index = i + 1
      console.log(`\n开始【京东账号${index}】${UserName}\n`)
      try {
        let shell: any = await speedUp('_cfd_t,bizCode,dwEnv,ptag,source,strZone')
        if (shell?.Data?.NormShell) {
          for (let s of shell.Data.NormShell) {
            for (let j = 0; j < s.dwNum; j++) {
              res = await speedUp('_cfd_t,bizCode,dwEnv,dwType,ptag,source,strZone', s.dwType)
              if (res.iRet !== 0) {
                console.log(res)
                break
              }
              console.log('捡贝壳:', res.Data.strFirstDesc)
              await wait(1500)
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    await wait(60 * 10 * 1000) // 10min
  }
})()

async function speedUp(stk: string, dwType?: number) {
  try {
    let url: string = stk === '_cfd_t,bizCode,dwEnv,ptag,source,strZone'
      ? `https://m.jingxi.com/jxbfd/story/queryshell?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
      : `https://m.jingxi.com/jxbfd/story/pickshell?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&dwType=${dwType}&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrZone&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
    url = h5st(url, stk, {})
    let {data} = await axios.get(url, {
      headers: {
        'Host': 'm.jingxi.com',
        'Referer': 'https://st.jingxi.com/',
        'User-Agent': 'jdpingou;',
        'Cookie': cookie
      }
    })
    return JSON.parse(data.match(/jsonpCBK.?\((.*)/)![1])
  } catch (e) {
    return ''
  }
}