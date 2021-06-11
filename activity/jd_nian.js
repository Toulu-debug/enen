/*
京东炸年兽🧨
活动时间:2021-1-18至2021-2-11
暂不加入品牌会员
地址 https://wbbny.m.jd.com/babelDiy/Zeus/2cKMj86srRdhgWcKonfExzK4ZMBy/index.html
活动入口：京东app首页浮动窗口
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京东炸年兽🧨
0 9,12,20,21 * * * jd_nian.js, tag=京东炸年兽🧨, enabled=true

================Loon==============
[Script]
cron "0 9,12,20,21 * * *" script-path=jd_nian.js,tag=京东炸年兽🧨

===============Surge=================
京东炸年兽🧨 = type=cron,cronexp="0 9,12,20,21 * * *",wake-system=1,timeout=3600,script-path=jd_nian.js

============小火箭=========
京东炸年兽🧨 = type=cron,script-path=jd_nian.js, cronexpr="0 9,12,20,21 * * *", timeout=3600, enable=true
 */
const $ = new Env('京东炸年兽🧨');

const notify = $.isNode() ? require('../sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('../jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const randomCount = $.isNode() ? 20 : 5;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message, superAssist = [];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const inviteCodes = [
  `cgxZbDnLLbvT4kKFa2r4itMpof2y7_o@cgxZdTXtILLevwyYCwz65yWwCE8lGkr3bUNrT0h7kLPi4wxXS762i1R7_A0@cgxZdTXtIryM712cW1aougOBa8ZyzwDRObdr4-lyq7WPJbXwCd4EB76el1c@cgxZdTXtIL-L7FzMAQCqvap-CydslPKkAn5-YquhVOdq2fHQPxbVJ4pskHs`,
  `cgxZbDnLLbvT4kKFa2r4itMpof2y7_o@cgxZdTXtILLevwyYCwz65yWwCE8lGkr3bUNrT0h7kLPi4wxXS762i1R7_A0@cgxZdTXtIryM712cW1aougOBa8ZyzwDRObdr4-lyq7WPJbXwCd4EB76el1c@cgxZdTXtIL-L7FzMAQCqvap-CydslPKkAn5-YquhVOdq2fHQPxbVJ4pskHs`
];
const pkInviteCodes = [
  'IgNWdiLGaPadvlqJQnnKp27-YpAvKvSYNTSkTGvZylf_0wcvqD9EMkohEN4@IgNWdiLGaPaZskfACQyhgLSpZWps-WtQEW3McibU@IgNWdiLGaPaAvmHPAQf769XqjJjMyRirPzN9-AS-WHY9Y_G7t9Cwe5gdiI2qEvDY@IgNWdiLGaPYCeJUfsq18UNi5ln9xEZSPRdOue8Wl3hJTS2SQzU0vulL0fHeULJaIfgqHFd7f_ao@IgNWdiLGaPYCeJUfsq18UNi5ln9xEZSPRdOue8Wl3hLRjZBAJLHzBpcl18AeskNYctp_8w',
  'IgNWdiLGaPadvlqJQnnKp27-YpAvKvSYNTSkTGvZylf_0wcvqD9EMkohEN4@IgNWdiLGaPaZskfACQyhgLSpZWps-WtQEW3McibU@IgNWdiLGaPaAvmHPAQf769XqjJjMyRirPzN9-AS-WHY9Y_G7t9Cwe5gdiI2qEvDY@IgNWdiLGaPYCeJUfsq18UNi5ln9xEZSPRdOue8Wl3hJTS2SQzU0vulL0fHeULJaIfgqHFd7f_ao@IgNWdiLGaPYCeJUfsq18UNi5ln9xEZSPRdOue8Wl3hLRjZBAJLHzBpcl18AeskNYctp_8w'
]
let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
const openUrl = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://wbbny.m.jd.com/babelDiy/Zeus/2cKMj86srRdhgWcKonfExzK4ZMBy/index.html%22%20%7D`;
!(async () => {
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await shareCodesFormat();
      await shareCodesFormatPk()
      await jdNian()
    }
  }
  if(superAssist.length)
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await helpSuper()
    }
  }
  if ((nowTimes.getHours() < 20 && nowTimes.getHours() >= 10) && nowTimes.getDate() === 4) {
    if (nowTimes.getHours() === 12 || nowTimes.getHours() === 19) {
      $.msg($.name, '', '队伍红包已可兑换\n点击弹窗直达兑换页面', { 'open-url' : openUrl});
      if ($.isNode()) await notify.sendNotify($.name, `队伍PK红包已可兑换\n兑换地址: https://wbbny.m.jd.com/babelDiy/Zeus/2cKMj86srRdhgWcKonfExzK4ZMBy/index.html`)
    }
  }
  if (nowTimes.getHours() === 20 && nowTimes.getDate() === 4) {
    $.msg($.name, '', '年终奖红包已可兑换\n点击弹窗直达兑换页面', { 'open-url' : openUrl})
    if ($.isNode()) await notify.sendNotify($.name, `年终奖红包已可兑换\n兑换地址: https://wbbny.m.jd.com/babelDiy/Zeus/2cKMj86srRdhgWcKonfExzK4ZMBy/index.html`)
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdNian() {
  try {
    $.full = false
    await getHomeData()
    await nian_doAdditionalTask()
    if (!$.secretp) return
    // 注释PK互助代码
    // let hour = new Date().getUTCHours()
    // if (1 <= hour && hour < 12) {
    //   // 北京时间9点-20点
    //   $.hasGroup = false
    //   await pkTaskDetail()
    //   if ($.hasGroup) await pkInfo()
    //   await helpFriendsPK()
    // }
    // if (12 <= hour && hour < 14) {
    //   // 北京时间20点-22点
    //   $.hasGroup = false
    //   await pkTaskStealDetail()
    //   if ($.hasGroup) await pkInfo()
    //   await helpFriendsPK()
    // }
    if($.full) return
    await $.wait(2000)
    await killCouponList()
    await $.wait(2000)
    await map()
    await $.wait(2000)
    await queryMaterials()
    await getTaskList()
    await $.wait(1000)
    await doTask()
    await $.wait(2000)
    await helpFriends()
    await $.wait(2000)
    await getSpecialGiftDetail()
    await $.wait(2000)
    await getHomeData(true)
    await showMsg()
  } catch (e) {
    $.logErr(e)
  }
}

function encode(data, aa, extraData) {
  const temp = {
    "extraData": JSON.stringify(extraData),
    "businessData": JSON.stringify(data),
    "secretp": aa,
  }
  return {"ss": (JSON.stringify(temp))};
}

function getRnd() {
  return Math.floor(1e6 * Math.random()).toString();
}

function showMsg() {
  return new Promise(resolve => {
    console.log('任务已做完！\n如有未完成的任务，请多执行几次。注：目前入会任务不会做')
    console.log('如出现taskVos错误的，请更新USER_AGENTS.js或使用自定义UA功能')
    if (!jdNotify) {
      $.msg($.name, '', `${message}`);
    } else {
      $.log(`京东账号${$.index}${$.nickName}\n${message}`);
    }
    if (new Date().getHours() === 23) {
      $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    }
    resolve()
  })
}

async function helpFriends() {
  for (let code of $.newShareCodes) {
    if (!code) continue
    await getFriendData(code)
    await $.wait(1000)
  }
}

async function helpSuper(){
  $.secretp = null
  await getHomeData(true)
  if (!$.secretp) return
  for(let item of superAssist){
    await collectSpecialScore(item.taskId, item.itemId, null, item.inviteId)
  }
}

async function helpFriendsPK() {
  for (let code of $.newShareCodesPk) {
    if (!code) continue
    console.log(`去助力PK好友${code}`)
    await pkAssignGroup(code)
    await $.wait(1000)
  }
}

async function doTask() {
  for (let item of $.taskVos) {
    if (item.taskType === 14) {
      //好友助力任务
      //console.log(`您的好友助力码为${item.assistTaskDetailVo.taskToken}`)
    }
    if (item.taskType === 2) {
      if (item.status === 1) {
        console.log(`准备做此任务：${item.taskName}`)
        await getFeedDetail({"taskId": item.taskId}, item.taskId)
      } else if (item.status === 2) {
        console.log(`${item.taskName}已做完`)
      }
    } else if (item.taskType === 3 || item.taskType === 26) {
      if (item.shoppingActivityVos) {
        if (item.status === 1) {
          console.log(`准备做此任务：${item.taskName}`)
          for (let task of item.shoppingActivityVos) {
            if (task.status === 1) {
              await collectScore(item.taskId, task.itemId);
            }
            await $.wait(3000)
          }
        } else if (item.status === 2) {
          console.log(`${item.taskName}已做完`)
        }
      }
    } else if (item.taskType === 9) {
      if (item.status === 1) {
        console.log(`准备做此任务：${item.taskName}`)
        for (let task of item.shoppingActivityVos) {
          if (task.status === 1) {
            await collectScore(item.taskId, task.itemId, 1);
          }
          await $.wait(3000)
        }
      } else if (item.status === 2) {
        console.log(`${item.taskName}已做完`)
      }
    } else if (item.taskType === 7) {
      if (item.status === 1) {
        console.log(`准备做此任务：${item.taskName}`)
        for (let task of item.browseShopVo) {
          if (task.status === 1) {
            await collectScore(item.taskId, task.itemId, 1);
          }
        }
      } else if (item.status === 2) {
        console.log(`${item.taskName}已做完`)
      }
    } else if (item.taskType === 13) {
      if (item.status === 1) {
        console.log(`准备做此任务：${item.taskName}`)
        await collectScore(item.taskId, "1");
      } else if (item.status === 2) {
        console.log(`${item.taskName}已做完`)
      }
    } else if (item.taskType === 21) {
      if (item.status === 1) {
        console.log(`准备做此任务：${item.taskName}`)
        for (let task of item.brandMemberVos) {
          if (task.status === 1) {
            await collectScore(item.taskId, task.itemId);
          }
          await $.wait(3000)
        }
      } else if (item.status === 2) {
        console.log(`${item.taskName}已做完`)
      }
    }
  }
}

function getFeedDetail(body = {}) {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_getFeedDetail", body, "nian_getFeedDetail"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              if (data.data.result.addProductVos) {
                for (let vo of data.data.result.addProductVos) {
                  if (vo['status'] === 1) {
                    for (let i = 0; i < vo.productInfoVos.length && i + vo['times'] < vo['maxTimes']; ++i) {
                      let bo = vo.productInfoVos[i]
                      await collectScore(vo['taskId'], bo['itemId'])
                      await $.wait(2000)
                    }
                  }
                }
              }
              if (data.data.result.taskVos) {
                for (let vo of data.data.result.taskVos) {
                  if (vo['status'] === 1) {
                    for (let i = 0; i < vo.productInfoVos.length && i + vo['times'] < vo['maxTimes']; ++i) {
                      let bo = vo.productInfoVos[i]
                      await collectScore(vo['taskId'], bo['itemId'])
                      await $.wait(2000)
                    }
                  }
                }
              }
              // $.userInfo = data.data.result.userInfo;
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getHomeData(info = false) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('nian_getHomeData', {}, 'nian_getHomeData'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data.data['bizCode'] === 0) {
            $.userInfo = data.data.result.homeMainInfo
            $.secretp = $.userInfo.secretp;
            if (!$.secretp) {
              console.log(`账号被风控`)
              message += `账号被风控，无法参与活动\n`
              $.secretp = null
              return
            }
            if ($.userInfo.raiseInfo.fullFlag) {
              console.log(`当前等级已满，不再做日常任务！\n`)
              $.full = true
              return
            }
            console.log(`\n\n当前等级:${$.userInfo.raiseInfo.scoreLevel}\n当前爆竹${$.userInfo.raiseInfo.remainScore}🧨，下一关需要${$.userInfo.raiseInfo.nextLevelScore - $.userInfo.raiseInfo.curLevelStartScore}🧨\n\n`)

            if (info) {
              message += `当前爆竹${$.userInfo.raiseInfo.remainScore}🧨\n`
              return
            }
            if ($.userInfo.raiseInfo.produceScore > 0) {
              console.log(`可收取的爆竹大于0，去收取爆竹`)
              await collectProduceScore()
            }
            if (parseInt($.userInfo.raiseInfo.remainScore) >= parseInt($.userInfo.raiseInfo.nextLevelScore - $.userInfo.raiseInfo.curLevelStartScore)) {
              console.log(`当前爆竹🧨大于升级所需爆竹🧨，去升级`)
              await $.wait(2000)
              await raise()
            }
          } else {
            $.secretp = null
            console.log(`账号被风控，无法参与活动`)
            message += `账号被风控，无法参与活动\n`
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function collectProduceScore(taskId = "collectProducedCoin") {
  let temp = {
    "taskId": taskId,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  const body = encode(temp, $.secretp, extraData);
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_collectProduceScore", body, "nian_collectProduceScore"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              console.log(`收取成功，获得${data.data.result.produceScore}爆竹🧨`)
              // $.userInfo = data.data.result.userInfo;
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function collectScore(taskId, itemId, actionType = null, inviteId = null, shopSign = null) {
  let temp = {
    "taskId": taskId,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  if (itemId) temp['itemId'] = itemId
  if (actionType) temp['actionType'] = actionType
  if (inviteId) temp['inviteId'] = inviteId
  if (shopSign) temp['shopSign'] = shopSign
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = {
    ...encode(temp, $.secretp, extraData),
    taskId: taskId,
    itemId: itemId
  }
  if (actionType) body['actionType'] = actionType
  if (inviteId) body['inviteId'] = inviteId
  if (shopSign) body['shopSign'] = shopSign
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_collectScore", body, "nian_collectScore"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0) {
              if (data.data && data.data.bizCode === 0) {
                if (data.data.result.score)
                  console.log(`任务完成，获得${data.data.result.score}爆竹🧨`)
                else if (data.data.result.maxAssistTimes) {
                  console.log(`助力好友成功`)
                } else {
                  console.log(`任务上报成功`)
                  await $.wait(10 * 1000)
                  if (data.data.result.taskToken) {
                    await doTask2(data.data.result.taskToken)
                  }
                }
                // $.userInfo = data.data.result.userInfo;
              } else {
                console.log(data.data.bizMsg)
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function pkCollectScore(taskId, itemId, actionType = null, inviteId = null, shopSign = null) {
  let temp = {
    "taskId": taskId,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  if (itemId) temp['itemId'] = itemId
  if (actionType) temp['actionType'] = actionType
  if (inviteId) temp['inviteId'] = inviteId
  if (shopSign) temp['shopSign'] = shopSign
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = {
    ...encode(temp, $.secretp, extraData),
    taskId: taskId,
    itemId: itemId
  }
  if (actionType) body['actionType'] = actionType
  if (inviteId) body['inviteId'] = inviteId
  if (shopSign) body['shopSign'] = shopSign
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_collectScore", body, "nian_pk_collectScore"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0) {
              if (data.data && data.data.bizCode === 0) {
                if (data.data.result.score)
                  console.log(`任务完成，获得${data.data.result.score}积分`)
                else if (data.data.result.maxAssistTimes) {
                  console.log(`助力好友成功`)
                } else {
                  console.log(`任务上报成功`)
                  await $.wait(10 * 1000)
                  if (data.data.result.taskToken) {
                    await doTask2(data.data.result.taskToken)
                  }
                }
                // $.userInfo = data.data.result.userInfo;
              } else {
                console.log(data.data.bizMsg)
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function doTask2(taskToken) {
  let body = {
    "dataSource": "newshortAward",
    "method": "getTaskAward",
    "reqParams": `{\"taskToken\":\"${taskToken}\"}`
  }
  return new Promise(resolve => {
    $.post(taskPostUrl("qryViewkitCallbackResult", body,), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // console.log(data)
            if (data.code === "0") {
              console.log(data.toast.subTitle + '🧨')
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function raise(taskId = "nian_raise") {
  let temp = {
    "taskId": taskId,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  const body = encode(temp, $.secretp, extraData);
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_raise", body, "nian_raise"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              console.log(`升级成功`)
              // $.userInfo = data.data.result.userInfo;
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getTaskList(body = {}) {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_getTaskDetail", body, "nian_getTaskDetail"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              if (JSON.stringify(body) === "{}") {
                $.taskVos = data.data.result.taskVos;//任务列表
                console.log(`\n\n您的好友助力码为${data.data.result.inviteId}\n\n`)
              }
              // $.userInfo = data.data.result.userInfo;
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getFriendData(inviteId) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('nian_getHomeData', {"inviteId": inviteId}), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.data && data.data['bizCode'] === 0) {
            $.itemId = data.data.result.homeMainInfo.guestInfo.itemId
            await collectScore('2', $.itemId, null, inviteId)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function map() {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_myMap", {}, "nian_myMap"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              let msg = '当前已开启的地图：'
              for (let vo of data.data.result.monsterInfoList) {
                if (vo.curLevel) msg += vo.name + ' '
              }
              console.log(msg)
              // $.userInfo = data.data.result.userInfo;
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function queryMaterials() {
  let body = {
    "qryParam": "[{\"type\":\"advertGroup\",\"mapTo\":\"viewLogo\",\"id\":\"05149412\"},{\"type\":\"advertGroup\",\"mapTo\":\"bottomLogo\",\"id\":\"05149413\"}]",
    "activityId": "2cKMj86srRdhgWcKonfExzK4ZMBy",
    "pageId": "",
    "reqSrc": "",
    "applyKey": "21beast"
  }
  return new Promise(resolve => {
    $.post(taskPostUrl("qryCompositeMaterials", body, "qryCompositeMaterials"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === '0') {
              let shopList = data.data.viewLogo.list.concat(data.data.bottomLogo.list)
              let nameList = []
              for (let vo of shopList) {
                if (nameList.includes(vo.name)) continue
                nameList.push(vo.name)
                console.log(`去做${vo.name}店铺任务`)
                await shopLotteryInfo(vo.desc)
                await $.wait(2000)
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function shopLotteryInfo(shopSign) {
  let body = {"shopSign": shopSign}
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_shopLotteryInfo", body, "nian_shopLotteryInfo"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0) {
              for (let vo of data.data.result.taskVos) {
                if (vo.status === 1) {
                  if (vo.taskType === 12) {
                    console.log(`去做${vo.taskName}任务`)
                    await $.wait(2000)
                    await collectScore(vo.taskId, vo.simpleRecordInfoVo.itemId, null, null, shopSign)
                  } else if (vo.taskType === 3 || vo.taskType === 26) {
                    if (vo.shoppingActivityVos) {
                      if (vo.status === 1) {
                        console.log(`准备做此任务：${vo.taskName}`)
                        for (let task of vo.shoppingActivityVos) {
                          if (task.status === 1) {
                            await $.wait(2000)
                            await collectScore(vo.taskId, task.advId, null, null, shopSign);
                          }
                        }
                      } else if (vo.status === 2) {
                        console.log(`${vo.taskName}已做完`)
                      }
                    }
                  }else if (vo.taskType === 21) {
                    if (vo.brandMemberVos) {
                      if (vo.status === 1) {
                        console.log(`准备做此任务：${vo.taskName}`)
                        for (let task of vo.brandMemberVos) {
                          if (task.status === 1) {
                            await $.wait(2000)
                            await collectScore(vo.taskId, task.advertId, null, null, shopSign);
                          }
                        }
                      } else if (vo.status === 2) {
                        console.log(`${vo.taskName}已做完`)
                      }
                    }
                  }
                }
              }
              for (let i = 0; i < data.data.result.lotteryNum; ++i) {
                console.log(`去抽奖：${i + 1}/${data.data.result.lotteryNum}`)
                await $.wait(2000)
                await doShopLottery(shopSign)
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function doShopLottery(shopSign) {
  let body = {"shopSign": shopSign}
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_doShopLottery", body, "nian_doShopLottery"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0 && data.data && data.data.result) {
              let result = data.data.result
              if (result.awardType === 4)
                console.log(`抽奖成功，获得${result.score}爆竹🧨`)
              else if (result.awardType === 2 || result.awardType === 3)
                console.log(`抽奖成功，获得优惠卷`)
              else if (result.awardType === 5)
                console.log(`抽奖成功，品牌卡`)
              else
                console.log(`抽奖成功，获得${JSON.stringify(result)}`)
            } else {
              console.log(`抽奖失败`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function pkInfo() {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_getHomeData", {}, "nian_pk_getHomeData"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.group = true
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0 && data.data && data.data.bizCode === 0) {
              console.log(`\n\n您的好友PK助力码为${data.data.result.groupInfo.groupAssistInviteId}\n注：此pk邀请码每天都变！\n\n`)
              let info = data.data.result.groupPkInfo
              console.log(`预计分得:${data.data.result.groupInfo.personalAward}红包`)
              if (info.dayAward)
                console.log(`白天关卡：${info.dayAward}元红包，完成进度 ${info.dayTotalValue}/${info.dayTargetSell}`)
              else {
                function secondToDate(result) {
                  var h = Math.floor(result / 3600);
                  var m = Math.floor((result / 60 % 60));
                  var s = Math.floor((result % 60));
                  return h + "小时" + m + "分钟" + s + "秒";
                }

                console.log(`守护关卡：${info.guardAward}元红包，剩余守护时间：${secondToDate(info.guardTime / 5)}`)
              }
            } else {
              $.group = false
              console.log(`获取组队信息失败，请检查`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function pkTaskStealDetail() {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_getStealForms", {}, "nian_pk_getStealForms"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0 && data.data && data.data.bizCode === 0) {
              $.hasGroup = true
              await $.wait(2000)
              for (let i = 1; i < data.data.result.stealGroups.length; ++i) {
                let item = data.data.result.stealGroups[i]
                if (item.stolen === 0) {
                  console.log(`去偷${item.name}的红包`)
                  await pkStealGroup(item.id)
                  await $.wait(2000)
                }
              }
            } else {
              console.log(`组队尚未开启，请先去开启组队或是加入队伍！`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function pkTaskDetail() {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_getTaskDetail", {}, "nian_pk_getTaskDetail"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0 && data.data && data.data.bizCode === 0) {
              await $.wait(2000)
              $.hasGroup = true
              for (let item of data.data.result.taskVos) {
                if (item.taskType === 3 || item.taskType === 26) {
                  if (item.shoppingActivityVos) {
                    if (item.status === 1) {
                      console.log(`准备做此任务：${item.taskName}`)
                      for (let task of item.shoppingActivityVos) {
                        if (task.status === 1) {
                          await pkCollectScore(item.taskId, task.itemId);
                        }
                        await $.wait(3000)
                      }
                    } else if (item.status === 2) {
                      console.log(`${item.taskName}已做完`)
                    }
                  }
                }
              }
            } else {
              console.log(`组队尚未开启，请先去开启组队或是加入队伍！`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function pkAssignGroup(inviteId) {
  let temp = {
    "confirmFlag": 1,
    "inviteId": inviteId,
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = {
    ...encode(temp, $.secretp, extraData),
    inviteId: inviteId
  }
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_assistGroup", body, "nian_pk_assistGroup"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.bizMsg) {
              console.log(data.data.bizMsg)
            } else {
              console.log(`助力失败，未知错误:${JSON.stringify(data)}`)
              $.canhelp = false
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function pkStealGroup(stealId) {
  let temp = {
    "stealId": stealId,
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = {
    ...encode(temp, $.secretp, extraData),
    stealId: stealId
  }
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_doSteal", body, "nian_pk_doSteal"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.bizMsg) {
              console.log(data.data.bizMsg)
            } else {
              console.log(`偷取失败，未知错误:${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function killCouponList() {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_killCouponList", {}, "nian_killCouponList"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.bizCode === 0) {
              await $.wait(2000)
              for (let vo of data.data.result) {
                if (!vo.status) {
                  console.log(`去领取${vo['productName']}优惠券`)
                  await killCoupon(vo['skuId'])
                  await $.wait(2000)
                }
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function killCoupon(skuId) {
  let temp = {
    "skuId": skuId,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = encode(temp, $.secretp, extraData);
  body['skuId'] = skuId
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_killCoupon", body, "nian_killCoupon"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.bizCode === 0) {
              console.log(`领取成功，获得${data.data.result.score}爆竹🧨`)
            } else {
              console.log(data.data.bizMsg)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getSpecialGiftDetail() {
  return new Promise((resolve) => {
    $.post(taskPostUrl('nian_getSpecialGiftDetail'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data.data['bizCode'] === 0) {
            let flag = true
            for(let item of data.data.result.taskVos){
              if (item.taskType === 3 || item.taskType === 26) {
                if (item.shoppingActivityVos) {
                  if (item.status === 1) {
                    flag = false
                    console.log(`准备做此任务：${item.taskName}`)
                    for (let task of item.shoppingActivityVos) {
                      if (task.status === 1) {
                        await collectSpecialScore(item.taskId, task.itemId);
                      }
                      await $.wait(3000)
                    }
                  } else if (item.status === 2) {
                    console.log(`${item.taskName}已做完`)
                  }
                }
              }
              else if (item.taskType === 0) {
                if (item.status === 1) {
                  flag = false
                  console.log(`准备做此任务：${item.taskName}`)
                  await collectSpecialScore(item.taskId, item.simpleRecordInfoVo.itemId);
                } else if (item.status === 2) {
                  console.log(`${item.taskName}已做完`)
                }
              } else{
                if (item.status === 1) {
                  flag = false
                  superAssist.push({
                    "inviteId": data.data.result.inviteId,
                    "itemId": item.assistTaskDetailVo.itemId,
                    "taskId": item.taskId
                  })
                } else if (item.status === 2) {
                  console.log(`${item.taskName}已做完`)
                }
              }
            }
            if(flag){
              await getSpecialGiftInfo()
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getSpecialGiftInfo() {
  return new Promise((resolve) => {
    $.post(taskPostUrl('nian_getSpecialGiftInfo',"nian_getSpecialGiftInfo"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data.data['bizCode'] === 0) {
            await collectSpecialFinalScore()
            // console.log(`领奖成功，获得${data.data.result.score}爆竹🧨`)
          }else{
            console.log(data.data.bizMsg)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function collectSpecialScore(taskId, itemId, actionType = null, inviteId = null, shopSign = null) {
  let temp = {
    "taskId": taskId,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  if (itemId) temp['itemId'] = itemId
  if (actionType) temp['actionType'] = actionType
  if (inviteId) temp['inviteId'] = inviteId
  if (shopSign) temp['shopSign'] = shopSign
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = {
    ...encode(temp, $.secretp, extraData),
    taskId: taskId,
    itemId: itemId
  }
  if (actionType) body['actionType'] = actionType
  if (inviteId) body['inviteId'] = inviteId
  if (shopSign) body['shopSign'] = shopSign
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_collectSpecialGift", body, "nian_collectSpecialGift"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0) {
              if (data.data && data.data.bizCode === 0) {
                if (data.data.result.score)
                  console.log(`任务完成，获得${data.data.result.score}爆竹🧨`)
                else if (data.data.result.maxAssistTimes) {
                  console.log(`助力好友成功`)
                } else {
                  console.log(`任务上报成功`)
                }
                // $.userInfo = data.data.result.userInfo;
              } else {
                console.log(data.data.bizMsg)
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function collectSpecialFinalScore() {
  let temp = {
    "ic": 1,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = {
    ...encode(temp, $.secretp, extraData),
    "ic" : 1,
  }
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_collectSpecialGift", body, "nian_collectSpecialGift"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0) {
              if (data.data && data.data.bizCode === 0) {
                if (data.data.result && data.data.result.collectInfo && data.data.result.collectInfo.score)
                  console.log(`任务完成，获得${data.data.result.collectInfo.score}爆竹🧨`)
                else
                  console.log(JSON.stringify(data))
                // $.userInfo = data.data.result.userInfo;
              } else {
                console.log(data.data.bizMsg)
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function nian_doAdditionalTask() {
  let rnd = getRnd();
  let nonstr = randomWord(false,10)
  let time = Date.now()
  let key = minusByByte(nonstr.slice(0,5),String(time).slice(-5))
  let msg = `random=${rnd}&token=3d1da4a6ef43b859927ccce65c5dc4ca&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=true`
  let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase()
  const body = `{"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"1\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"3d1da4a6ef43b859927ccce65c5dc4ca\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"call_stack\\":\\"\\",\\"session_c\\":\\"\\",\\"buttonid\\":\\"homePopupHelpButtonId\\",\\"sceneid\\":\\"mainTaskh5\\"},\\"secretp\\":\\"${$.secretp}\\",\\"random\\":\\"${rnd}\\"}","inviteId":"cAxZdTXtIumO4w2cDgSqvQlsxPG5DFN5kS8cW5GjwAHNrEWgnhuGYvcChsg"}`
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_doAdditionalTask", JSON.parse(body), "nian_doAdditionalTask"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0) {
              if (data.data && data.data.bizCode === 0) {
                if (data.data.result && data.data.result.collectInfo && data.data.result.collectInfo.score)
                  console.log(`任务完成，获得${data.data.result.collectInfo.score}爆竹🧨`)
                else
                  console.log(JSON.stringify(data))
                // $.userInfo = data.data.result.userInfo;
              } else {
                console.log(data.data.bizMsg)
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({
      url: `https://code.chiang.fun/api/v1/jd/jdnian/read/${randomCount}/`,
      'timeout': 10000
    }, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
    resolve()
  })
}

function readShareCodePk() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({
      url: `http://jd.turinglabs.net/api/v2/jd/nian/read/${randomCount}/`,
      'timeout': 10000
    }, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取${randomCount}个PK助力码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
    resolve()
  })
}

//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}

function shareCodesFormatPk() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodesPk = [];
    if ($.shareCodesPkArr[$.index - 1]) {
      $.newShareCodesPk = $.shareCodesPkArr[$.index - 1].split('@');
    } else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > pkInviteCodes.length ? (pkInviteCodes.length - 1) : ($.index - 1);
      $.newShareCodesPk = pkInviteCodes[tempIndex].split('@');
    }
    let readShareCodeRes = null
    if (new Date().getUTCHours() >= 12)
      readShareCodeRes = await readShareCodePk();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodesPk = [...new Set([...$.newShareCodesPk, ...(readShareCodeRes.data || [])])];
    }
    console.log(`第${$.index}个京东账号将要助力的PK好友${JSON.stringify($.newShareCodesPk)}`)
    resolve();
  })
}

function requireConfig() {
  return new Promise(resolve => {
    console.log(`开始获取${$.name}配置文件\n`);
    //Node.js用户请在jdCookie.js处填写京东ck;
    let shareCodes = []
    console.log(`共${cookiesArr.length}个京东账号\n`);
    if ($.isNode() && process.env.JDNIAN_SHARECODES) {
      if (process.env.JDNIAN_SHARECODES.indexOf('\n') > -1) {
        shareCodes = process.env.JDNIAN_SHARECODES.split('\n');
      } else {
        shareCodes = process.env.JDNIAN_SHARECODES.split('&');
      }
    }
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    let shareCodesPK = []
    console.log(`共${cookiesArr.length}个京东账号\n`);
    if ($.isNode() && process.env.JDNIANPK_SHARECODES) {
      if (process.env.JDNIANPK_SHARECODES.indexOf('\n') > -1) {
        shareCodesPK = process.env.JDNIANPK_SHARECODES.split('\n');
      } else {
        shareCodesPK = process.env.JDNIANPK_SHARECODES.split('&');
      }
    }
    $.shareCodesPkArr = [];
    if ($.isNode()) {
      Object.keys(shareCodesPK).forEach((item) => {
        if (shareCodesPK[item]) {
          $.shareCodesPkArr.push(shareCodesPK[item])
        }
      })
    }
    console.log(`您提供了${$.shareCodesPkArr.length}个账号的${$.name}PK助力码\n`);
    resolve()
  })
}

function taskPostUrl(function_id, body = {}, function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  return {
    url,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&uuid=88732f840b77821b345bf07fd71f609e6ff12f43`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('../USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
    }
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('../USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

function randomWord(randomFlag, min, max){
  let str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // 随机产生
  if(randomFlag){
    range = Math.round(Math.random() * (max-min)) + min;
  }
  for(let i=0; i<range; i++){
    pos = Math.round(Math.random() * (arr.length-1));
    str += arr[pos];
  }
  return str;
}

function minusByByte(t, n) {
  var e = t.length
      , r = n.length
      , o = Math.max(e, r)
      , i = toAscii(t)
      , a = toAscii(n)
      , s = ""
      , u = 0;
  for (e !== r && (i = add0(i, o),
      a = this.add0(a, o)); u < o; )
    s += Math.abs(i[u] - a[u]),
        u++;
  return s
}

function toAscii (t) {
  var n = "";
  for (var e in t) {
    var r = t[e]
        , o = /[a-zA-Z]/.test(r);
    if (t.hasOwnProperty(e))
      if (o)
        n += getLastAscii(r);
      else
        n += r
  }
  return n
}
function add0 (t, n) {
  return (Array(n).join("0") + t).slice(-n)
}

function getLastAscii(t) {
  var n = t.charCodeAt(0).toString();
  return n[n.length - 1]
}

function wordsToBytes(t) {
  for (var n = [], e = 0; e < 32 * t.length; e += 8)
    n.push(t[e >>> 5] >>> 24 - e % 32 & 255);
  return n
}

function bytesToHex(t) {
  for (var n = [], e = 0; e < t.length; e++)
    n.push((t[e] >>> 4).toString(16)),
        n.push((15 & t[e]).toString(16));
  return n.join("")
}

function stringToBytes(t) {
  t = unescape(encodeURIComponent(t))
  for (var n = [], e = 0; e < t.length; e++)
    n.push(255 & t.charCodeAt(e));
  return n
}

function bytesToWords(t) {
  for (var n = [], e = 0, r = 0; e < t.length; e++,
      r += 8)
    n[r >>> 5] |= t[e] << 24 - r % 32;
  return n
}
function getSign (t) {
  t = stringToBytes(t)
  var e = bytesToWords(t)
      , i = 8 * t.length
      , a = []
      , s = 1732584193
      , u = -271733879
      , c = -1732584194
      , f = 271733878
      , h = -1009589776;
  e[i >> 5] |= 128 << 24 - i % 32,
      e[15 + (i + 64 >>> 9 << 4)] = i;
  for (var l = 0; l < e.length; l += 16) {
    for (var p = s, g = u, v = c, d = f, y = h, m = 0; m < 80; m++) {
      if (m < 16)
        a[m] = e[l + m];
      else {
        var w = a[m - 3] ^ a[m - 8] ^ a[m - 14] ^ a[m - 16];
        a[m] = w << 1 | w >>> 31
      }
      var _ = (s << 5 | s >>> 27) + h + (a[m] >>> 0) + (m < 20 ? 1518500249 + (u & c | ~u & f) : m < 40 ? 1859775393 + (u ^ c ^ f) : m < 60 ? (u & c | u & f | c & f) - 1894007588 : (u ^ c ^ f) - 899497514);
      h = f,
          f = c,
          c = u << 30 | u >>> 2,
          u = s,
          s = _
    }
    s += p,
        u += g,
        c += v,
        f += d,
        h += y
  }
  return [s, u, c, f, h]
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
