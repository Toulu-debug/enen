import axios from 'axios'
import USER_AGENT, {getCookie, wait} from './TS_USER_AGENTS'

let cookie: string = '', UserName: string = '', elements: Array<{ desc: string, level: number | null, name: string }>

!(async () => {
  let cookiesArr: string[] = await getCookie()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    axios.get(`https://api.m.jd.com/?t=${Date.now()}&functionId=pg_channel_page_data&appid=vip_h5&body=%7B%22paramData%22:%7B%22token%22:%2260143dce-1cde-44de-8130-a6e5579e1567%22%7D%7D`, {
      headers: {
        'Host': 'api.m.jd.com',
        'Origin': 'https://vipgrowth.m.jd.com',
        'Accept': 'application/json',
        'User-Agent': USER_AGENT,
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Referer': 'https://vipgrowth.m.jd.com/',
        'Cookie': cookie
      }
    }).then(({data: res}: any) => {
      console.log('京享值', res.data.floorInfoList[0].floorData.jxScoreInfo.jxScore)
      elements = res.data.floorInfoList[0].floorData.jxScoreInfo.elements
      for (let ele of elements) {
        if (ele.level) {
          console.log(ele.name, ele.level)
        }
      }
      console.log('更新时间', res.data.floorInfoList[0].floorData.jxScoreInfo.lastUpdateTime)
    }).catch(err => {
      console.log(err)
    })
    await wait(3000)
  }
  desc()
})()

function desc() {
  console.log('\n\n')
  for (let ele of elements) {
    if (ele.level) {
      console.log(`${ele.name}：${ele.desc}`)
    }
  }
}
