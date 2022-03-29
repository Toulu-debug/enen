import {sendNotify} from './sendNotify'
import {pushplus} from "./utils/pushplus"
import USER_AGENT, {get, requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string
let message: string = ''

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
    res = await get(`https://m.jingxi.com/user/info/QueryUserRedEnvelopesV2?type=1&orgFlag=JD_PinGou_New&page=1&cashRedType=1&redBalanceFlag=1&channel=1&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`, '',
      {
        'Host': 'm.jingxi.com',
        'Referer': 'https://st.jingxi.com/my/redpacket.shtml',
        "Cookie": cookie,
        'User-Agent': USER_AGENT
      })
    let day: number = new Date().getDay(), jdRed: number = 0, jdRedExp: number = 0
    for (let j of res.data.useRedInfo?.redList || []) {
      if (j.orgLimitStr.includes('京喜')) {
      } else if (j.activityName.includes('极速版')) {
      } else if (j.orgLimitStr.includes('京东健康')) {
      } else {
        jdRed = add(jdRed, j.balance)
        if (new Date(j.endTime * 1000).getDay() === day)
          jdRedExp = add(jdRedExp, j.balance)
      }
    }
    console.log(jdRed, '  今日过期：', jdRedExp)
    let text: string = `【账号】  ${UserName}\n京东红包  ${jdRed}\n今日过期  ${jdRedExp}`
    await pushplus('京东红包', text)

    message += `${text}\n\n`
    await wait(2000)
  }
  await sendNotify('京东红包', message)
})()

function add(arg1: number, arg2: number) {
  let r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return parseFloat(((arg1 * m + arg2 * m) / m).toFixed(2))
}