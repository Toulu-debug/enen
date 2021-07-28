/**
 * 推送CK，默认否
 * export PUSH_COOKIE=true
 */
import axios from 'axios'
import USER_AGENT from './TS_USER_AGENTS'

// const USER_AGENT = 'jdapp;android;10.0.5;11;0393465333165363-5333430323261366;network/wifi;model/M2102K1C;osVer/30;appBuild/88681;partner/lc001;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; M2102K1C Build/RKQ1.201112.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045534 Mobile Safari/537.36'
const qrcode = require('qrcode-terminal')
const notify = require('./sendNotify')
let PUSH_COOKIE = process.env.PUSH_COOKIE ?? false

!(async () => {
  console.log('可异地')
  let config: any = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json, text/plain, */*',
      'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
      'User-Agent': USER_AGENT,
      'Host': 'plogin.m.jd.com'
    }
  }
  let {headers, data} = await axios.get(`https://plogin.m.jd.com/cgi-bin/mm/new_login_entrance?lang=chs&appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport`, config)

  let s_token: string = data['s_token']

  let setCookie: string = ''
  for (let h of headers['set-cookie'])
    setCookie += h + ';'

  let guid: string = setCookie.match(/guid=([^;]*)/)![1]
  let lsid: string = setCookie.match(/lsid=([^;]*)/)![1]
  let lstoken: string = setCookie.match(/lstoken=([^;]*)/)![1]
  let cookies: string = `guid=${guid};lang=chs;lsid=${lsid};lstoken=${lstoken};`
  config.headers.cookie = cookies

  let body = {
    'lang': 'chs',
    'appid': '300',
    'returnurl': `https://wqlogin2.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action`,
    'source': 'wq_passport',
  }

  let res: any = await axios.post(`https://plogin.m.jd.com/cgi-bin/m/tmauthreflogurl?s_token=${s_token}&v=${Date.now()}&remember=true`,
    encodeURIComponent(JSON.stringify(body)), config)
    .then(res => {
      return res
    })
  let token: string = res.data.token;
  let okl_token: string = res.headers['set-cookie'][0].match(/okl_token=([^;]*)/)![1]
  let url: string = `https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token=${token}`
  console.log(url)
  qrcode.generate(url, {small: true})

  while (1) {
    res = await axios.post(`https://plogin.m.jd.com/cgi-bin/m/tmauthchecktoken?&token=${token}&ou_state=0&okl_token=${okl_token}`, `lang=chs&appid=300&source=wq_passport&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action`, {
      headers: {
        'Referer': `https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport`,
        'Cookie': cookies,
        'Connection': 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': USER_AGENT
      }
    })
      .then(res => {
        return res
      })

    console.log(JSON.stringify(res.data))
    let code: number = res.data.errcode;
    if (code === 0) {
      console.log('Cookie获取成功\n')
      for (let h of res.headers['set-cookie'])
        setCookie += h + ';'
      cookies = setCookie.match(/(pt_key=\S*)/)![1] + setCookie.match(/(pt_pin=\S*)/)![1]
      console.log(cookies)
      console.log('\n哪个死妈东西说扫了此脚本被偷ck的？100行不到的代码你告诉我哪里是泄漏你ck的？')
      if (PUSH_COOKIE)
        await notify.sendNotify('Cookie', cookies+'\n\n哪个死妈东西说扫了此脚本被偷ck的？100行不到的代码你告诉我哪里是泄漏你ck的？', '','\n\n你好，世界！')
      break
    } else if (code === 21) {
      console.log('二维码失效')
      break
    } else if (code === 176) {
    } else {
      console.log('Error:', JSON.stringify(res.data))
      break
    }

    await wait(1000)
  }
})()

function wait(t: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, t)
  })
}
