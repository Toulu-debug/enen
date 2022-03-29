/**
 * 微信小程序签到红包
 * cron: 8 0 * * *
 */

import {sendNotify} from './sendNotify'
import {post, requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, msg: string = ''

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    res = await post(`https://api.m.jd.com/signTask/doSignTask?functionId=SignComponent_doSignTask&appid=hot_channel&loginWQBiz=signcomponent&loginType=2&body={"activityId":"10002"}&g_ty=ls&g_tk=1294369933`, '', {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 MicroMessenger/8.0.15(0x18000f2e) NetType/WIFI Language/zh_CN',
      'referer': 'https://servicewechat.com/wx91d27dbf599dff74/581/page-frame.html',
      'cookie': cookie
    })
    if (res.data) {
      console.log('已签到', res.data.signDays, '天，奖励', res.data.rewardValue, '元')
      msg += `【京东账号${index + 1}】  ${UserName}\n已签到  ${res.data.signDays}天\n奖励  ${res.data.rewardValue}元\n\n`
    } else
      console.log(res.message)
    await wait(1000)
  }
  await sendNotify('微信小程序签到红包', msg)
})()