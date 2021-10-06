import axios from "axios";
import USER_AGENT, {h5st} from "../TS_USER_AGENTS";

async function bean(cookie: string) {
  let {data}: any = await axios.post('https://api.m.jd.com/client.action', `functionId=plantBeanIndex&body=${escape(JSON.stringify({version: "9.0.0.1", "monitor_source": "plant_app_plant_index", "monitor_refer": ""}))}&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0`, {
    headers: {
      Cookie: cookie,
      Host: "api.m.jd.com",
      "User-Agent": USER_AGENT
    }
  })
  if (data.data?.jwordShareInfo?.shareUrl)
    return data.data?.jwordShareInfo.shareUrl.split('Uuid=')![1]
  else
    return 'null'
}

async function farm(cookie: string) {
  let {data}: any = await axios.post('https://api.m.jd.com/client.action?functionId=initForFarm', `body=${escape(JSON.stringify({"version": 4}))}&appid=wh5&clientVersion=9.1.0`, {
    headers: {
      "cookie": cookie,
      "origin": "https://home.m.jd.com",
      "referer": "https://home.m.jd.com/myJd/newhome.action",
      "User-Agent": USER_AGENT,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
  return data.farmUserPro?.shareCode ?? 'null'
}

async function health(cookie: string) {
  let {data}: any = await axios.get(`https://api.m.jd.com/client.action/client.action?functionId=jdhealth_getTaskDetail&body=${escape(JSON.stringify({"buildingId": "", taskId: 6, "channelId": 1}))}&client=wh5&clientVersion=1.0.0`, {
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": USER_AGENT
    }
  })
  return data.data?.result?.taskVos[0].assistTaskDetailVo.taskToken ?? 'null'
}

async function pet(cookie: string) {
  let {data}: any = await axios.post(`https://api.m.jd.com/client.action?functionId=initPetTown`,
    `body=${escape(JSON.stringify({version: 2, channel: "app"}))}&appid=wh5&loginWQBiz=pet-town&clientVersion=9.0.4`, {
      headers: {
        'Cookie': cookie,
        "User-Agent": USER_AGENT,
        'Host': "api.m.jd.com",
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });
  return data.result?.shareCode ?? 'null'
}

async function factory(cookie: string) {
  let {data}: any = await axios.post(`https://api.m.jd.com/client.action?functionId=jdfactory_getTaskDetail`,
    `functionId=jdfactory_getTaskDetail&body=${escape(JSON.stringify({}))}&client=wh5&clientVersion=9.1.0`, {
      headers: {
        Cookie: cookie,
        origin: "https://h5.m.jd.com",
        referer: "https://h5.m.jd.com/",
        "Content-Type": "application/x-www-form-urlencoded",
        'User-Agent': USER_AGENT,
      }
    });
  if (data.data.bizCode === 0) {
    for (let t of data.data?.result?.taskVos) {
      if (t.taskType === 14)
        return t.assistTaskDetailVo.taskToken
    }
  }
  return 'null'
}

async function sgmh(cookie: string) {
  let {data}: any = await axios.post(`https://api.m.jd.com/client.action`,
    `functionId=interact_template_getHomeData&body={"appId":"1EFRXxg","taskToken":""}&client=wh5&clientVersion=1.0.0`, {
      headers: {
        'Origin': `https://h5.m.jd.com`,
        'Cookie': cookie,
        'Accept': `application/json, text/plain, */*`,
        'Referer': `https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html`,
        'Host': `api.m.jd.com`,
      }
    })
  if (data.data.bizCode === 0) {
    for (let t of data.data?.result?.taskVos) {
      if (t.taskName === '邀请好友助力')
        return t.assistTaskDetailVo.taskToken
    }
  }
  return 'null'
}

async function jxfactory(cookie: string) {
  let url: string = `https://m.jingxi.com/newtasksys/newtasksys_front/GetUserTaskStatusList?source=dreamfactory&bizCode=dream_factory&_time=${Date.now()}&_stk=${encodeURIComponent('_time,bizCode,source')}&_ste=1&_=${Date.now()}&sceneval=2`
  url = h5st(url, '_time,bizCode,source', {}, 10001)
  let {data}: any = await axios.get(url, {
    headers: {
      'Referer': 'https://actst.jingxi.com/pingou/dream_factory/index.html',
      'User-Agent': USER_AGENT,
      'Host': 'm.jingxi.com',
      'Cookie': cookie
    }
  })
  return data.data?.encryptPin ?? 'null'
}

async function cash(cookie: string) {
  let {data}: any = await axios.get(`https://api.m.jd.com/client.action?functionId=cash_mob_home&body=${escape(JSON.stringify({}))}&appid=CashRewardMiniH5Env&appid=9.1.0`, {
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/json',
      'Referer': 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
      'User-Agent': USER_AGENT,
    }
  })
  return data.data?.result?.inviteCode ?? 'null'
}

export {
  bean,
  farm,
  health,
  pet,
  factory,
  sgmh,
  jxfactory,
  cash,
}