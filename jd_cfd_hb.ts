/**
 * 我就是看看，不抢
 */

import axios from 'axios';
import USER_AGENT, {requireConfig, requestAlgo, wait, h5st} from './TS_USER_AGENTS';

let cookie: string = '', cookiesArr: any, res: any = '';

!(async () => {
  await requestAlgo();
  cookiesArr = await requireConfig();
  cookie = cookiesArr[0]
  res = await api('user/ExchangeState', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strZone', {dwType: '2'})
  while (1) {
    if (new Date().getSeconds() < 61)
      break
    else
      await wait(1000)
  }
  const PrettyTable = require('prettytable');
  const pt = new PrettyTable();
  const title = ['Value', 'Status', 'Stock']
  let datas = []
  for (let t of res.hongbao) {
    datas.push([t.strPrizeName.replace('元', ''), t.dwState ? 'True' : 'False', t.dwStockNum])
  }
  pt.create(title, datas)
  pt.print();
})()

interface Params {
  dwType?: string,
}

function api(fn: string, stk: string, params: Params = {}) {
  return new Promise((resolve, reject) => {
    let url = `https://m.jingxi.com/jxbfd/${fn}?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_ste=1&_=${Date.now()}&sceneval=2&_stk=${encodeURIComponent(stk)}`
    url = h5st(url, stk, params, 10032)
    axios.get(url, {
      headers: {
        'Host': 'm.jingxi.com',
        'Referer': 'https://st.jingxi.com/',
        'User-Agent': USER_AGENT,
        'Cookie': cookie
      }
    }).then(res => {
      resolve(res.data)
    }).catch(e => {
      reject(e)
    })
  })
}