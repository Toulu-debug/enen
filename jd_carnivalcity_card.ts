/**
 * 手机狂欢城
 * 浏览、加购
 * cron: 15 0,6 * * *
 */

import USER_AGENT, {o2s, post, requireConfig, wait} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    for (let i = 0; i < 30; i++) {
      res = await api({"apiMapping": "/khc/index/headInfo"})
      o2s(res.data)
      if (res.data.taskType === '14') {
        res = await api({"taskId": res.data.taskId, "taskIndex": res.data.taskIndex, "apiMapping": "/khc/task/getHeadJoinPrize"})
        console.log('加购', res.msg, res.data.jingBean)

        await wait(1000)
      } else if (['13', '15'].includes(res.data.taskType)) {
        res = await api({"taskIndex": res.data.taskIndex, "taskId": res.data.taskId, "taskType": res.data.taskType, "apiMapping": "/khc/task/doBrowseHead"})
        await wait(6000)
        res = await api({"browseId": res.data.browseId, "apiMapping": "/khc/task/getHeadBrowsePrize"})
        console.log('浏览', res.msg, res.data.jingBean)
        await wait(1000)
      } else if (!res.data.taskType) {
        console.log('任务全部完成')
        break
      }
    }

    res = await api({"apiMapping": "/khc/rank/dayRank"})
    console.log('我的积分', parseInt(res.data.myRank.integral))
    console.log('我的排名', parseInt(res.data.myRank.rank))

    if (index === cookiesArr.length - 1) {
      console.log('\n')
      console.log('TOP1 ', parseInt(res.data.rankList[0].integral))
      console.log('TOP10', parseInt(res.data.rankList[9].integral))
    }
  }
})()

async function api(body: object) {
  return await post('https://api.m.jd.com/api',
    `appid=reinforceints&functionId=carnivalcity_jd_prod&body=${JSON.stringify(body)}&t=${Date.now()}&h5st=&loginType=2`, {
      'Host': 'api.m.jd.com',
      'Origin': 'https://welfare.m.jd.com',
      'User-Agent': USER_AGENT,
      'Referer': 'https://welfare.m.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    })
}