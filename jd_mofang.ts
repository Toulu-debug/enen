import axios from 'axios';
import USER_AGENT, {requireConfig, wait} from './TS_USER_AGENTS';

let cookie: string = '', res: any = '', UserName: string, index: number;
let shareCodeSelf: {
  encryptProjectId: string,
  encryptAssignmentId: string,
  itemId: string
} [] = [];

const DEBUG = false;

!(async () => {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    res = await api("functionId=getInteractionHomeInfo&body=%7B%22sign%22%3A%22u6vtLQ7ztxgykLEr%22%7D&appid=content_ecology&client=wh5&clientVersion=1.0.0")
    let sign: string = res.result.taskConfig.projectId
    DEBUG ? console.log(JSON.stringify(res)) : ''

    console.log('sing:', sign)
    res = await api(`functionId=queryInteractiveInfo&body=%7B%22encryptProjectId%22%3A%22${sign}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
    DEBUG ? console.log(JSON.stringify(res)) : ''

    for (let t of res.assignmentList) {
      if (t.completionCnt < t.assignmentTimesLimit) {
        if (t.ext) {
          if (t.ext.extraType === 'assistTaskDetail') {
            console.log('助力码:', t.ext.assistTaskDetail.itemId)
            shareCodeSelf.push({
              encryptProjectId: sign,
              encryptAssignmentId: t.encryptAssignmentId,
              itemId: t.ext.assistTaskDetail.itemId
            })
          }
          if (t.assignmentName === '每日签到') {
            let signDay: number = t.ext.sign1.signList?.length || 0,
              type: number = t.rewards[signDay].rewardType
            console.log(signDay, type)
            // TODO 签到
          }

          for (let proInfo of t.ext.productsInfo ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              res = await api(`functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${sign}%22%2C%22encryptAssignmentId%22%3A%22${t.encryptAssignmentId}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22itemId%22%3A%22${proInfo.itemId}%22%2C%22actionType%22%3A0%2C%22completionFlag%22%3A%22%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res)
            }
          }
          for (let proInfo of t.ext.shoppingActivity ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              res = await api(`functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${sign}%22%2C%22encryptAssignmentId%22%3A%22${t.encryptAssignmentId}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22itemId%22%3A%22${proInfo.advId}%22%2C%22actionType%22%3A1%2C%22completionFlag%22%3A%22%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res)
              await wait(t.ext.waitDuration * 1000)
              res = await api(`functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${sign}%22%2C%22encryptAssignmentId%22%3A%22${t.encryptAssignmentId}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22itemId%22%3A%22${proInfo.advId}%22%2C%22actionType%22%3A0%2C%22completionFlag%22%3A%22%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res)
            }
          }
          for (let proInfo of t.ext.browseShop ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              res = await api(`functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${sign}%22%2C%22encryptAssignmentId%22%3A%22${t.encryptAssignmentId}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22itemId%22%3A%22${proInfo.itemId}%22%2C%22actionType%22%3A1%2C%22completionFlag%22%3A%22%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res)
              await wait(t.ext.waitDuration * 1000)
              res = await api(`functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${sign}%22%2C%22encryptAssignmentId%22%3A%22${t.encryptAssignmentId}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22itemId%22%3A%22${proInfo.itemId}%22%2C%22actionType%22%3A0%2C%22completionFlag%22%3A%22%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log(res)
            }
          }
          for (let proInfo of t.ext.addCart ?? []) {
            if (proInfo.status === 1) {
              console.log(t.assignmentName)
              res = await api(`functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${sign}%22%2C%22encryptAssignmentId%22%3A%22${t.encryptAssignmentId}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22itemId%22%3A%22${proInfo.itemId}%22%2C%22actionType%22%3A1%2C%22completionFlag%22%3A%22%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
              console.log('加购:', res)
              if (res.msg === '任务已完成')
                break
              await wait(2000)
            }
          }
        }
      }
    }
  }

  console.log('助力排队:', shareCodeSelf)

  cookie = cookiesArr[0];
  UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
  for (let code of shareCodeSelf) {
    console.log(`账号1 ${UserName} 去助力 ${code.itemId}`)
    res = await api(`functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${code.encryptProjectId}%22%2C%22encryptAssignmentId%22%3A%22${code.encryptAssignmentId}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22itemId%22%3A%22${code.itemId}%22%2C%22actionType%22%3A%22%22%2C%22completionFlag%22%3A%22%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
    console.log('助力结果:', res)
    await wait(2000)
  }

  cookie = cookiesArr[1];
  UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
  let code: any = shareCodeSelf[0]
  console.log(`账号2 ${UserName} 去助力 ${code.itemId}`)
  res = await api(`functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${code.encryptProjectId}%22%2C%22encryptAssignmentId%22%3A%22${code.encryptAssignmentId}%22%2C%22sourceCode%22%3A%22acexinpin0823%22%2C%22itemId%22%3A%22${code.itemId}%22%2C%22actionType%22%3A%22%22%2C%22completionFlag%22%3A%22%22%2C%22ext%22%3A%7B%7D%7D&client=wh5&clientVersion=1.0.0&appid=content_ecology`)
  console.log('助力结果:', res)

})()

async function api(params: any) {
  let {data}: any = await axios.post("https://api.m.jd.com/client.action", params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
      'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html',
      'Origin': 'https://h5.m.jd.com',
      'Host': 'api.m.jd.com',
      'Cookie': cookie
    }
  })
  await wait(1000)
  return data
}