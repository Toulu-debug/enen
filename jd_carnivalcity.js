/*
京东手机狂欢城
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
===================quantumultx================
[task_local]
#京东手机狂欢城
5 0-18/6 * * * https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_carnivalcity.js, tag=京东手机狂欢城, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
=====================Loon================
[Script]
cron "5 0-18/6 * * *" script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_carnivalcity.js, tag=京东手机狂欢城
====================Surge================
京东手机狂欢城 = type=cron,cronexp=5 0-18/6 * * *,wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_carnivalcity.js
============小火箭=========
京东手机狂欢城 = type=cron,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_carnivalcity.js, cronexpr="5 0-18/6 * * *", timeout=3600, enable=true
*/

const $ = new Env('京东手机狂欢城');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '', message = '', allMessage = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
  if (JSON.stringify(process.env).indexOf('GITHUB') > -1) process.exit(0)
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let shareCodes = [], shareCodesSelf = [], shareCodesHW = [];
const JD_API_HOST = 'https://api.m.jd.com/api';
const activeEndTime = '2021/11/14 00:00:00+08:00';//活动结束时间
let nowTime = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  if (nowTime > new Date(activeEndTime).getTime()) {
    $.msg($.name, '活动已结束', `该活动累计获得京豆：${$.jingBeanNum}个\n请删除此脚本\n咱江湖再见`);
    if ($.isNode()) await notify.sendNotify($.name + '活动已结束', `请删除此脚本\n咱江湖再见`);
    return
  }

  await updateShareCodesCDN();  // 获取助力池
  // 获取内部助力码
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.index = i + 1;
      $.canHelp = true;//能否助力
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      getUA()
      await supportList();//助力情况
      await getHelp();//获取邀请码
    }
  }

  // 先助力
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.index = i + 1;
    $.canHelp = true;//能否助力
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
    getUA()
    if (!shareCodesHW.length) {
      await getShareCodesHW();
    }
    if ($.updatePkActivityIdRes && $.updatePkActivityIdRes.length) {
      shareCodes = [...new Set([...shareCodesSelf, ...shareCodesHW, ...$.updatePkActivityIdRes])]
    }
    console.log('助力排队:', shareCodes)
    if ((cookiesArr && cookiesArr.length >= 1) && $.canHelp) {
      console.log(`\n先自己账号内部相互邀请助力\n`);
      for (let item of shareCodes) {
        console.log(`\n${$.UserName} 去参助力 ${item}`);
        const helpRes = await toHelp(item.trim());
        if (helpRes.data.status === 5) {
          console.log(`助力机会已耗尽，跳出助力`);
          $.canHelp = false;
          break;
        }
      }
    }
  }

  // 主任务
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      $.jingBeanNum = 0;//累计获得京豆
      $.integralCount = 0;//累计获得积分
      $.integer = 0;//当天获得积分
      $.lasNum = 0;//当天参赛人数
      $.num = 0;//当天排名
      $.beans = 0;//本次运行获得京豆数量
      $.blockAccount = false;//黑号
      message = '';
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      getUA()
      await JD818();
    }
  }

  if (allMessage) {
    if ($.isNode()) {
      await notify.sendNotify($.name, allMessage, {url: JD_API_HOST});
      $.msg($.name, '', allMessage);
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function JD818() {
  try {
    await indexInfo();//获取任务
    if ($.blockAccount) return
    await indexInfo(true);//获取任务
    await doHotProducttask();//做热销产品任务
    await doBrandTask();//做品牌手机任务
    await doBrowseshopTask();//逛好货街，做任务
    // await doHelp();
    await myRank();//领取往期排名奖励
    await getListRank();
    await getListIntegral();
    await getListJbean();
    await check();//查询抽奖记录(未兑换的，发送提醒通知);
    await showMsg()
  } catch (e) {
    $.logErr(e)
  }
}

async function doHotProducttask() {
  $.hotProductList = $.hotProductList.filter(v => !!v && v['status'] === "1");
  if ($.hotProductList && $.hotProductList.length) console.log(`开始 【浏览热销手机产品】任务,需等待6秒`)
  for (let item of $.hotProductList) {
    await doBrowse(item['id'], "", "hot", "browse", "browseHotSku");
    await $.wait(1000 * 6);
    if ($.browseId) {
      await getBrowsePrize($.browseId)
    }
  }
}

//做任务 API
function doBrowse(id = "", brandId = "", taskMark = "hot", type = "browse", logMark = "browseHotSku") {
  $.browseId = ''
  return new Promise(resolve => {
    const body = {
      "brandId": `${brandId}`,
      "id": `${id}`,
      "taskMark": `${taskMark}`,
      "type": `${type}`,
      "logMark": `${logMark}`
    };
    const options = taskPostUrl('/khc/task/doBrowse', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`doBrowse 做${taskMark}任务:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            $.browseId = data['data']['browseId'] || "";
          } else {
            console.log(`doBrowse异常`);
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

//领取奖励
function getBrowsePrize(browseId, brandId = '') {
  return new Promise(resolve => {
    const body = {"browseId": browseId, "brandId": `${brandId}`};
    const options = taskPostUrl('/khc/task/getBrowsePrize', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`getBrowsePrize 领取奖励 结果:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            if (data['data']['jingBean']) $.beans += data['data']['jingBean'];
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

// 关注
function followShop(browseId, brandId = '') {
  return new Promise(resolve => {
    const body = {"id": `${browseId}`, "brandId": `${brandId}`};
    const options = taskPostUrl('/khc/task/followShop', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`followShop 领取奖励 结果:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            if (data['data']['jingBean']) $.beans += data['data']['jingBean'];
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

async function doBrandTask() {
  for (let brand of $.brandList) {
    await brandTaskInfo(brand['brandId']);
  }
}

function brandTaskInfo(brandId) {
  const body = {"brandId": `${brandId}`};
  const options = taskPostUrl('/khc/index/brandTaskInfo', body)
  $.skuTask = [];
  $.shopTask = [];
  $.meetingTask = [];
  $.questionTask = {};
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = $.toObj(data);
          if (data.code === 200) {
            let brandId = data['data']['brandId'];
            $.skuTask = data['data']['skuTask'] || [];
            $.shopTask = data['data']['shopTask'] || [];
            $.meetingTask = data['data']['meetingTask'] || [];
            $.questionTask = data['data']['questionTask'] || [];
            let flag = true
            for (let sku of $.shopTask.filter(vo => !!vo && vo['status'] !== '4')) {
              if (flag) console.log(`\n开始做 品牌手机 【${data['data']['brandName']}】 任务`)
              if (flag) flag = false
              console.log(`开始浏览 1-F 关注 任务 ${sku['name']}`);
              if (sku['status'] == 3) {
                await followShop(sku['id'], brandId);
              } else if (sku['status'] == 8) {
                await doBrowse(sku['id'], brandId, "brand", "follow", "browseShop");
                await $.wait(1000 * 6);
                if ($.browseId) await getBrowsePrize($.browseId, brandId);
              } else {
                console.log(`未知任务状态 ${sku['status']}`)
              }
            }
            flag = true
            for (let sku of $.skuTask.filter(vo => !!vo && vo['status'] !== '4')) {
              if (flag) console.log(`\n开始做 品牌手机 【${data['data']['brandName']}】 任务`)
              if (flag) flag = false
              console.log(`开始浏览 2-F 单品区 任务 ${sku['name']}`);
              await doBrowse(sku['id'], brandId, "brand", "presell", "browseSku");
              await $.wait(1000 * 6);
              if ($.browseId) await getBrowsePrize($.browseId, brandId);
            }
            flag = true
            for (let sku of $.meetingTask.filter(vo => !!vo && vo['status'] !== '4')) {
              if (flag) console.log(`\n开始做 品牌手机 【${data['data']['brandName']}】 任务`)
              if (flag) flag = false
              console.log(`开始浏览 3-F 综合区 任务 ${sku['name']}，需等待10秒`);
              await doBrowse(sku['id'], brandId, "brand", "meeting", "browseVenue");
              await $.wait(10500);
              if ($.browseId) await getBrowsePrize($.browseId, brandId);
            }
            flag = true
            if ($.questionTask.hasOwnProperty('id') && $.questionTask['result'] === '0') {
              if (flag) console.log(`\n开始做 品牌手机 【${data['data']['brandName']}】 任务`)
              if (flag) flag = false
              console.log(`开始做答题任务 ${$.questionTask['question']}`);
              let result = 0;
              for (let i = 0; i < $.questionTask['answers'].length; i++) {
                if ($.questionTask['answers'][i]['right']) {
                  result = i + 1;//正确答案
                }
              }
              if (result !== 0) {
                await doQuestion(brandId, $.questionTask['id'], result);
              }
            }
          } else {
            console.log(`失败：${JSON.stringify(data)}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  });
}

function doQuestion(brandId, questionId, result) {
  return new Promise(resolve => {
    const body = {"brandId": `${brandId}`, "questionId": `${questionId}`, "result": result};
    const options = taskPostUrl('/khc/task/doQuestion', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`doQuestion 领取答题任务奖励 结果:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            if (data['data']['jingBean']) $.beans += data['data']['jingBean'];
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

//逛好货街，做任务
async function doBrowseshopTask() {
  $.browseshopList = $.browseshopList.filter(v => !!v && v['status'] === "6");
  if ($.browseshopList && $.browseshopList.length) console.log(`\n开始 【逛好货街，做任务】，需等待10秒`)
  for (let shop of $.browseshopList) {
    await doBrowse(shop['id'], "", "browseShop", "browse", "browseShop");
    await $.wait(10000);
    if ($.browseId) {
      await getBrowsePrize($.browseId)
    }
  }
}

function indexInfo(flag = false) {
  const options = taskPostUrl(`/khc/index/indexInfo`, {})
  $.hotProductList = [];
  $.brandList = [];
  $.browseshopList = [];
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = $.toObj(data);
          if (data.code === 200) {
            $.hotProductList = data['data']['hotProductList'] || [];
            $.brandList = data['data']['brandList'] || [];
            $.browseshopList = data['data']['browseshopList'] || [];
          } else {
            console.log(`异常：${JSON.stringify(data)}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}

//获取助力信息
function supportList() {
  const options = taskPostUrl('/khc/index/supportList', {})
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            console.log(`助力情况：${data['data']['supportedNums']}/${data['data']['supportNeedNums']}`);
            message += `邀请好友助力：${data['data']['supportedNums']}/${data['data']['supportNeedNums']}\n`
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}

//积分抽奖
function lottery() {
  const options = taskPostUrl('/khc/record/lottery', {})
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            if (data.data.prizeId !== 8) {
              //已中奖
              const url = 'https://carnivalcity.m.jd.com/#/integralDetail';
              console.log(`积分抽奖获得:${data.data.prizeName}`);
              message += `积分抽奖获得：${data.data.prizeName}\n`;
              $.msg($.name, '', `京东账号 ${$.index} ${$.nickName || $.UserName}\n积分抽奖获得：${data.data.prizeName}\n兑换地址：${url}`, {'open-url': url});
              if ($.isNode()) await notify.sendNotify($.name, `京东账号 ${$.index} ${$.nickName || $.UserName}\n积分抽奖获得：${data.data.prizeName}\n兑换地址：${url}`);
            } else {
              console.log(`积分抽奖结果:${data['data']['prizeName']}}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}

//查询抽奖记录(未兑换的)
function check() {
  const options = taskPostUrl('/khc/record/convertRecord', {pageNum: 1})
  return new Promise((resolve) => {
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          let str = '';
          if (data.code === 200) {
            for (let obj of data.data) {
              if (obj.hasOwnProperty('fillStatus') && obj.fillStatus !== true) {
                str += JSON.stringify(obj);
              }
            }
          }
          if (str.length > 0) {
            const url = 'https://carnivalcity.m.jd.com/#/integralDetail';
            $.msg($.name, '', `京东账号 ${$.index} ${$.nickName || $.UserName}\n积分抽奖获得：${str}\n兑换地址：${url}`, {'open-url': url});
            if ($.isNode()) await notify.sendNotify($.name, `京东账号 ${$.index} ${$.nickName || $.UserName}\n积分抽奖获得：${str}\n兑换地址：${url}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}

function myRank() {
  return new Promise(resolve => {
    const options = taskPostUrl("/khc/rank/myPastRanks", {});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            if (data.data && data.data.length) {
              for (let i = 0; i < data.data.length; i++) {
                $.date = data.data[i]['date'];
                if (data.data[i].status === '1') {
                  console.log(`开始领取往期奖励【${data.data[i]['prizeName']}】`)
                  let res = await saveJbean($.date);
                  // console.log('领奖结果', res)
                  if (res && res.code === 200) {
                    $.beans += Number(res.data);
                    console.log(`${data.data[i]['date']}日 【${res.data}】京豆奖励领取成功`)
                  } else {
                    console.log(`往期奖励领取失败：${JSON.stringify(res)}`);
                  }
                  await $.wait(500);
                } else if (data.data[i].status === '3') {
                  console.log(`${data.data[i]['date']}日 【${data.data[i]['prizeName']}】往期京豆奖励已领取~`)
                } else {
                  console.log(`${data.data[i]['date']}日 【${data.data[i]['status']}】往期京豆奖励，今日争取进入前30000名哦~`)
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

//领取往期奖励API
function saveJbean(date) {
  return new Promise(resolve => {
    const body = {"date": `${date}`};
    const options = taskPostUrl('/khc/rank/getRankJingBean', body)
    $.post(options, (err, resp, data) => {
      try {
        // console.log('领取京豆结果', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

async function doHelp() {
  console.log(`\n开始助力好友`);
  for (let i in $.newShareCodes) {
    let item = $.newShareCodes[i]
    console.log('好友助力码：', item)
    if (!item) continue;
    const helpRes = await toHelp(item.trim());
    if (helpRes.data.status === 5) {
      console.log(`助力机会已耗尽，跳出助力`);
      break;
    } else if (helpRes.data.status === 4) {
      console.log(`该助力码[${item}]已达上限`);
      $.newShareCodes[i] = ''
    }
  }
}

//助力API
function toHelp(code) {
  return new Promise(resolve => {
    const body = {"shareId": `${code}`};
    const options = taskPostUrl('/khc/task/doSupport', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`助力结果:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            if (data['data']['status'] === 6) console.log(`助力成功\n`)
            if (data['data']['jdNums']) $.beans += data['data']['jdNums'];
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

//获取邀请码API
function getHelp() {
  return new Promise(resolve => {
    $.post({
      url: 'https://api.m.jd.com/api',
      headers: {
        'User-Agent': 'jdapp;',
        'Origin': 'https://carnivalcity.m.jd.com',
        'Host': 'api.m.jd.com',
        'Referer': 'https://carnivalcity.m.jd.com/',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie
      },
      body: 'appid=guardian-starjd&functionId=carnivalcity_jd_prod&body={"apiMapping":"/khc/task/getSupport"}&t=1634977085493&loginType=2'
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            console.log(`\n\n${$.name}互助码每天都变化,旧的不可继续使用`);
            $.log(`【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.data.shareId}\n\n`);
            if (new Date().getHours() !== 0)
              await $.wait(3000)
            shareCodesSelf.push(data.data.shareId);
          } else {
            console.log(`获取邀请码失败：${JSON.stringify(data)}`);
            if (data.code === 1002) $.blockAccount = true;
          }
        }
      } catch (e) {
      } finally {
        resolve()
      }
    })
  })
}

//获取当前活动总京豆数量
function getListJbean() {
  return new Promise(resolve => {
    const body = {
      pageNum: ``
    }
    const options = taskPostUrl("/khc/record/jingBeanRecord", body);
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            $.jingBeanNum = data.data.jingBeanNum || 0;
            message += `累计获得京豆：${$.jingBeanNum}🐶\n`;
          } else {
            console.log(`jingBeanRecord失败：${JSON.stringify(data)}`);
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

//查询累计获得积分
function getListIntegral() {
  return new Promise(resolve => {
    const body = {
      pageNum: ``
    }
    const options = taskPostUrl("/khc/record/integralRecord", body);
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            $.integralCount = data.data.integralNum || 0;//累计活动积分
            message += `累计获得积分：${$.integralCount}\n`;
            console.log(`开始抽奖，当前积分可抽奖${parseInt($.integralCount / 50)}次\n`);
            for (let i = 0; i < parseInt($.integralCount / 50); i++) {
              await lottery();
              await $.wait(500);
            }
          } else {
            console.log(`integralRecord失败：${JSON.stringify(data)}`);
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

//查询今日累计积分与排名
function getListRank() {
  return new Promise(resolve => {
    const options = taskPostUrl("/khc/rank/dayRank", {});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            if (data.data.myRank) {
              $.integer = data.data.myRank.integral;//当前获得积分
              $.num = data.data.myRank.rank;//当前排名
              message += `当前获得积分：${$.integer}\n`;
              message += `当前获得排名：${$.num}\n`;
            }
            if (data.data.lastRank) {
              $.lasNum = data.data.lastRank.rank;//当前参加活动人数
              message += `当前参赛人数：${$.lasNum}\n`;
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

function updateShareCodesCDN() {
  return new Promise(resolve => {
    $.get({
      url: "https://api.jdsharecode.xyz/api/carnivalcity/30",
      headers: {"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")},
      timeout: 10000
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data)
          $.updatePkActivityIdRes = data.data;
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function taskPostUrl(a, t = {}) {
  const body = $.toStr({...t, "apiMapping": `${a}`})
  return {
    url: `${JD_API_HOST}`,
    body: `appid=guardian-starjd&functionId=carnivalcity_jd_prod&body=${body}&t=${Date.now()}&loginType=2`,
    headers: {
      "Host": "api.m.jd.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://carnivalcity.m.jd.com",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      "Referer": "https://carnivalcity.m.jd.com/",
      "Cookie": cookie
    }
  }
}


async function showMsg() {
  if ($.beans) {
    allMessage += `京东账号${$.index} ${$.nickName || $.UserName}\n本次运行获得：${$.beans}京豆\n${message}活动地址：https://carnivalcity.m.jd.com${$.index !== cookiesArr.length ? '\n\n' : ''}`
  }
  $.msg($.name, `京东账号${$.index} ${$.nickName || $.UserName}`, `${message}具体详情点击弹窗跳转后即可查看`, {"open-url": "https://carnivalcity.m.jd.com"});
}

function getUA() {
  $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}

function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
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

function getShareCodesHW() {
  return new Promise(resolve => {
    $.get({
      url: "https://api.jdsharecode.xyz/api/HW_CODES"
    }, (err, resp, data) => {
      try {
        if (!err) {
          data = JSON.parse(data)
          shareCodesHW = data['carnivalcity']
        }
      } catch (e) {
      } finally {
        resolve()
      }
    })
  })
}

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
        const [o, h] = i.split("@"), n = {
          url: `http://${h}/v1/scripting/evaluate`,
          body: {script_text: t, mock_type: "cron", timeout: r},
          headers: {"X-Key": o, Accept: "*/*"}
        };
        this.post(n, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }

    loaddata() {
      if (!this.isNode()) return {};
      {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
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
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
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
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i),
          h = i ? "null" === o ? null : o || "{}" : "{}";
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
      let i = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds()
      };
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