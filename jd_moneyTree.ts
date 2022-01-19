import axios from 'axios';
import USER_AGENT, {requireConfig, wait} from "./TS_USER_AGENTS";
import {read} from "fs";

let cookie: string = '', res: any = '', UserName: string, index: number;

!(async () => {
  let cookiesArr: string[] = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);
    let body: any = {
      "sharePin": "",
      "shareType": 1,
      "channelLV": "",
      "source": 2,
      "riskDeviceParam": {
        "eid": "",
        "fp": "",
        "sdkToken": "",
        "token": "",
        "jstub": "",
        "appType": "2",
      }
    }
    body.riskDeviceParam = JSON.stringify(body.riskDeviceParam)
    res = await api('login', body)
    console.log(JSON.stringify(res))
    let user: any = res.resultData.data
    if (!user.realName) {
      console.log(`${UserName}未开通游戏`)
      continue
    }
    console.log('助力码:', user.sharePin)

    // 收果子
    console.log('树上果子:', user.treeInfo.fruitOnTree)
    body = {
      "source": 2,
      "sharePin": "",
      "userId": user.userInfo,
      "userToken": user.userToken,
      "shareType": 1,
      "channel": "",
      "riskDeviceParam": "{\"eid\":\"\",\"fp\":\"\",\"sdkToken\":\"\",\"token\":\"\",\"jstub\":\"\",\"appType\":2}"
    }
    res = await api('harvest', body)
    await wait(3000)
    if (res.resultData.code === '200') {
      console.log('收果子成功，剩余：', res.resultData.data.treeInfo.fruit)
      console.log(`距离${res.resultData.data.treeInfo.treeName}还有${res.resultData.data.treeInfo.progressLeft}`)
    }

    // 签到
    body = {
      "source": 2,
      "riskDeviceParam": "{\"eid\":\"\",\"fp\":\"\",\"sdkToken\":\"\",\"token\":\"\",\"jstub\":\"\",\"appType\":4}"
    }
    res = await api('signIndex', body)
    await wait(3000)

    if (res.resultData.data?.canSign === 2) {
      console.log('今日未签到')
      for (let sign of res.resultData.data.result) {
        if (sign.signStatus === 0) {
          console.log(sign)
          body = {"source": 2, "signDay": sign.signDays, "riskDeviceParam": "{\"eid\":\"\",\"fp\":\"\",\"sdkToken\":\"\",\"token\":\"\",\"jstub\":\"\",\"appType\":4}"}
          res = await api('signOne', body)
          console.log('签到:', res)
          break
        }
      }
    } else {
      console.log('今日已签到')
    }
    await wait(3000)

    // 获取任务
    body = {
      "source": 0,
      "linkMissionIds": [],
      "LinkMissionIdValues": [],
      "riskDeviceParam": {
        "eid": "",
        "fp": "",
        "sdkToken": "",
        "token": "",
        "jstub": "",
        "appType": 2
      }
    }
    for (let k = 0; k < 3; k++) {
      console.log('Round:', k + 1)
      body.riskDeviceParam = JSON.stringify(body.riskDeviceParam)
      res = await api('dayWork', body)
      // console.log('dayWork⬇️')
      // console.log(JSON.stringify(res))
      await wait(3000)

      for (let t of res.resultData.data) {
        /**
         * -1 未开始
         * 0  已开始
         * 1  可领奖
         * 2  已完成
         */
        if (t.workStatus !== 2) {
          if (t.workType === 1) {
            // 时段签到
            body = {
              "source": 2,
              "workType": 1,
              "opType": 2,
              "mid": 0,
              "riskDeviceParam": "{\"eid\":\"\",\"fp\":\"\",\"sdkToken\":\"\",\"token\":\"\",\"jstub\":\"\",\"appType\":4}"
            }
            await api('doWork', body)
            await wait(2000)
            console.log('时段签到:', res)
          }
          /*
          if (t.url?.indexOf('juid') > -1) {
            console.log(t.workName)
            let juid: string = t.url.split('juid=')[1];
            res = await mission('getJumpInfo', `%7B%22juid%22:%22${juid}%22%7D`, t.url)
            console.log(res)
            await wait(3000)
            break
          }
           */
          if (t.url?.indexOf('readTime') > -1) {
            console.log(t.workName)
            if (t.workStatus === -1) {
              body = {"source": 2, "workType": t.workType, "opType": 4, "mid": t.mid, "riskDeviceParam": "{\"eid\":\"\",\"fp\":\"\",\"sdkToken\":\"\",\"token\":\"\",\"jstub\":\"\",\"appType\":4}"}
              res = await api('doWork', body)
              await wait(2000)
              console.log('领取任务:', res.resultData?.data?.opMsg)
            }

            if (t.workStatus === 0) {
              res = await mission('queryMissionReceiveAfterStatus', `%7B%22missionId%22:%22${t.mid}%22%7D`, t.url)
              console.log('任务开始:', res.resultData?.msg)
              let readTime: number = t.url.split('readTime=')![1]
              await wait(readTime * 1000)

              res = await mission('finishReadMission', `%7B%22missionId%22%3A%22${t.mid}%22%2C%22readTime%22%3A${readTime}%7D`, t.url)
              console.log('任务完成:', res.resultData?.msg)
              await wait(2000)
            }
          }
          if (t.workStatus === 1) {
            body = {
              "source": 0,
              "workType": t.workType,
              "opType": 2,
              "mid": t.mid,
              "riskDeviceParam": "{\"eid\":\"\",\"fp\":\"\",\"sdkToken\":\"\",\"token\":\"\",\"jstub\":\"\",\"appType\":2}"
            }
            res = await api('doWork', body)
            console.log(t.workName, res.resultData.data.opMsg, res.resultData.data.prizeAmount)
            await wait(2000);
          }
        }
      }
      await wait(3000)
    }
  }
})()

async function api(fn: string, body: any) {
  if (['doWork'].indexOf(fn) > -1) {
    body = JSON.stringify(body)
  } else {
    body = encodeURIComponent(JSON.stringify(body))
  }
  let {data}: any = await axios.post(`https://ms.jr.jd.com/gw/generic/uc/h5/m/${fn}?_=${Date.now() * 1000}`,
    `reqData=${body}`,
    {
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Origin': 'https://uua.jr.jd.com',
        'Host': 'ms.jr.jd.com',
        'Referer': 'https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index',
        'Accept': 'application/json',
        'Cookie': cookie
      }
    })
  return data
}

async function mission(fn: string, reqData: string, referer: string) {
  let url = 'https://ms.jr.jd.com/gw/generic/mission/h5/m/' + fn + '?reqData=' + reqData
  let {data}: any = await axios.get(url, {
    headers: {
      'Host': 'ms.jr.jd.com',
      'Origin': referer.split('.com/')[0] + '.com',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; M2004J7AC Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045710 Mobile',
      'X-Requested-With': 'com.jd.jrapp',
      'Referer': referer.split('.com/')[0] + '.com',
      'cookie': cookie
    }
  })
  return data
}