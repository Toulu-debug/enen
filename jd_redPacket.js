/*
京东全民开红包
Last Modified time: 2021-05-19 16:27:18
活动入口：京东APP首页-领券-锦鲤红包。[活动地址](https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html)
未实现功能：领3张券功能

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
================QuantumultX==================
[task_local]
#京东全民开红包
1 0,2,18 * * * https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_redPacket.js, tag=京东全民开红包, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jd_redPacket.png, enabled=true
===================Loon==============
[Script]
cron "1 0,2,18 * * *" script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_redPacket.js, tag=京东全民开红包
===============Surge===============
[Script]
京东全民开红包 = type=cron,cronexp="1 0,2,18 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_redPacket.js
====================================小火箭=============================
京东全民开红包 = type=cron,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_redPacket.js, cronexpr="1 0,2,18 * * *", timeout=3600, enable=true
 */

const tunnel = require("tunnel");
const $ = new Env('京东全民开红包');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
let isLoginInfo = {}
$.redPacketId = [];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
  if (JSON.stringify(process.env).indexOf('GITHUB') > -1) process.exit(0);
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/api';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  let res = []
  $.authorMyShareIds = [...(res || [])];
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      isLoginInfo[$.UserName] = $.isLogin
      console.log(`\n****开始【京东账号${$.index}】${$.nickName || $.UserName}****\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      $.discount = 0;
      await redPacket();
      await showMsg();
    }
    await $.wait(2000)
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.index = i + 1;
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    $.canHelp = true;
    $.redPacketId = [...new Set($.redPacketId)];
    if (!isLoginInfo[$.UserName]) continue
    if (cookiesArr && cookiesArr.length >= 2) {
      if (i === 0) {
        console.log('账号1 给助力池助力')
        let codes = await getShareCodes();
        console.log('从助力池随机获取30个:', codes)
        for (let j = 0; j < codes.length && $.canHelp; j++) {
          console.log(`账号 ${$.index} ${$.UserName} 开始给 ${codes[j]} 进行助力`)
          await jinli_h5assist(codes[j]);
          await $.wait(2000)
        }
      } else {
        console.log(`\n\n自己账号内部互助`);
        for (let j = 0; j < $.redPacketId.length && $.canHelp; j++) {
          console.log(`账号 ${$.index} ${$.UserName} 开始给 ${$.redPacketId[j]} 进行助力`)
          $.max = false;
          await jinli_h5assist($.redPacketId[j]);
          await $.wait(2000)
          if ($.max) {
            $.redPacketId.splice(j, 1)
            j--
            continue
          }
        }
      }
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function redPacket() {
  try {
    await doLuckDrawFun();//券后9.9抽奖
    await taskHomePage();//查询任务列表
    await doTask();//领取任务，做任务，领取红包奖励
    await h5activityIndex();//查询红包基础信息
    await red();//红包任务(发起助力红包,领取助力红包等)
    await h5activityIndex();
  } catch (e) {
    $.logErr(e);
  }
}

function showMsg() {
  console.log(`\n\n${$.name}获得红包：${$.discount}元\n\n`);
}

async function doLuckDrawFun() {
  for (let i = 0; i < 3; i++) {
    await doLuckDrawEntrance();
  }
}

function doLuckDrawEntrance() {
  return new Promise(resolve => {
    const options = {
      url: 'https://api.m.jd.com/client.action?functionId=doLuckDrawEntrance&body=%7B%22platformType%22%3A%221%22%7D&appid=XPMSGC2019&client=m&clientVersion=1.0.0&area=19_1601_50258_62858&geo=%5Bobject%20Object%5D&uuid=88732f840b77821b345bf07fd71f609e6ff12f43',
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://h5.m.jd.com",
        "Cookie": cookie,
        "Content-Length": "0",
        "Connection": "keep-alive",
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "jdapp;iPhone;9.5.4;14.3;88732f840b77821b345bf07fd71f609e6ff12f43;network/4g;model/iPhone11,8;addressid/2005183373;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        "Accept-Language": "zh-cn",
        "Referer": "https://h5.m.jd.com/babelDiy/Zeus/yj8mbcm6roENn7qhNdhiekyeqtd/index.html",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.code === '0' && data.busiCode === '0') {
              if (data.result.luckyDrawData.actId) {
                if (data.result.luckyDrawData.redPacketId) {
                  console.log(`券后9.9抽奖获得【红包】：${data.result.luckyDrawData.quota}元`);
                } else {
                  console.log(`券后9.9抽奖获得【优惠券】：${data.result.luckyDrawData.discount}元：${data.result.luckyDrawData.prizeName}，${data.result.luckyDrawData.quotaDesc}`);
                }
              } else {
                console.log(`券后9.9抽奖获失败：今日3次抽奖机会已用完\n`)
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

async function doTask() {
  if ($.taskHomePageData && $.taskHomePageData.code === 0) {
    $.taskInfo = $.taskHomePageData.data.result.taskInfos;
    if ($.taskInfo && $.taskInfo.length > 0) {
      console.log(`    任务     状态  红包是否领取`);
      for (let item of $.taskInfo) {
        console.log(`${item.title.slice(-6)}   ${item.alreadyReceivedCount ? item.alreadyReceivedCount : 0}/${item.requireCount}      ${item.innerStatus === 4 ? '是' : '否'}`)
      }
      for (let item of $.taskInfo) {
        //innerStatus=4已领取红包，3：任务已完成，红包未领取，2：任务已领取，但未完成，7,未领取任务
        if (item.innerStatus === 4) {
          console.log(`[${item.title}] 已经领取奖励`)
        } else if (item.innerStatus === 3) {
          await receiveTaskRedpacket(item.taskType);
        } else if (item.innerStatus === 2) {
          if (item.taskType !== 0 && item.taskType !== 1) {
            console.log(`开始做【${item.title}】任务`);
            await active(item.taskType);
            console.log(`开始领取【${item.title}】任务所得红包奖励`);
            await receiveTaskRedpacket(item.taskType);
          } else if (item.taskType === 1) {
            //浏览10秒任务
            console.log(`开始做【${item.title}】任务`);
            await doAppTask();
          } else {
            //TODO 领3张优惠券
            console.log(`[${item.title}] 功能未开发`)
          }
        } else if (item.innerStatus !== 4) {
          console.log(`\n开始领取【${item.title}】任务`);
          await startTask(item.taskType);
          if (item.taskType !== 0 && item.taskType !== 1) {
            console.log(`开始做【${item.title}】任务`);
            await active(item.taskType);
            console.log(`开始领取【${item.title}】任务所得红包奖励`);
            await receiveTaskRedpacket(item.taskType);
          } else if (item.taskType === 1) {
            //浏览10秒任务
            console.log(`开始做【${item.title}】任务`);
            await doAppTask();
          } else {
            //TODO 领3张优惠券
            console.log(`[${item.title}] 功能未开发`)
          }
        }
      }
    }
  } else {
    console.log(`\n获取任务列表异常：${JSON.stringify($.taskHomePageData)}\n`)
  }
}

async function red() {
  $.hasSendNumber = 0;
  $.assistants = 0;
  $.waitOpenTimes = 0;
  if ($.h5activityIndex && $.h5activityIndex.data && $.h5activityIndex.data.result) {
    const rewards = $.h5activityIndex.data.result.rewards || [];
    $.hasSendNumber = $.h5activityIndex.data.result.hasSendNumber;
    if ($.h5activityIndex.data.result.redpacketConfigFillRewardInfo) {
      for (let key of Object.keys($.h5activityIndex.data.result.redpacketConfigFillRewardInfo)) {
        let vo = $.h5activityIndex.data.result.redpacketConfigFillRewardInfo[key]
        $.assistants += vo.hasAssistNum
        if (vo.packetStatus === 1) {
          $.waitOpenTimes += 1
        }
      }
    }
  }
  if ($.h5activityIndex && $.h5activityIndex.data && $.h5activityIndex.data.biz_code === 10002) {
    //可发起拆红包活动
    await h5launch();
  } else if ($.h5activityIndex && $.h5activityIndex.data && ($.h5activityIndex.data.biz_code === 20001)) {
    //20001:红包活动正在进行，可拆
    const redPacketId = $.h5activityIndex.data.result.redpacketInfo.id;
    if (redPacketId) {
      $.redPacketId.push(redPacketId)
      await makeShareCodes(redPacketId)
    }
    console.log(`\n\n当前待拆红包ID:${$.h5activityIndex.data.result.redpacketInfo.id}，进度：再邀${$.h5activityIndex.data.result.redpacketConfigFillRewardInfo[$.hasSendNumber].requireAssistNum - $.h5activityIndex.data.result.redpacketConfigFillRewardInfo[$.hasSendNumber].hasAssistNum}个好友，开第${$.hasSendNumber + 1}个红包。当前已拆红包：${$.hasSendNumber}个，剩余${$.h5activityIndex.data.result.remainRedpacketNumber}个红包待开，已有${$.assistants}好友助力\n\n`)
    console.log(`当前可拆红包个数：${$.waitOpenTimes}`)
    if ($.waitOpenTimes > 0) {
      for (let i = 0; i < $.waitOpenTimes; i++) {
        await h5receiveRedpacketAll();
        await $.wait(500);
      }
    }
  } else if ($.h5activityIndex && $.h5activityIndex.data && $.h5activityIndex.data.biz_code === 20002) {
    console.log(`\n${$.h5activityIndex.data.biz_msg}\n`);
  }
}

function makeShareCodes(redPacketId) {
  return new Promise(resolve => {
    let pin = cookie.match(/pt_pin=([^;]*)/)[1]
    pin = $.md5(pin)
    try {
      $.get({
        url: `${$.isNode() ? require('./USER_AGENTS').hwApi : 'https://api.jdsharecode.xyz/api/'}autoInsert/redPacket?sharecode=${redPacketId}&pin=${pin}`,
        timeout: 10000
      }, (err, resp, data) => {
        data = $.toObj(data)
        if (data.code === 200)
          console.log('已自动提交助力码')
      })
    } catch (e) {
    } finally {
      resolve()
    }
  })
}

function getShareCodes() {
  return new Promise(resolve => {
    try {
      $.get({
        url: `${$.isNode() ? require('./USER_AGENTS').hwApi : 'https://api.jdsharecode.xyz/api/'}redPacket/30`,
        timeout: 10000
      }, (err, resp, data) => {
        if (!err) {
          data = $.toObj(data)
          resolve(data.data)
        } else {
          resolve([])
        }
      })
    } catch (e) {
      resolve([])
    }
  })
}


//获取任务列表API
function taskHomePage() {
  return new Promise((resolve) => {
    $.post(taskUrl(arguments.callee.name.toString(), {"clientInfo": {}}), (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          console.log(JSON.stringify(err));
        } else {
          $.taskHomePageData = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//领取任务API,需token
function startTask(taskType) {
  // 从taskHomePage返回的数据里面拿taskType
  let data = {taskType};
  data['token'] = $.md5($.md5("j" + JSON.stringify(data) + "D"))
  return new Promise((resolve) => {
    $.post(taskUrl(arguments.callee.name.toString(), data), (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          console.log(JSON.stringify(err));
        } else {
          console.log(`领取任务：${data}`)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//做任务fun
async function active(taskType) {
  const getTaskDetailForColorRes = await getTaskDetailForColor(taskType);
  if (getTaskDetailForColorRes && getTaskDetailForColorRes.code === 0) {
    if (getTaskDetailForColorRes.data && getTaskDetailForColorRes.data.result) {
      const {advertDetails} = getTaskDetailForColorRes.data.result;
      for (let item of advertDetails) {
        await $.wait(1000);
        if (item.id && item.status === 0) {
          await taskReportForColor(taskType, item.id);
        }
      }
    } else {
      console.log(`任务列表为空,手动进入app内检查 是否存在[从京豆首页进领券中心逛30秒]的任务,如存在,请手动完成再运行脚本`)
      $.msg(`${$.name}`, '', '手动进入app内检查\n是否存在[从京豆首页进领券中心逛30秒]的任务\n如存在,请手动完成再运行脚本');
      if ($.isNode()) await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `执行脚本出现异常\n请手动进入app内检查\n是否存在[从京豆首页进领券中心逛30秒]的任务\n如存在,请手动完成再运行脚本`)
    }
  } else {
    console.log(`---具体任务详情---${JSON.stringify(getTaskDetailForColorRes)}`);
  }
}

//获取具体任务详情API
function getTaskDetailForColor(taskType) {
  const data = {"clientInfo": {}, taskType};
  return new Promise((resolve) => {
    $.post(taskUrl(arguments.callee.name.toString(), data), (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          console.log(JSON.stringify(err));
        } else {
          // console.log('getTaskDetailForColor', data);
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//做成任务API
function taskReportForColor(taskType, detailId) {
  const data = {taskType, detailId};
  data['token'] = $.md5($.md5("j" + JSON.stringify(data) + "D"))
  //console.log(`活动id：：：${detailId}\n`)
  return new Promise((resolve) => {
    $.post(taskUrl(arguments.callee.name.toString(), data), (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          console.log(JSON.stringify(err));
        } else {
          // console.log(`taskReportForColor`, data);
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//领取做完任务后的红包
function receiveTaskRedpacket(taskType) {
  const body = {"clientInfo": {}, taskType};
  return new Promise((resolve) => {
    $.post(taskUrl('h5receiveRedpacketAll', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          if (data.data.success && data.data.biz_code === 0) {
            console.log(`红包领取成功，获得${data.data.result.discount}元\n`)
            $.discount += Number(data.data.result.discount);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//助力API
function jinli_h5assist(redPacketId) {
  //一个人一天只能助力两次，助力码redPacketId 每天都变
  const body = {"clientInfo": {}, redPacketId, "followShop": 0, "promUserState": ""};
  const options = taskUrl(arguments.callee.name.toString(), body)
  return new Promise((resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          if (data && data.data && data.data.biz_code === 0) {
            // status ,0:助力成功，1:不能重复助力，3:助力次数耗尽，8:不能为自己助力
            console.log(`助力结果：${data.data.result.statusDesc}`)
            if (data.data.result.status === 2) $.max = true;
            if (data.data.result.status === 3) $.canHelp = false;
            if (data.data.result.status === 9) $.canHelp = false;
          } else {
            console.log(`助力异常：${JSON.stringify(data)}`);
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

//领取红包API
function h5receiveRedpacketAll() {
  const options = taskUrl(arguments.callee.name.toString(), {"clientInfo": {}})
  return new Promise((resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          if (data && data.data && data.data.biz_code === 0) {
            console.log(`拆红包获得：${data.data.result.discount}元`)
          } else {
            console.log(`领红包失败：${JSON.stringify(data)}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//发起助力红包API
function h5launch() {
  const body = {"clientInfo": {}, "followShop": 0, "promUserState": ""};
  const options = taskUrl(arguments.callee.name.toString(), body)
  return new Promise((resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          if (data && data.data && data.data.biz_code === 0) {
            if (data.data.result.redPacketId) {
              console.log(`\n\n发起助力红包 成功：红包ID ${data.data.result.redPacketId}`)
              $.redPacketId.push(data.data.result.redPacketId);
            } else {
              console.log(`\n\n发起助力红包 失败：${data.data.result.statusDesc}`)
            }
          } else {
            console.log(`发起助力红包 失败：${JSON.stringify(data)}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function h5activityIndex() {
  const body = {"clientInfo": {}, "isjdapp": 1};
  const options = taskUrl(arguments.callee.name.toString(), body);
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`);
          console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          $.h5activityIndex = data;
          $.discount = 0;
          if ($.h5activityIndex && $.h5activityIndex.data && $.h5activityIndex.data.result) {
            const rewards = $.h5activityIndex.data.result.rewards || [];
            for (let item of rewards) {
              $.discount += item.packetSum;
            }
            if ($.discount) $.discount = $.discount.toFixed(2);
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

async function doAppTask(type = '1') {
  let body = {
    "pageClickKey": "CouponCenter",
    "childActivityUrl": "openapp.jdmobile%3a%2f%2fvirtual%3fparams%3d%7b%5c%22category%5c%22%3a%5c%22jump%5c%22%2c%5c%22des%5c%22%3a%5c%22couponCenter%5c%22%7d",
    "lat": "",
    "globalLat": "",
    "lng": "",
    "globalLng": ""
  }
  await getCcTaskList('getCcTaskList', body, type);
  body = {
    "globalLng": "",
    "globalLat": "",
    "monitorSource": "ccgroup_ios_index_task",
    "monitorRefer": "",
    "taskType": "1",
    "childActivityUrl": "openapp.jdmobile%3a%2f%2fvirtual%3fparams%3d%7b%5c%22category%5c%22%3a%5c%22jump%5c%22%2c%5c%22des%5c%22%3a%5c%22couponCenter%5c%22%7d",
    "pageClickKey": "CouponCenter",
    "lat": "",
    "taskId": "727",
    "lng": "",
  }
  await $.wait(10500);
  await getCcTaskList('reportCcTask', body, type);
}

function getCcTaskList(functionId, body, type = '1') {
  let url = '';
  return new Promise(resolve => {
    if (functionId === 'getCcTaskList') {
      url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1617158358007&sign=a15f78e5846f9b0178dcabb1093a6a7f&sv=100`
    } else if (functionId === 'reportCcTask') {
      url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1617158435079&sign=7eff07437dd817dbfa348c209fd5c129&sv=120`
    }
    const options = {
      url,
      body: `body=${escape(JSON.stringify(body))}`,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Length": "63",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "api.m.jd.com",
        "Origin": "https://h5.m.jd.com",
        "Cookie": cookie,
        "Referer": "https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // data = JSON.parse(data);
            if (type === '1' && functionId === 'reportCcTask') console.log(`京东首页点击“领券”逛10s任务:${data}`)
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

function getAuthorShareCode(url) {
  return new Promise(resolve => {
    const options = {
      url: `${url}?${new Date()}`, "timeout": 10000, headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
      const tunnel = require("tunnel");
      const agent = {
        https: tunnel.httpsOverHttp({
          proxy: {
            host: process.env.TG_PROXY_HOST,
            port: process.env.TG_PROXY_PORT * 1
          }
        })
      }
      Object.assign(options, {agent})
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          if (data) data = JSON.parse(data)
        }
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function taskUrl(functionId, body = {}) {
  return {
    url: `${JD_API_HOST}?appid=jinlihongbao&functionId=${functionId}&loginType=2&client=jinlihongbao&clientVersion=10.1.0&osVersion=iOS&d_brand=iPhone&d_model=iPhone&t=${new Date().getTime() * 1000}`,
    body: `body=${escape(JSON.stringify(body))}`,
    headers: {
      "Host": "api.m.jd.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://happy.m.jd.com",
      "Accept-Encoding": "gzip, deflate, br",
      "Cookie": cookie,
      "Connection": "keep-alive",
      "Accept": "*/*",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      "Referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html",
      "Content-Length": "56",
      "Accept-Language": "zh-cn"
    }
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2",
      headers: {
        Host: "wq.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 1001) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === 0 && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            console.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
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

// md5
!function (n) {
  function t(n, t) {
    var r = (65535 & n) + (65535 & t);
    return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
  }

  function r(n, t) {
    return n << t | n >>> 32 - t
  }

  function e(n, e, o, u, c, f) {
    return t(r(t(t(e, n), t(u, f)), c), o)
  }

  function o(n, t, r, o, u, c, f) {
    return e(t & r | ~t & o, n, t, u, c, f)
  }

  function u(n, t, r, o, u, c, f) {
    return e(t & o | r & ~o, n, t, u, c, f)
  }

  function c(n, t, r, o, u, c, f) {
    return e(t ^ r ^ o, n, t, u, c, f)
  }

  function f(n, t, r, o, u, c, f) {
    return e(r ^ (t | ~o), n, t, u, c, f)
  }

  function i(n, r) {
    n[r >> 5] |= 128 << r % 32, n[14 + (r + 64 >>> 9 << 4)] = r;
    var e, i, a, d, h, l = 1732584193, g = -271733879, v = -1732584194, m = 271733878;
    for (e = 0; e < n.length; e += 16) {
      i = l, a = g, d = v, h = m, g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551), l = t(l, i), g = t(g, a), v = t(v, d), m = t(m, h)
    }
    return [l, g, v, m]
  }

  function a(n) {
    var t, r = "", e = 32 * n.length;
    for (t = 0; t < e; t += 8) {
      r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255)
    }
    return r
  }

  function d(n) {
    var t, r = [];
    for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1) {
      r[t] = 0
    }
    var e = 8 * n.length;
    for (t = 0; t < e; t += 8) {
      r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32
    }
    return r
  }

  function h(n) {
    return a(i(d(n), 8 * n.length))
  }

  function l(n, t) {
    var r, e, o = d(n), u = [], c = [];
    for (u[15] = c[15] = void 0, o.length > 16 && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1) {
      u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r]
    }
    return e = i(u.concat(d(t)), 512 + 8 * t.length), a(i(c.concat(e), 640))
  }

  function g(n) {
    var t, r, e = "";
    for (r = 0; r < n.length; r += 1) {
      t = n.charCodeAt(r), e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t)
    }
    return e
  }

  function v(n) {
    return unescape(encodeURIComponent(n))
  }

  function m(n) {
    return h(v(n))
  }

  function p(n) {
    return g(m(n))
  }

  function s(n, t) {
    return l(v(n), v(t))
  }

  function C(n, t) {
    return g(s(n, t))
  }

  function A(n, t, r) {
    return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n)
  }

  $.md5 = A
}(this);

// prettier-ignore
function Env(t, e) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);

  class s {
    constructor(t) {
      this.env = t
    }

    send(t, e = "GET") {
      t = "string" == typeof t ? {url: t} : t;
      let s = this.get;
      return "POST" === e && (s = this.post), new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s)
        })
      })
    }

    get(t) {
      return this.send.call(this.env, t)
    }

    post(t) {
      return this.send.call(this.env, t, "POST")
    }
  }

  return new class {
    constructor(t, e) {
      this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
    }

    isNode() {
      return "undefined" != typeof module && !!module.exports
    }

    isQuanX() {
      return "undefined" != typeof $task
    }

    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon
    }

    isLoon() {
      return "undefined" != typeof $loon
    }

    toObj(t, e = null) {
      try {
        return JSON.parse(t)
      } catch {
        return e
      }
    }

    toStr(t, e = null) {
      try {
        return JSON.stringify(t)
      } catch {
        return e
      }
    }

    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) try {
        s = JSON.parse(this.getdata(t))
      } catch {
      }
      return s
    }

    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e)
      } catch {
        return !1
      }
    }

    getScript(t) {
      return new Promise(e => {
        this.get({url: t}, (t, s, i) => e(i))
      })
    }

    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"), n = {url: `http://${h}/v1/scripting/evaluate`, body: {script_text: t, mock_type: "cron", timeout: r}, headers: {"X-Key": o, Accept: "*/*"}};
        this.post(n, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }

    loaddata() {
      if (!this.isNode()) return {};
      {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
        if (!s && !i) return {};
        {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i))
          } catch (t) {
            return {}
          }
        }
      }
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
      }
    }

    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (r = Object(r)[t], void 0 === r) return s;
      return r
    }

    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
    }

    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
        if (r) try {
          const t = JSON.parse(r);
          e = t ? this.lodash_get(t, i, "") : e
        } catch (t) {
          e = ""
        }
      }
      return e
    }

    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
        }
      } else s = this.setval(t, e);
      return s
    }

    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
    }

    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
    }

    initGotEnv(t) {
      this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
    }

    get(t, e = (() => {
    })) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
        const {statusCode: s, statusCode: i, headers: r, body: o} = t;
        e(null, {status: s, statusCode: i, headers: r, body: o}, o)
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
          }
        } catch (t) {
          this.logErr(t)
        }
      }).then(t => {
        const {statusCode: s, statusCode: i, headers: r, body: o} = t;
        e(null, {status: s, statusCode: i, headers: r, body: o}, o)
      }, t => {
        const {message: s, response: i} = t;
        e(s, i, i && i.body)
      }))
    }

    post(t, e = (() => {
    })) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.post(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
        const {statusCode: s, statusCode: i, headers: r, body: o} = t;
        e(null, {status: s, statusCode: i, headers: r, body: o}, o)
      }, t => e(t)); else if (this.isNode()) {
        this.initGotEnv(t);
        const {url: s, ...i} = t;
        this.got.post(s, i).then(t => {
          const {statusCode: s, statusCode: i, headers: r, body: o} = t;
          e(null, {status: s, statusCode: i, headers: r, body: o}, o)
        }, t => {
          const {message: s, response: i} = t;
          e(s, i, i && i.body)
        })
      }
    }

    time(t, e = null) {
      const s = e ? new Date(e) : new Date;
      let i = {"M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds()};
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
      return t
    }

    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) return t;
        if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {"open-url": t} : this.isSurge() ? {url: t} : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"];
            return {openUrl: e, mediaUrl: s}
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl;
            return {"open-url": e, "media-url": s}
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {url: e}
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
      }
    }

    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
    }

    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
    }

    wait(t) {
      return new Promise(e => setTimeout(e, t))
    }

    done(t = {}) {
      const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
      this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
    }
  }(t, e)
}
