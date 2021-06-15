/*
东东小窝 jd_small_home.js
Last Modified time: 2021-1-22 14:27:20
现有功能：
做日常任务任务，每日抽奖（有机会活动京豆，使用的是免费机会，不消耗WO币）
自动使用WO币购买装饰品可以获得京豆，分别可获得5,20，50,100,200,400,700，1200京豆）

注：目前使用此脚本会给脚本内置的两个码进行助力，请知晓

活动入口：京东APP我的-游戏与更多-东东小窝
或 京东APP首页-搜索 玩一玩-DIY理想家
微信小程序入口：
来客有礼 - > 首页 -> 东东小窝
网页入口（注：进入后不能再此刷新，否则会有问题，需重新输入此链接进入）
https://h5.m.jd.com/babelDiy/Zeus/2HFSytEAN99VPmMGZ6V4EYWus1x/index.html

已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
===============Quantumultx===============
[task_local]
#东东小窝
16 22 * * * jd_small_home.js, tag=东东小窝, img-url=https://raw.githubusercontent.com/58xinian/icon/master/ddxw.png, enabled=true

================Loon==============
[Script]
cron "16 22 * * *" script-path=jd_small_home.js, tag=东东小窝

===============Surge=================
东东小窝 = type=cron,cronexp="16 22 * * *",wake-system=1,timeout=3600,script-path=jd_small_home.js

============小火箭=========
东东小窝 = type=cron,script-path=jd_small_home.js, cronexpr="16 22 * * *", timeout=3600, enable=true
 */
const $ = new Env('东东小窝');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message = '';
let isPurchaseShops = false;//是否一键加购商品到购物车，默认不加购
$.helpToken = [];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
$.newShareCodes = [];
const JD_API_HOST = 'https://lkyl.dianpusoft.cn/api';

!(async () => {
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
      console.log(`\n*******开始【京东账号${$.index}】${$.nickName || $.UserName}********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await smallHome();
    }
  }
  await updateInviteCodeCDN('https://raw.githubusercontent.com/JDHelloWorld/jd_scripts/main/tools/empty.json');
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.token = $.helpToken[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      if ($.newShareCodes.length > 1) {
        console.log('----', (i + 1) % $.newShareCodes.length)
        let code = $.newShareCodes[(i + 1) % $.newShareCodes.length]['code']
        console.log(`\n${$.UserName} 去给自己的下一账号 ${decodeURIComponent($.newShareCodes[(i + 1) % $.newShareCodes.length]['cookie'].match(/pt_pin=([^; ]+)(?=;?)/) && $.newShareCodes[(i + 1) % $.newShareCodes.length]['cookie'].match(/pt_pin=([^; ]+)(?=;?)/)[1])}助力，助力码为 ${code}\n`)
        await createAssistUser(code, $.createAssistUserID);
      }
      console.log(`\n去帮助作者\n`)
      await helpFriends();
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function smallHome() {
  await loginHome();
  await ssjjRooms();
  // await helpFriends();
  if (!$.isUnLock) return;
  await createInviteUser();
  await queryDraw();
  await lottery();
  await doAllTask();
  await queryByUserId();
  await queryFurnituresCenterList();
  await showMsg();
}
function showMsg() {
  return new Promise(resolve => {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}
async function lottery() {
  if ($.freeDrawCount > 0) {
    await drawRecord($.lotteryId);
  } else {
    console.log(`免费抽奖机会今日已使用\n`)
  }
}

async function doChannelsListTask(taskId, taskType) {
  await queryChannelsList(taskId);
  for (let item of $.queryChannelsList) {
    if (item.showOrder === 1) {
      await $.wait(1000)
      await followChannel(taskId, item.id)
      await queryDoneTaskRecord(taskId, taskType);
    }
  }
}
async function helpFriends() {
  if ($.inviteCodes && $.inviteCodes['inviteCode']) {
    for (let item of $.inviteCodes.inviteCode) {
      if (!item) continue
      await createAssistUser(item, $.createAssistUserID);
    }
  }
}
async function doAllTask() {
  await queryAllTaskInfo();//获取任务详情列表$.taskList
  console.log(` 任务名称   完成进度 `)
  for (let item of $.taskList) {
    console.log(`${item.ssjjTaskInfo.name}      ${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum || (item.ssjjTaskInfo.type === 1 ? 4: 1)}`)
  }
  for (let item of $.taskList) {
    if (item.ssjjTaskInfo.type === 1) {
      //邀请好友助力自己
      $.createAssistUserID = item.ssjjTaskInfo.id;
      console.log(`createAssistUserID:${item.ssjjTaskInfo.id}`)
      console.log(`\n\n助力您的好友:${item.doneNum}人`)
    }
    if (item.ssjjTaskInfo.type === 2) {
      //每日打卡
      if (item.doneNum === (item.ssjjTaskInfo.awardOfDayNum || 1)) {
        console.log(`${item.ssjjTaskInfo.name}已完成（${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum || 1}）`)
        continue
      }
      await clock(item.ssjjTaskInfo.id, item.ssjjTaskInfo.awardWoB)
    }
    // 限时连连看
    if (item.ssjjTaskInfo.type === 3) {
      if (item.doneNum === item.ssjjTaskInfo.awardOfDayNum) {
        console.log(`${item.ssjjTaskInfo.name}已完成[${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum}]`)
        continue
      }
      for (let i = 0; i < new Array(item.ssjjTaskInfo.awardOfDayNum || 1).fill('').length; i++) {
        await game(item.ssjjTaskInfo.id, item.doneNum);
      }
    }
    if (item.ssjjTaskInfo.type === 4) {
      //关注店铺
      if (item.doneNum === item.ssjjTaskInfo.awardOfDayNum) {
        console.log(`${item.ssjjTaskInfo.name}已完成[${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum}]`)
        continue
      }
      for (let i = 0; i < new Array(item.ssjjTaskInfo.awardOfDayNum).fill('').length; i++) {
        await followShops('followShops', item.ssjjTaskInfo.id);//一键关注店铺
        await queryDoneTaskRecord(item.ssjjTaskInfo.id, item.ssjjTaskInfo.type);
      }
    }
    if (item.ssjjTaskInfo.type === 5) {
      //浏览店铺
      if (item.doneNum === item.ssjjTaskInfo.awardOfDayNum) {
        console.log(`${item.ssjjTaskInfo.name}已完成[${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum}]`)
        continue
      }
      for (let i = 0; i < new Array(item.ssjjTaskInfo.awardOfDayNum).fill('').length; i++) {
        await browseChannels('browseShops', item.ssjjTaskInfo.id, item.browseId);
      }
    }
    if (item.ssjjTaskInfo.type === 6) {
      //关注4个频道
      if (item.doneNum === item.ssjjTaskInfo.awardOfDayNum) {
        console.log(`${item.ssjjTaskInfo.name}已完成[${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum}]`)
        continue
      }
      await doChannelsListTask(item.ssjjTaskInfo.id, item.ssjjTaskInfo.type)
    }
    if (item.ssjjTaskInfo.type === 7) {
      //浏览3个频道
      if (item.doneNum === item.ssjjTaskInfo.awardOfDayNum) {
        console.log(`${item.ssjjTaskInfo.name}已完成[${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum}]`)
        continue
      }
      for (let i = 0; i < new Array(item.ssjjTaskInfo.awardOfDayNum || 1).fill('').length; i++) {
        await browseChannels('browseChannels', item.ssjjTaskInfo.id, item.browseId);
      }
    }
    isPurchaseShops = $.isNode() ? (process.env.PURCHASE_SHOPS ? process.env.PURCHASE_SHOPS : isPurchaseShops) : ($.getdata("isPurchaseShops") ? $.getdata("isPurchaseShops") : isPurchaseShops);
    if (isPurchaseShops && item.ssjjTaskInfo.type === 9) {
      //加购商品
      if (item.doneNum === item.ssjjTaskInfo.awardOfDayNum) {
        console.log(`${item.ssjjTaskInfo.name}已完成[${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum}]`)
        continue
      }
      for (let i = 0; i < new Array(item.ssjjTaskInfo.awardOfDayNum).fill('').length; i++) {
        await followShops('purchaseCommodities', item.ssjjTaskInfo.id);//一键加购商品
        await queryDoneTaskRecord(item.ssjjTaskInfo.id, item.ssjjTaskInfo.type);
      }
    }
    if (item.ssjjTaskInfo.type === 10) {
      //浏览商品
      if (item.doneNum === item.ssjjTaskInfo.awardOfDayNum) {
        console.log(`${item.ssjjTaskInfo.name}已完成[${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum}]`)
        continue
      }
      for (let i = 0; i < new Array(item.ssjjTaskInfo.awardOfDayNum).fill('').length; i++) {
        await browseChannels('browseCommodities', item.ssjjTaskInfo.id, item.browseId);
      }
    }
    if (item.ssjjTaskInfo.type === 11) {
      //浏览会场
      if (item.doneNum === item.ssjjTaskInfo.awardOfDayNum) {
        console.log(`${item.ssjjTaskInfo.name}已完成[${item.doneNum}/${item.ssjjTaskInfo.awardOfDayNum}]`)
        continue
      }
      for (let i = 0; i < new Array(item.ssjjTaskInfo.awardOfDayNum || 1).fill('').length; i++) {
        await browseChannels('browseMeetings' ,item.ssjjTaskInfo.id, item.browseId);
      }
      // await browseChannels('browseMeetings' ,item.ssjjTaskInfo.id, item.browseId);
      // await doAllTask();
    }
  }
}
function queryFurnituresCenterList() {
  return new Promise(resolve => {
    $.get(taskUrl(`ssjj-furnitures-center/queryFurnituresCenterList`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                let { buy, list } = data.body;
                $.canBuyList = [];
                list.map((item, index) => {
                  if (buy.some((buyItem) => buyItem === item.id)) return
                  $.canBuyList.push(item);
                })
                $.canBuyList.sort(sortByjdBeanNum);
                if ($.canBuyList[0].needWoB <= $.woB) {
                  await furnituresCenterPurchase($.canBuyList[0].id, $.canBuyList[0].jdBeanNum);
                } else {
                  console.log(`\n兑换${$.canBuyList[0].jdBeanNum}京豆失败:当前wo币${$.woB}不够兑换所需的${$.canBuyList[0].needWoB}WO币`)
                  message += `【装饰领京豆】兑换${$.canBuyList[0].jdBeanNum}京豆失败,原因:WO币不够\n`;
                }
                // for (let canBuyItem of $.canBuyList) {
                //   if (canBuyItem.needWoB <= $.woB) {
                //     await furnituresCenterPurchase(canBuyItem.id, canBuyItem.jdBeanNum);
                //     break
                //   }
                // }
              }
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
//装饰领京豆
function furnituresCenterPurchase(id, jdBeanNum) {
  return new Promise(resolve => {
    $.post(taskPostUrl(`ssjj-furnitures-center/furnituresCenterPurchase/${id}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              message += `【装饰领京豆】${jdBeanNum}兑换成功\n`;
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

//获取详情
function queryByUserId() {
  return new Promise(resolve => {
    $.get(taskUrl(`ssjj-wo-home-info/queryByUserId/2`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                message += `【小窝名】${data.body.name}\n`;
                $.woB = data.body.woB;
                message += `【当前WO币】${data.body.woB}\n`;
              }
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
//获取需要关注的频道列表
function queryChannelsList(taskId) {
  return new Promise(resolve => {
    $.get(taskUrl(`ssjj-task-channels/queryChannelsList/${taskId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                $.queryChannelsList = data.body;
              }
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

//浏览频道，浏览会场，浏览商品，浏览店铺API
function browseChannels(functionID ,taskId, browseId) {
  return new Promise(resolve => {
    $.get(taskUrl(`/ssjj-task-record/${functionID}/${taskId}/${browseId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            console.log(`${functionID === 'browseChannels' ? '浏览频道' : functionID === 'browseMeetings' ? '浏览会场' : functionID === 'browseShops' ? '浏览店铺' : '浏览商品'}`, data)
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                // message += `【限时连连看】成功，活动${awardWoB}WO币\n`;
              }
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
//记录已关注的频道
function queryDoneTaskRecord(taskId, taskType) {
  return new Promise(resolve => {
    $.get(taskUrl(`/ssjj-task-record/queryDoneTaskRecord/${taskType}/${taskId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                // message += `【限时连连看】成功，活动${awardWoB}WO币\n`;
              }
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
//一键关注店铺，一键加购商品API
function followShops(functionID, taskId) {
  return new Promise(async resolve => {
    $.get(taskUrl(`/ssjj-task-record/${functionID}/${taskId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                console.log(`${functionID === 'followShops'? '一键关注店铺': '一键加购商品'}结果：${data.head.msg}`);
                // message += `【限时连连看】成功，活动${awardWoB}WO币\n`;
              }
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
//关注频道API
function followChannel(taskId, channelId) {
  return new Promise(async resolve => {
    $.get(taskUrl(`/ssjj-task-record/followChannel/${channelId}/${taskId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                // message += `【限时连连看】成功，活动${awardWoB}WO币\n`;
              }
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
function createInviteUser() {
  return new Promise(resolve => {
    $.get(taskUrl(`/ssjj-task-record/createInviteUser`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                if (data.body.id) {
                  console.log(`\n您的${$.name}shareCode(每天都是变化的):【${data.body.id}】\n`);
                  $.shareCode = data.body.id;
                  $.newShareCodes.push({ 'code': data.body.id, 'token': $.token, cookie });
                }
              }
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

function createAssistUser(inviteId, taskId) {
  console.log(`${inviteId}, ${taskId}`, `${cookie}`);
  return new Promise(resolve => {
    $.get(taskUrl(`/ssjj-task-record/createAssistUser/${inviteId}/${taskId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                console.log(`\n给好友${data.body.inviteId}:【${data.head.msg}】\n`)
              }
            } else {
              console.log(`助力失败${JSON.stringify(data)}}`);
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
function game(taskId, index, awardWoB = 100) {
  return new Promise(resolve => {
    $.get(taskUrl(`/ssjj-task-record/game/${index}/${taskId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                message += `【限时连连看】成功，活动${awardWoB}WO币\n`;
              }
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
function clock(taskId, awardWoB) {
  return new Promise(resolve => {
    $.get(taskUrl(`/ssjj-task-record/clock/${taskId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                message += `【每日打卡】成功，活动${awardWoB}WO币\n`;
              }
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
function queryAllTaskInfo() {
  return new Promise(resolve => {
    $.get(taskUrl(`ssjj-task-info/queryAllTaskInfo/2`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                $.taskList = data.body;
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
//免费抽奖
function drawRecord(id) {
  return new Promise(resolve => {
    $.get(taskUrl(`ssjj-draw-record/draw/${id}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              if (data.body) {
                message += `【免费抽奖】获得：${data.body.name}\n`;
              } else {
                message += `【免费抽奖】未中奖\n`;
              }
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
//查询免费抽奖机会
function queryDraw() {
  return new Promise(resolve => {
    $.get(taskUrl("ssjj-draw-center/queryDraw"), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              $.freeDrawCount = data.body.freeDrawCount;//免费抽奖次数
              $.lotteryId = data.body.center.id;
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
//查询是否开启了此活动
function ssjjRooms() {
  return new Promise(resolve => {
    $.get(taskUrl("ssjj-rooms/info/%E5%AE%A2%E5%8E%85"), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.head.code === 200) {
              $.isUnLock = data.body.isUnLock;
              if (!$.isUnLock) {
                console.log(`京东账号${$.index}${$.nickName}未开启此活动\n`);
                //$.msg($.name, '', `京东账号${$.index}${$.nickName}未开启此活动\n点击弹窗去开启此活动(￣▽￣)"`, {"open-url": "openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/2HFSytEAN99VPmMGZ6V4EYWus1x/index.html%22%20%7D"});
              }
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
function loginHome() {
  return new Promise(resolve => {
    const options = {
      "url": "https://jdhome.m.jd.com/saas/framework/encrypt/pin?appId=6d28460967bda11b78e077b66751d2b0",
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Length": "0",
        "Content-Type": "application/json",
        "Cookie": cookie,
        "Host": "jdhome.m.jd.com",
        "Origin": "https://jdhome.m.jd.com",
        "Referer": "https://jdhome.m.jd.com/dist/taro/index.html/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            await login(data.data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}
function login(userName) {
  return new Promise(resolve => {
    const body = {
      "body": {
        "client": 2,
        userName
      }
    };
    const options = {
      "url": `${JD_API_HOST}/user-info/login`,
      "body": JSON.stringify(body),
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "Host": "lkyl.dianpusoft.cn",
        "Origin": "https://lkyl.dianpusoft.cn",
        "Referer": "https://h5.m.jd.com/babelDiy/Zeus/2HFSytEAN99VPmMGZ6V4EYWus1x/index.html",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.head.code === 200) {
            $.token = data.head.token;
            $.helpToken.push(data.head.token)
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
function updateInviteCode(url) {
  return new Promise(resolve => {
    $.get({url}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          $.inviteCodes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function updateInviteCodeCDN(url) {
  return new Promise(async resolve => {
    $.get({url, headers:{"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")}, timeout: 200000}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.inviteCodes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
    await $.wait(3000)
    resolve();
  })
}
function taskUrl(url, body = {}) {
  return {
    url: `${JD_API_HOST}/${url}?body=${escape(body)}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Connection": "keep-alive",
      "content-type": "application/json",
      "Host": "lkyl.dianpusoft.cn",
      "Referer": "https://h5.m.jd.com/babelDiy/Zeus/2HFSytEAN99VPmMGZ6V4EYWus1x/index.html",
      "token": $.token,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
    }
  }
}
function taskPostUrl(url) {
  return {
    url: `${JD_API_HOST}/${url}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Connection": "keep-alive",
      "content-type": "application/json",
      "Host": "lkyl.dianpusoft.cn",
      "Referer": "https://h5.m.jd.com/babelDiy/Zeus/2HFSytEAN99VPmMGZ6V4EYWus1x/index.html",
      "token": $.token,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
    }
  }
}
function sortByjdBeanNum(a, b) {
  return a['jdBeanNum'] - b['jdBeanNum'];
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
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
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
