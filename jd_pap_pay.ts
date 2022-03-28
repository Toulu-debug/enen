import USER_AGENT, {randomWord, requireConfig, wait, get} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, msg: string = ''

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    let headers = {
      "Host": "wq.jd.com",
      "User-Agent": USER_AGENT,
      "Referer": "https://wqs.jd.com/",
      "Cookie": cookie
    }

    // query
    res = await get(`https://wq.jd.com/wxcontractgw/querypappaycontract?appid=wxae3e8056daea8727&_=${Date.now()}&g_login_type=0&callback=jsonpCBK${randomWord()}&g_tk=1600943825&g_ty=ls`, '', headers)
    if (res.data.status === 1) {
      console.log('免密支付 未启用')
    } else {
      console.log('免密支付 未禁用')
      res = await get(`https://wq.jd.com/wxcontractgw/terminatepappaycontract?appid=wxae3e8056daea8727&_=${Date.now()}&g_login_type=0&callback=jsonpCBK${randomWord()}&g_tk=1600943825&g_ty=ls`, '', headers)
      if (res.errcode === 0) {
        console.log('免密支付 禁用成功')
        msg += `【京东账号${index + 1}】  ${UserName}\n免密支付 禁用成功\n\n`
      } else {
        console.log('免密支付 禁用失败')
        msg += `【京东账号${index + 1}】  ${UserName}\n免密支付 禁用失败\n\n`
      }
    }

    await wait(1000)
  }
})()
