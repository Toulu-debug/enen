/**
 * 健康社区
 * https://h5.m.jd.com/babelDiy/Zeus/D2CwCLVmaP3QonubWFJeTVhYRyT/index.html
 * cron: 35 0,6,18 * * *
 */

import axios from 'axios';
import USER_AGENT, {exceptCookie, requireConfig, wait} from "./TS_USER_AGENTS";
import * as path from "path";

let cookie: string = '', res: any = '', UserName: string

!(async () => {
  let cookiesArr: string[] = await requireConfig();
  let except: string[] = exceptCookie(path.basename(__filename));

  for (let [index, value] of cookiesArr.entries()) {
    cookie = value;
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`);

    if (except.includes(encodeURIComponent(UserName))) {
      console.log('已设置跳过')
      continue
    }

    for (let j = 0; j < 3; j++) {
      res = await api('jdhealth_getTaskDetail', {"buildingId": "", "taskId": "", "channelId": 1})
      try {
        for (let t of res.data.result.taskVos) {
          if (t.status === 1 || t.status === 3) {
            console.log(t.taskName)
            for (let tp of t.productInfoVos || t.followShopVo || t.shoppingActivityVos || []) {
              if (tp.status === 1) {
                console.log('\t', tp.skuName || tp.shopName || tp.title)
                if (t.taskName.includes('早睡打卡') && t.taskBeginTime < Date.now() && t.taskEndTime > Date.now()) {
                  res = await api('jdhealth_collectScore', {"taskToken": tp.taskToken, "taskId": t.taskId, "actionType": 1})
                  await wait(2000)
                  console.log('\t', res.data.bizMsg)
                }
                if (t.waitDuration) {
                  res = await api('jdhealth_collectScore', {"taskToken": tp.taskToken, "taskId": t.taskId, "actionType": 1})
                  console.log('\t', res.data.bizMsg)
                  await wait(t.waitDuration * 1000)
                }
                res = await api('jdhealth_collectScore', {"taskToken": tp.taskToken, "taskId": t.taskId, "actionType": 0})
                if (res.data.bizMsg.includes('做完')) {
                  console.log(res.data.bizMsg)
                  break
                } else {
                  console.log(res.data.bizMsg, parseInt(res.data.result.score))
                  await wait(1500)
                }
              }
            }
          }
        }
      } catch (e) {
        console.log('Error', e)
        break
      }
      await wait(10000)
    }
  }
})();


async function api(fn: string, body: object) {
  let {data} = await axios.post('https://api.m.jd.com/', `functionId=${fn}&body=${encodeURIComponent(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&uuid=`, {
    headers: {
      'Host': 'api.m.jd.com',
      'Origin': 'https://h5.m.jd.com',
      'User-Agent': USER_AGENT,
      'Referer': 'https://h5.m.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  })
  return data
}