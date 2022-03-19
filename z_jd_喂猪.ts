import axios from "axios";
import USER_AGENT, {o2s, requireConfig, wait} from "./TS_USER_AGENTS";

let cookie: string = '', res: any = '', UserName: string, index: number

!(async () => {
  let cookiesArr: string[] = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    res = await api('pigPetLogin', {"shareId": "", "helpId": "", "cardId": "", "signId": "", "validation": "", "channelLV": "", "source": 2, "riskDeviceParam": "{}"})
    o2s(res)
    if (!res.resultData.resultData.hasPig) {
      console.log('没有养猪，跳过')
      continue
    }

    let currCount = res.resultData.resultData.cote.pig.currCount
    let currLevelCount = res.resultData.resultData.cote.pig.currLevelCount
    console.log('成长值：', currCount, currLevelCount)
    if (currCount == currLevelCount) {
      console.log('成长值已满，跳过')
      continue
    }

    // 任务
    // res = await api('pigPetMissionList', {"source": 2, "channelLV": "", "riskDeviceParam": "{}"})
    // for(let t of res.resultData.resultData.missions){
    //   if(['完成每日分享',''])
    // }

    // 转盘
    res = await api('pigPetLotteryIndex', {"source": 2, "channelLV": "", "riskDeviceParam": "{}"})
    console.log('转盘次数：', res.resultData.resultData.currentCount)
    for (let j = 0; j < res.resultData.resultData.currentCount; j++) {
      res = await api('pigPetLotteryPlay', {"type": 0, "validation": "", "channelLV": "", "source": 2, "riskDeviceParam": "{}"})
      try {
        console.log('转盘')
        o2s(res)
        // console.log('转盘：', res.resultData.resultData.award.content, res.resultData.resultData.award.count)
      } catch (e) {
        console.log(e)
        o2s(res)
      }
    }

    // 背包
    res = await api('pigPetUserBag', {"category": "1001", "channelLV": "", "source": 2, "riskDeviceParam": "{}"})
    let levelMax: boolean = false
    for (let t of res.resultData.resultData.goods) {
      let food: number = t.count
      console.log(t.goodsName, food)
      for (let j = 0; j < 10; j++) {
        if (food >= 20 && !levelMax) {
          res = await api('pigPetAddFood', {channelLV: "", riskDeviceParam: "{}", skuId: "1001003003", source: 2})
          o2s(res)
          console.log(`喂${t.goodsName}，成长值：`, res.resultData.resultData.cote.pig.currCount)
          if (res.resultData.resultData.cote.pig.currCount === currLevelCount) {
            console.log('成长值已满')
            levelMax = true
            break
          }
          await wait(13000)
          food -= 20
        } else {
          break
        }
      }
    }
  }
})()

async function api(fn: string, body: object) {
  let {data} = await axios.post(`https://ms.jr.jd.com/gw/generic/uc/h5/m/${fn}?_=${Date.now()}`, `reqData=${encodeURIComponent(JSON.stringify(body))}`, {
    headers: {
      'Host': 'ms.jr.jd.com',
      'Accept': 'application/json',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Origin': 'https://u.jr.jd.com',
      'User-Agent': USER_AGENT,
      'Referer': 'https://u.jr.jd.com/',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Cookie': cookie
    }
  })
  return data
}