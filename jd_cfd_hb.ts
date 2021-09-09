/**
 * export jd_cfd_hb=100
 *
 * 我就是看看，不抢
 */
import axios from 'axios';
import USER_AGENT, {requireConfig, requestAlgo, decrypt, wait} from './TS_USER_AGENTS';
import * as dotenv from 'dotenv';

dotenv.config()
let cookie: string = '', cookiesArr: any, res: any = '';

!(async () => {
  await requestAlgo();
  cookiesArr = await requireConfig();
  cookie = cookiesArr[0]
  res = await api('user/ExchangeState', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strZone', {dwType: '2'})
  while(1) {
    if (new Date().getSeconds() < 15)
      break
    else
      await wait(50)
  }
  for (let t of res.hongbao) {
    console.log(t.strPrizeName, 'state:', t.dwState, 'num:', t.dwStockNum)
  }
})()

interface Params {
  dwType?: string,
}

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise(async resolve => {
    let url = `https://m.jingxi.com/jxbfd/${fn}?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(stk)}`
    if (Object.keys(params).length !== 0) {
      let key: (keyof Params)
      for (key in params) {
        if (params.hasOwnProperty(key))
          url += `&${key}=${params[key]}`
      }
    }
    url += '&h5st=' + decrypt(stk, url)
    let {data} = await axios.get(url, {
      headers: {
        'Host': 'm.jingxi.com',
        'Referer': 'https://st.jingxi.com/',
        'User-Agent': USER_AGENT,
        'Cookie': cookie
      }
    })
    resolve(data)
  })
}