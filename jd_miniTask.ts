/**
 * 微信-购物-天天赚💰
 */

import {getCookie} from "./TS_USER_AGENTS";

!(async () => {
  let cookiesArr: string[] = await getCookie();
  let wqskey: string[] = []
  for (let cookie of cookiesArr) {
    if (cookie.includes('wq_uin') && cookie.includes('wq_skey')) {
      wqskey.push(cookie)
    }
  }
  if (wqskey.length === 0) {
    console.log('无微信购物专用cookie')
  }
})()