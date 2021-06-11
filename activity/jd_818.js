/*
京东手机狂欢城活动，每日可获得30+以上京豆（其中20京豆是往期奖励，需第一天参加活动后，第二天才能拿到）
活动时间10.21日-11.12日结束，活动23天，保底最少可以拿到690京豆
活动地址: https://rdcseason.m.jd.com/#/index

其中有20京豆是往期奖励，需第一天参加活动后，第二天才能拿到！！！！


每天0/6/12/18点逛新品/店铺/会场可获得京豆，京豆先到先得
往期奖励一般每天都能拿20京豆

注：脚本运行会给我提供的助力码助力，介意者可删掉脚本第48行helpCode里面的东西。留空即可（const helpCode = []）;

支持京东双账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
===================quantumultx================
[task_local]
#京东手机狂欢城
0 0-18/6 * * * jd_818.js, tag=京东手机狂欢城, enabled=true
=====================Loon================
[Script]
cron "0 0-18/6 * * *" script-path=jd_818.js, tag=京东手机狂欢城
====================Surge================
京东手机狂欢城 = type=cron,cronexp=0 0-18/6 * * *,wake-system=1,timeout=3600,script-path=jd_818.js
 */
const $ = new Env('京东手机狂欢城');

const notify = $.isNode() ? require('../sendNotify') : '';
let jdNotify = false;//是否开启推送互助码
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('../jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}

const JD_API_HOST = 'https://rdcseason.m.jd.com/api/';
const activeEndTime = '2021/2/4 00:59:59+08:00';
const addUrl = 'http://jd.turinglabs.net/helpcode/create/';
const printUrl = `http://jd.turinglabs.net/api/v2/jd/5g/read/30/`;
let helpCode = []
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  $.temp = [];
  await updateShareCodesCDN();
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await JD818();
      // await getHelp();
      // await doHelp();
      // await main();
    }
  }
  // console.log(JSON.stringify($.temp))
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function main() {
  // await getHelp();
  await Promise.all([
    getHelp(),
    listGoods(),
    shopInfo(),
    listMeeting(),
  ]);
  await $.wait(10000);
  await Promise.all([
    listGoods(),
    shopInfo(),
    listMeeting(),
    doHelp(),
    myRank(),
  ]);
  await Promise.all([
    getListJbean(),
    getListRank(),
    getListIntegral(),
  ]);
  await showMsg()
}
async function JD818() {
  try {
    await getHelp();
    await listGoods();//逛新品
    await shopInfo();//逛店铺
    await listMeeting();//逛会场
    await $.wait(10000);
    //再次运行一次，避免出现遗漏的问题
    await listGoods();//逛新品
    await shopInfo();//逛店铺
    await listMeeting();//逛会场
    await doHelp();
    await myRank();//领取往期排名奖励
    await getListJbean();
    await getListRank();
    await getListIntegral();
    await showMsg()
  } catch (e) {
    $.logErr(e)
  }
}
function listMeeting() {
  const options = {
    'url': `${JD_API_HOST}task/listMeeting?t=${Date.now()}`,
    'headers': {
      'Host': 'rdcseason.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'Connection':' keep-alive',
      'Cookie': cookie,
      'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      'Accept-Language': 'zh-cn',
      'Referer': `https://rdcseason.m.jd.com/?reloadWQPage=t_${Date.now()}`,
      'Accept-Encoding': 'gzip, deflate, br'
    }
  }
  return new Promise((resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          // console.log('ddd----ddd', data.code)
          if (data.code === 200 && data.data.meetingList) {
            let integralNum = 0, jdNum = 0;
            for (let item of data.data.meetingList) {
              let res = await browseMeeting(item.id);
              if (res.code === 200) {
                let res2 = await getMeetingPrize(item.id);
                integralNum += res2.data.integralNum * 1;
                jdNum += res2.data.jdNum * 1;
              }
              // await browseMeeting('1596206323911');
              // await getMeetingPrize('1596206323911');
            }
            console.log(`逛会场--获得积分:${integralNum}`)
            console.log(`逛会场--获得京豆:${jdNum}`)
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
function listGoods() {
  const options = {
    'url': `${JD_API_HOST}task/listGoods?t=${Date.now()}`,
    'headers': {
      'Host': 'rdcseason.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'Connection':' keep-alive',
      'Cookie': cookie,
      'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      'Accept-Language': 'zh-cn',
      'Referer': `https://rdcseason.m.jd.com/?reloadWQPage=t_${Date.now()}`,
      'Accept-Encoding': 'gzip, deflate, br'
    }
  }
  return new Promise( (resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        // console.log('data1', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200 && data.data.goodsList) {
            let integralNum = 0, jdNum = 0;
            for (let item of data.data.goodsList) {
              let res = await browseGoods(item.id);
              if (res.code === 200) {
                let res2 = await getGoodsPrize(item.id);
                // console.log('逛新品领取奖励res2', res2);
                integralNum += res2.data.integralNum * 1;
                jdNum += res2.data.jdNum * 1;
              }
            }
            console.log(`逛新品获得积分:${integralNum}`)
            console.log(`逛新品获得京豆:${jdNum}`)
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
function shopInfo() {
  const options = {
    'url': `${JD_API_HOST}task/shopInfo?t=${Date.now()}`,
    'headers': {
      'Host': 'rdcseason.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'Connection':' keep-alive',
      'Cookie': cookie,
      'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      'Accept-Language': 'zh-cn',
      'Referer': `https://rdcseason.m.jd.com/?reloadWQPage=t_${Date.now()}`,
      'Accept-Encoding': 'gzip, deflate, br'
    }
  }
  return new Promise( (resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        // console.log('data1', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200 && data.data) {
            let integralNum = 0, jdNum = 0;
            for (let item of data.data) {
              let res = await browseShop(item.shopId);
              // console.log('res', res)
              // res = JSON.parse(res);
              // console.log('res', res.code)
              if (res.code === 200) {
                // console.log('---')
                let res2 = await getShopPrize(item.shopId);
                // console.log('res2', res2);
                // res2 = JSON.parse(res2);
                integralNum += res2.data.integralNum * 1;
                jdNum += res2.data.jdNum * 1;
              }
            }
            console.log(`逛店铺获得积分:${integralNum}`)
            console.log(`逛店铺获得京豆:${jdNum}`)
          }
        }
        // console.log('data1', data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    })
  })

}
function browseGoods(id) {
  const options = {
    "url": `${JD_API_HOST}task/browseGoods?t=${Date.now()}&skuId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.get(options, (err, resp, data) => {
      try {
        // console.log('data1', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
        }
        // console.log('data1', data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function getGoodsPrize(id) {
  const options = {
    "url": `${JD_API_HOST}task/getGoodsPrize?t=${Date.now()}&skuId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.get(options, (err, resp, data) => {
      try {
        // console.log('data1', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
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
function browseShop(id) {
  const options2 = {
    "url": `${JD_API_HOST}task/browseShop`,
    "body": `shopId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.post(options2, (err, resp, data) => {
      try {
        // console.log('data1', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
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
function getShopPrize(id) {
  const options = {
    "url": `${JD_API_HOST}task/getShopPrize`,
    "body": `shopId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        // console.log('getShopPrize', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
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

function browseMeeting(id) {
  const options2 = {
    "url": `${JD_API_HOST}task/browseMeeting`,
    "body": `meetingId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.post(options2, (err, resp, data) => {
      try {
        // console.log('点击浏览会场', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
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
function getMeetingPrize(id) {
  const options = {
    "url": `${JD_API_HOST}task/getMeetingPrize`,
    "body": `meetingId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        // console.log('getMeetingPrize', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
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
function myRank() {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/myRank?t=${Date.now()}`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com/",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.jbeanNum = '';
    $.get(options, async (err, resp, data) => {
      try {
        // console.log('查询获奖列表data', data);
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200 && data.data.myHis) {
            for (let i = 0; i < data.data.myHis.length; i++) {
              $.date = data.data.myHis[0].date;
              if (data.data.myHis[i].status === '21') {
                await $.wait(1000);
                console.log('开始领奖')
                let res = await saveJbean(data.data.myHis[i].id);
                // console.log('领奖结果', res)
                if (res.code === 200 && res.data.rsCode === 200) {
                  // $.jbeanNum += Number(res.data.jbeanNum);
                  console.log(`${data.data.myHis[i].date}日奖励领取成功${JSON.stringify(res.data.jbeanNum)}`)
                }
              }
              if (i === 0 && data.data.myHis[i].status === '22') {
                $.jbeanNum = data.data.myHis[i].prize;
              }
            }
            // for (let item of data.data.myHis){
            //   if (item.status === '21') {
            //     await $.wait(1000);
            //     console.log('开始领奖')
            //     let res = await saveJbean(item.id);
            //     // console.log('领奖结果', res)
            //     if (res.code === 200 && res.data.rsCode === 200) {
            //       $.jbeanNum += Number(res.data.jbeanNum);
            //     }
            //   }
            // }
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
function saveJbean(id) {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/saveJbean`,
      "body": `prizeId=${id}`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com/",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
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
  console.log(`脚本自带助力码数量:${helpCode.length}`)
  let body = '', nowTime = Date.now(), tempCode = [];
  const zone = new Date().getTimezoneOffset();
  if (zone === 0) {
    nowTime += 28800000;//UTC-0时区加上8个小时
  }
  // await updateShareCodes();
  // if (!$.updatePkActivityIdRes) await updateShareCodesCDN();
  if ($.updatePkActivityIdRes && $.updatePkActivityIdRes['shareCodes']) tempCode = $.updatePkActivityIdRes['shareCodes'];
  console.log(`是否大于当天九点🕘:${nowTime > new Date(nowTime).setHours(9, 0, 0, 0)}`)
  //当天大于9:00才从API里面取收集的助力码
  //if (nowTime > new Date(nowTime).setHours(9, 0, 0, 0)) body = await printAPI();//访问收集的互助码
  body = await printAPI();//访问收集的互助码
  if (body && body['data']) {
    // console.log(`printAPI返回助力码数量:${body.replace(/"/g, '').split(',').length}`)
    // tempCode = tempCode.concat(body.replace(/"/g, '').split(','))
    tempCode = [...tempCode, ...body['data']]
  }
  console.log(`累计助力码数量:${tempCode.length}`)
  //去掉重复的
  tempCode = [...new Set(tempCode)];
  console.log(`去重后总助力码数量:${tempCode.length}`)
  for (let item of tempCode) {
    if (!item) continue;
    const helpRes = await toHelp(item.trim());
    if (helpRes.data.status === 5) {
      console.log(`助力机会已耗尽，跳出助力`);
      break;
    }
  }
}
function printAPI() {
  return new Promise(resolve => {
    $.get({url: `${printUrl}`, 'timeout': 10000}, (err, resp, data) => {
      try {
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
function toHelp(code) {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/toHelp`,
      "body": `shareId=${code}`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://rdcseason.m.jd.com",
        "Accept-Encoding": "gzip, deflate, br",
        "Cookie": cookie,
        "Connection": "keep-alive",
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
        "Referer": "https://rdcseason.m.jd.com/",
        "Content-Length": "44",
        "Accept-Language": "zh-cn"
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`助力结果:${data}`);
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
function getHelp() {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/getHelp?t=${Date.now()}`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            console.log(`\n您的助力码shareId(互助码每天都是变化的)\n\n"${data.data.shareId}",\n`);
            // console.log(`每日9:00以后复制下面的URL链接在浏览器里面打开一次就能自动上车\n\n${addUrl}${data.data.shareId}\n`);
            let ctrTemp;
            if ($.isNode() && process.env.JD_818_SHAREID_NOTIFY) {
              console.log(`环境变量JD_818_SHAREID_NOTIFY::${process.env.JD_818_SHAREID_NOTIFY}`)
              ctrTemp = `${process.env.JD_818_SHAREID_NOTIFY}` === 'true';
            } else {
              ctrTemp = `${jdNotify}` === 'true';
            }
            // console.log(`是否发送上车推送链接:${ctrTemp ? '是' : '否'}`)
            // // 只在早晨9点钟触发一次
            // let NowHours = new Date().getHours();
            // const zone = new Date().getTimezoneOffset();
            // if (zone === 0) {
            //   NowHours += 8;//UTC-0时区加上8个小时
            // }
            // if (ctrTemp && NowHours === 9 && $.isNode()) await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}互助码自动上车`, `[9:00之后上车]您的互助码上车链接是 ↓↓↓ \n\n ${addUrl}${data.data.shareId} \n\n ↑↑↑`, {
            //   url: `${addUrl}${data.data.shareId}`
            // })
            // await $.http.get({url: `http://jd.turinglabs.net/helpcode/add/${data.data.shareId}/`}).then((resp) => {
            //   console.log(resp);
            //   return
            //   if (resp.statusCode === 200) {
            //     const { body } = resp;
            //   }
            // });
            $.temp.push(data.data.shareId);
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
//获取当前活动总京豆数量
function getListJbean() {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/listJbean?pageNum=1`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            $.jbeanCount = data.data.jbeanCount;
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

function getListIntegral() {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/listIntegral?pageNum=1`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            $.integralCount = data.data.integralCount;
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
    const options = {
      "url": `${JD_API_HOST}task/listRank?t=${Date.now()}`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            if (data.data.my) {
              $.integer = data.data.my.integer;
              $.num = data.data.my.num;
            }
            if (data.data.last) {
              $.lasNum = data.data.last.num;
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
function updateShareCodes(url = 'https://raw.githubusercontent.com/xxxx/updateTeam/master/jd_shareCodes.json') {
  return new Promise(resolve => {
    $.get({url}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          $.updatePkActivityIdRes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function updateShareCodesCDN(url = 'https://cdn.jsdelivr.net/gh/gitupdate/updateTeam@master/shareCodes/jd_shareCodes.json') {
  return new Promise(resolve => {
    $.get({url , headers:{"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('../USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")}}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.updatePkActivityIdRes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
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
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1"
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
async function showMsg() {
  let nowTime = new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000;
  if (nowTime > new Date(activeEndTime).getTime()) {
    $.msg($.name, '活动已结束', `该活动累计获得京豆：${$.jbeanCount}个\n请删除此脚本\n咱江湖再见`);
    if ($.isNode()) await notify.sendNotify($.name + '活动已结束', `请删除此脚本\n咱江湖再见`)
  } else {
    $.msg($.name, `京东账号${$.index} ${$.nickName || $.UserName}`, `${$.jbeanCount ? `${$.integer ? `当前获得积分：${$.integer}个\n` : ''}${$.num ? `当前排名：${$.num}\n` : ''}当前参赛人数：${$.lasNum}人\n累计获得京豆：${$.jbeanCount}个🐶\n` : ''}${$.jbeanCount ? `累计获得积分：${$.integralCount}个\n` : ''}${$.jbeanNum ? `${$.date}日奖品：${$.jbeanNum}\n` : ''}具体详情点击弹窗跳转后即可查看`, {"open-url": "https://rdcseason.m.jd.com/#/hame"});
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
