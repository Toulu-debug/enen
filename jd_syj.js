/*
赚京豆脚本，一：做任务 天天领京豆(加速领京豆)、三：赚京豆-瓜分京豆
Last Modified time: 2021-5-21 17:58:02
活动入口：赚京豆(微信小程序)-赚京豆-签到领京豆
更新地址：jd_syj.js
已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
============Quantumultx===============
[task_local]
#赚京豆
10 0,7,23 * * * jd_syj.js, tag=赚京豆, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jd_syj.png, enabled=true

================Loon==============
[Script]
cron "10 0,7,23 * * *" script-path=jd_syj.js, tag=赚京豆

===============Surge=================
赚京豆 = type=cron,cronexp="10 0,7,23 * * *",wake-system=1,timeout=3600,script-path=jd_syj.js

============小火箭=========
赚京豆 = type=cron,script-path=jd_syj.js, cronexpr="10 0,7,23 * * *", timeout=3600, enable=true
 */
const $ = new Env('赚京豆');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const randomCount = $.isNode() ? 20 : 5;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
$.tuanList = [];
$.authorTuanList = [];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
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
  await getAuthorShareCode('');
  await getAuthorShareCode('');
  await getRandomCode();
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
      await main();
    }
  }
  console.log(`\n\n内部互助 【赚京豆(微信小程序)-瓜分京豆】活动(优先内部账号互助(需内部cookie数量大于${$.assistNum || 4}个)，如有剩余助力次数则给作者和随机团助力)\n`)
  for (let i = 0; i < cookiesArr.length; i++) {
    $.canHelp = true
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      if ($.canHelp && (cookiesArr.length > $.assistNum)) {
        if ($.tuanList.length) console.log(`开始账号内部互助 赚京豆-瓜分京豆 活动，优先内部账号互助`)
        for (let j = 0; j < $.tuanList.length; ++j) {
          console.log(`账号 ${$.UserName} 开始给 【${$.tuanList[j]['assistedPinEncrypted']}】助力`)
          await helpFriendTuan($.tuanList[j])
          if(!$.canHelp) break
          await $.wait(200)
        }
      }
      if ($.canHelp) {
        $.authorTuanList = [...$.authorTuanList, ...($.body1 || [])];
        if ($.authorTuanList.length) console.log(`开始账号内部互助 赚京豆-瓜分京豆 活动，如有剩余则给作者和随机团助力`)
        for (let j = 0; j < $.authorTuanList.length; ++j) {
          console.log(`账号 ${$.UserName} 开始给作者和随机团 ${$.authorTuanList[j]['assistedPinEncrypted']}助力`)
          await helpFriendTuan($.authorTuanList[j])
          if(!$.canHelp) break
          await $.wait(200)
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

function showMsg() {
  return new Promise(resolve => {
    if (message) $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}
async function main() {
  try {
    // await userSignIn();//赚京豆-签到领京豆
    await vvipTask();//赚京豆-加速领京豆
    await distributeBeanActivity();//赚京豆-瓜分京豆
    await showMsg();
  } catch (e) {
    $.logErr(e)
  }
}
//================赚京豆-签到领京豆===================
let signFlag = 0;
function userSignIn() {
  return new Promise(resolve => {
    const body = {"activityId":"ccd8067defcd4787871b7f0c96fcbf5c","inviterId":"","channel":"MiniProgram"};
    $.get(taskUrl('userSignIn', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0) {
              signFlag = 0;
              console.log(`${$.name}今日签到成功`);
              if (data.data) {
                let { alreadySignDays, beanTotalNum, todayPrize, eachDayPrize } = data.data;
                message += `【第${alreadySignDays}日签到】成功，获得${todayPrize.beanAmount}京豆 🐶\n`;
                if (alreadySignDays === 7) alreadySignDays = 0;
                message += `【明日签到】可获得${eachDayPrize[alreadySignDays].beanAmount}京豆 🐶\n`;
                message += `【累计获得】${beanTotalNum}京豆 🐶`;
              }
            } else if (data.code === 81) {
              console.log(`【签到】失败，今日已签到`)
              // message += `【签到】失败，今日已签到`;
            } else if (data.code === 6) {
              //此处有时会遇到 服务器繁忙 导致签到失败,故重复三次签到
              $.log(`${$.name}签到失败${signFlag}:${data.msg}`);
              if (signFlag < 3) {
                signFlag ++;
                await userSignIn();
              }
            } else if (data.code === 66) {
              //此处有时会遇到 服务器繁忙 导致签到失败,故重复三次签到
              $.log(`${$.name}签到失败:${data.msg}`);
              message += `【签到】失败，${data.msg}`;
            } else {
              console.log(`异常：${JSON.stringify(data)}`)
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
//================赚京豆-加速领京豆===================
async function vvipTask() {
  try {
    $.vvipFlag = false;
    $.rewardBeanNum = 0;
    await vvipscdp_raffle_auto_send_bean();
    await pg_channel_page_data();
    if (!$.vvipFlag) return
    await vviptask_receive_list();//做任务
    await $.wait(1000)
    await pg_channel_page_data();
  } catch (e) {
    $.logErr(e)
  }
}
function pg_channel_page_data() {
  return new Promise(resolve => {
    const body = {"paramData": {"token": "3b9f3e0d-7a67-4be3-a05f-9b076cb8ed6a"}};
    $.get(taskUrl('pg_channel_page_data', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              if (data['data'] && data['data']['floorInfoList']) {
                const floorInfo = data['data']['floorInfoList'].filter(vo => !!vo && vo['code'] === "SWAT_RED_PACKET_ACT_INFO")[0];
                if (floorInfo.hasOwnProperty('token') && floorInfo['floorData'].hasOwnProperty('userActivityInfo')) {
                  $.token = floorInfo['token'];
                  const { activityExistFlag, redPacketOpenFlag, redPacketRewardTakeFlag, beanAmountTakeMinLimit, currActivityBeanAmount  } = floorInfo['floorData']['userActivityInfo'];
                  if (activityExistFlag) {
                    if (!redPacketOpenFlag) {
                      console.log(`【做任务 天天领京豆】 活动未开启，现在去开启此活动\n`)
                      await openRedPacket($.token);
                    } else {
                      if (currActivityBeanAmount < beanAmountTakeMinLimit) $.vvipFlag = true;
                      if (redPacketRewardTakeFlag) {
                        console.log(`【做任务 天天领京豆】 ${beanAmountTakeMinLimit}京豆已领取`);
                      } else {
                        if (currActivityBeanAmount >= beanAmountTakeMinLimit) {
                          //领取200京豆
                          console.log(`【做任务 天天领京豆】 累计到${beanAmountTakeMinLimit}京豆可领取到京东账户\n【做任务 天天领京豆】当前进度：${currActivityBeanAmount}/${beanAmountTakeMinLimit}`)
                          console.log(`【做任务 天天领京豆】 当前已到领取京豆条件。开始领取京豆\n`);
                          await pg_interact_interface_invoke($.token);
                        } else {
                          console.log(`【做任务 天天领京豆】 累计到${beanAmountTakeMinLimit}京豆可领取到京东账户\n【做任务 天天领京豆】当前进度：${currActivityBeanAmount}/${beanAmountTakeMinLimit}`)
                          console.log(`【做任务 天天领京豆】 当前未达到领取京豆条件。开始做任务\n`);
                          await pg_channel_page_data();
                        }
                      }
                    }
                  } else {
                    console.log(`【做任务 天天领京豆】 活动已下线`)
                  }
                }
              }
            } else {
              console.log(`pg_channel_page_data： ${data.message}`)
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
//抽奖
function vvipscdp_raffle_auto_send_bean() {
  const body = {"channelCode": "swat_system_id"}
  const options = {
    url: `${JD_API_HOST}api?functionId=vvipscdp_raffle_auto_send_bean&body=${escape(JSON.stringify(body))}&appid=lottery_drew&t=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://lottery.m.jd.com/",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              if (data.data && data.data['sendBeanAmount']) {
                console.log(`【做任务 天天领京豆】 送成功：获得${data.data['sendBeanAmount']}京豆`)
                $.rewardBeanNum += data.data['sendBeanAmount'];
              }
            } else {
              console.log("【做任务 天天领京豆】 送京异常：" + data.message)
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
function vviptask_receive_list() {
  $.taskData = [];
  const body = {"channel":"SWAT_RED_PACKET","systemId":"19","withAutoAward":1}
  const options = {
    url: `${JD_API_HOST}?functionId=vviptask_receive_list&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              $.taskData = data['data'].filter(vo => !!vo && vo['taskDataStatus'] !== 3);
              for (let item of $.taskData) {
                console.log(`\n领取 ${item['title']} 任务`)
                await vviptask_receive_getone(item['id']);
                await $.wait(1000);
                console.log(`去完成 ${item['title']} 任务`)
                await vviptask_reach_task(item['id']);
                console.log(`领取 ${item['title']} 任务奖励\n`)
                await vviptask_reward_receive(item['id']);
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
//领取任务
function vviptask_receive_getone(ids) {
  const body = {"channel":"SWAT_RED_PACKET","systemId":"19",ids}
  const options = {
    url: `${JD_API_HOST}?functionId=vviptask_receive_getone&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {

        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
//做任务
function vviptask_reach_task(taskIdEncrypted) {
  const body = {"channel":"SWAT_RED_PACKET","systemId":"19",taskIdEncrypted}
  const options = {
    url: `${JD_API_HOST}?functionId=vviptask_reach_task&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
  return new Promise((resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(`做任务任务:${data}`)
          // if (safeGet(data)) {
          //   data = JSON.parse(data);
          //   if (data['success']) {
          //     $.taskData = data['data'];
          //     for (let item of $.taskData) {
          //
          //     }
          //   }
          // }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
//领取做完任务后的奖励
function vviptask_reward_receive(idEncKey) {
  const body = {"channel":"SWAT_RED_PACKET","systemId":"19",idEncKey}
  const options = {
    url: `${JD_API_HOST}?functionId=vviptask_reward_receive&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
  return new Promise((resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(`做任务任务:${data}`)
          // if (safeGet(data)) {
          //   data = JSON.parse(data);
          //   if (data['success']) {
          //     $.taskData = data['data'];
          //     for (let item of $.taskData) {
          //
          //     }
          //   }
          // }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
//领取200京豆
function pg_interact_interface_invoke(floorToken) {
  const body = {floorToken, "dataSourceCode": "takeReward", "argMap": {}}
  const options = {
    url: `${JD_API_HOST}?functionId=pg_interact_interface_invoke&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
  return new Promise((resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              console.log(`【做任务 天天领京豆】${data['data']['rewardBeanAmount']}京豆领取成功`);
              $.rewardBeanNum += data['data']['rewardBeanAmount'];
              message += `${message ? '\n' : ''}【做任务 天天领京豆】${$.rewardBeanNum}京豆`;
            } else {
              console.log(`【做任务 天天领京豆】${data.message}`);
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
function openRedPacket(floorToken) {
  const body = {floorToken, "dataSourceCode": "openRedPacket", "argMap": {}}
  const options = {
    url: `${JD_API_HOST}?functionId=pg_interact_interface_invoke&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
  return new Promise((resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              console.log(`活动开启成功，初始：${data.data && data.data['activityBeanInitAmount']}京豆`)
              $.vvipFlag = true;
            } else {
              console.log(data.message)
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
//================赚京豆-加速领京豆===========END========
//================赚京豆开团===========
async function distributeBeanActivity() {
  try {
    $.tuan = ''
    $.hasOpen = false;
    $.assistStatus = 0;
    await getUserTuanInfo()
    if (!$.tuan && ($.assistStatus === 3 || $.assistStatus === 2 || $.assistStatus === 0) && $.canStartNewAssist) {
      console.log(`准备再次开团`)
      await openTuan()
      if ($.hasOpen) await getUserTuanInfo()
    }
    if ($.tuan && $.tuan.hasOwnProperty('assistedPinEncrypted') && $.assistStatus !== 3) {
      $.tuanList.push($.tuan);
      const code = Object.assign($.tuan, {"time": Date.now()});
      $.http.post({
        url: `http://go.chiang.fun/autocommit`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "act": "zuan", code }),
        timeout: 30000
      }).then((resp) => {
        if (resp.statusCode === 200) {
          try {
            let { body } = resp;
            body = JSON.parse(body);
            if (body['code'] === 200) {
              console.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的【赚京豆-瓜分京豆】好友互助码提交成功\n`)
            } else {
              console.log(`【赚京豆-瓜分京豆】邀请码提交失败:${JSON.stringify(body)}\n`)
            }
          } catch (e) {
            console.log(`【赚京豆-瓜分京豆】邀请码提交异常:${e}`)
          }
        }
      }).catch((e) => console.log(`【赚京豆-瓜分京豆】邀请码提交异常:${e}`));
    }
  } catch (e) {
    $.logErr(e);
  }
}
function helpFriendTuan(body) {
  return new Promise(resolve => {
    const data = {
      "activityIdEncrypted": body['activityIdEncrypted'],
      "assistStartRecordId": body['assistStartRecordId'],
      "channel": body['channel'],
    }
    delete body['time'];
    $.get(taskTuanUrl("vvipclub_distributeBean_assist", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              console.log('助力结果：助力成功\n')
            } else {
              if (data.resultCode === '9200008') console.log('助力结果：不能助力自己\n')
              else if (data.resultCode === '9200011') console.log('助力结果：已经助力过\n')
              else if (data.resultCode === '2400205') console.log('助力结果：团已满\n')
              else if (data.resultCode === '2400203') {console.log('助力结果：助力次数已耗尽\n');$.canHelp = false}
              else if (data.resultCode === '9000000') {console.log('助力结果：活动火爆，跳出\n');$.canHelp = false}
              else console.log(`助力结果：未知错误\n${JSON.stringify(data)}\n\n`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function getUserTuanInfo() {
  let body = {"paramData": {"channel": "FISSION_BEAN"}}
  return new Promise(resolve => {
    $.get(taskTuanUrl("distributeBeanActivityInfo", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              $.log(`\n\n当前【赚京豆(微信小程序)-瓜分京豆】能否再次开团: ${data.data.canStartNewAssist ? '可以' : '否'}`)
              console.log(`assistStatus ${data.data.assistStatus}`)
              if (data.data.assistStatus === 1 && !data.data.canStartNewAssist) {
                console.log(`已开团(未达上限)，但团成员人未满\n\n`)
              } else if (data.data.assistStatus === 3 && data.data.canStartNewAssist) {
                console.log(`已开团(未达上限)，团成员人已满\n\n`)
              } else if (data.data.assistStatus === 3 && !data.data.canStartNewAssist) {
                console.log(`今日开团已达上限，且当前团成员人已满\n\n`)
              }
              if (data.data && !data.data.canStartNewAssist) {
                $.tuan = {
                  "activityIdEncrypted": data.data.id,
                  "assistStartRecordId": data.data.assistStartRecordId,
                  "assistedPinEncrypted": data.data.encPin,
                  "channel": "FISSION_BEAN"
                }
              }
              $.tuanActId = data.data.id;
              $.assistNum = data['data']['assistNum'] || 4;
              $.assistStatus = data['data']['assistStatus'];
              $.canStartNewAssist = data['data']['canStartNewAssist'];
            } else {
              $.tuan = true;//活动火爆
              console.log(`赚京豆(微信小程序)-瓜分京豆】获取【活动信息失败 ${JSON.stringify(data)}\n`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function openTuan() {
  let body = {"activityIdEncrypted": $.tuanActId, "channel": "FISSION_BEAN"}
  return new Promise(resolve => {
    $.get(taskTuanUrl("vvipclub_distributeBean_startAssist", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              console.log(`【赚京豆(微信小程序)-瓜分京豆】开团成功`)
              $.hasOpen = true
            } else {
              console.log(`\n开团失败：${JSON.stringify(data)}\n`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function getAuthorShareCode(url) {
  return new Promise(resolve => {
    const options = {
      url: `${url}?${Date.now()}`, "timeout": 10000, headers: {
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
      Object.assign(options, { agent })
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          $.authorTuanList = []
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
async function getRandomCode() {
  await $.http.get({url: ``, timeout: 10000}).then(async (resp) => {
    if (resp.statusCode === 200) {
      try {
        let { body } = resp;
        body = JSON.parse(body);
        if (body && body['code'] === 200) {
          console.log(`随机取【赚京豆-瓜分京豆】${randomCount}个邀请码成功\n`);
          $.body = [];
          $.body1 = [];
          $.body.map(item => {
            // $.body1.push(JSON.parse(item));
          })
        }
      } catch (e) {
        console.log(`随机取【赚京豆-瓜分京豆】${randomCount}个邀请码异常:${e}`);
      }
    }
  }).catch((e) => console.log(`随机取【赚京豆-瓜分京豆】${randomCount}个邀请码异常:${e}`));
}
//======================赚京豆开团===========END=====
function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&osVersion=5.0.0&clientVersion=3.1.3&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
}

function taskTuanUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&osVersion=5.0.0&clientVersion=3.1.3&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
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
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log('京东服务器返回空数据');
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
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}