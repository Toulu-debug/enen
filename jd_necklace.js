/* 
点点券，可以兑换无门槛红包（1元，5元，10元，100元，部分红包需抢购） 
Last Modified time: 2021-06-21  
活动入口：京东APP-领券中心/券后9.9-领点点券 [活动地址](https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html) 
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js 
===============Quantumultx=============== 
[task_local] 
#点点券 
10 0,20 * * * jd_necklace.js, tag=点点券, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true 
================Loon============== 
[Script] 
cron "10 0,20 * * *" script-path=jd_necklace.js,tag=点点券 
===============Surge================= 
点点券 = type=cron,cronexp="10 0,20 * * *",wake-system=1,timeout=3600,script-path=jd_necklace.js 
============小火箭========= 
点点券 = type=cron,script-path=jd_necklace.js, cronexpr="10 0,20 * * *", timeout=3600, enable=true 
 */ 
const $ = new Env('点点券'); 
let allMessage = ``; 
const notify = $.isNode() ? require('./sendNotify') : ''; 
//Node.js用户请在jdCookie.js处填写京东ck; 
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : ''; 
const openUrl = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html%22%20%7D` 
let message = ''; 
let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000); 
//IOS等用户直接用NobyDa的jd cookie 
let cookiesArr = [], cookie = ''; 

const https = require('https'); 
const fs = require('fs/promises'); 
const { R_OK } = require('fs').constants; 
const vm = require('vm'); 
const UA = require('./USER_AGENTS.js').USER_AGENT; 

const URL = 'https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html'; 
const REG_SCRIPT = /<script src="([^><]+\/(main\.\w+\.js))\?t=\d+">/gm; 
const REG_ENTRY = /^(.*?\.push\(\[)(\d+,\d+)/; 
const REG_PIN = /pt_pin=(\w+?);/m; 
const KEYWORD_MODULE = 'get_risk_result:'; 
const DATA = {appid:'50082',sceneid:'DDhomePageh5'}; 
let smashUtils; 

class ZooFakerNecklace { 
    constructor(cookie, action) { 
        this.cookie = cookie; 
        this.action = action; 
    } 

    async run(data) { 
        if (!smashUtils) { 
            await this.init(); 
        } 

        const t = Math.floor(1e+6 * Math.random()).toString().padEnd(6, '8'); 
        const pin = this.cookie.match(REG_PIN)[1]; 
        const { log } = smashUtils.get_risk_result({ 
            id: this.action, 
            data: { 
                ...data, 
                pin, 
                random: t, 
            } 
        }); 
        const body = { 
            ...data, 
            random: t, 
            extraData: { log, sceneid: DATA.sceneid }, 
        }; 

        // console.log(body); 
        return body; 
    } 

    async init() { 
        console.time('ZooFakerNecklace'); 
        process.chdir(__dirname); 
        const html = await ZooFakerNecklace.httpGet(URL); 
        const script = REG_SCRIPT.exec(html); 

        if (script) { 
            const [, scriptUrl, filename] = script; 
            const jsContent = await this.getJSContent(filename, scriptUrl); 
            const fnMock = new Function; 
            const ctx = { 
                window: { addEventListener: fnMock }, 
                document: { 
                    addEventListener: fnMock, 
                    removeEventListener: fnMock, 
                    cookie: this.cookie, 
                }, 
                navigator: { userAgent: UA }, 
            }; 
            const _this = this; 
            Object.defineProperty(ctx.document,'cookie',{ 
                get() { 
                    return _this.cookie; 
                }, 
            }); 

            vm.createContext(ctx); 
            vm.runInContext(jsContent, ctx); 

            smashUtils = ctx.window.smashUtils; 
            smashUtils.init(DATA); 

            // console.log(ctx); 
        } 

        // console.log(html); 
        // console.log(script[1],script[2]); 
        console.timeEnd('ZooFakerNecklace'); 
    } 

    async getJSContent(cacheKey, url) { 
        try { 
            await fs.access(cacheKey, R_OK); 
            const rawFile = await fs.readFile(cacheKey, { encoding: 'utf8' }); 

            return rawFile; 
        } catch (e) { 
            let jsContent = await ZooFakerNecklace.httpGet(url); 
            const findEntry = REG_ENTRY.test(jsContent); 
            const ctx = { 
                moduleIndex: 0, 
            }; 
            const injectCode = `moduleIndex=arguments[0].findIndex(s=>s&&s.toString().indexOf('${KEYWORD_MODULE}')>0);return;`; 
            const injectedContent = jsContent.replace(/^(!function\(\w\){)/, `$1${injectCode}`); 

            vm.createContext(ctx); 
            vm.runInContext(injectedContent, ctx); 

            if (!(ctx.moduleIndex && findEntry)) { 
                throw new Error('Module not found.'); 
            } 
            jsContent = jsContent.replace(REG_ENTRY, `$1${ctx.moduleIndex},1`); 
            // Fix device info (actually insecure, make less sense) 
            jsContent = jsContent.replace(/\w+\.getDefaultArr\(7\)/, '["a","a","a","a","a","a","1"]'); 
            fs.writeFile(cacheKey, jsContent); 
            return jsContent; 

            REG_ENTRY.lastIndex = 0; 
            const entry = REG_ENTRY.exec(jsContent); 

            console.log(ctx.moduleIndex); 
            console.log(entry[2]); 
        } 
    } 

    static httpGet(url) { 
        return new Promise((resolve, reject) => { 
            const protocol = url.indexOf('http') !== 0 ? 'https:' : ''; 
            const req = https.get(protocol + url, (res) => { 
                res.setEncoding('utf-8'); 

                let rawData = ''; 

                res.on('error', reject); 
                res.on('data', chunk => rawData += chunk); 
                res.on('end', () => resolve(rawData)); 
            }); 

            req.on('error', reject); 
            req.end(); 
        }); 
    } 
} 

async function getBody($ = {}) { 
    let riskData; 
    switch ($.action) { 
        case 'startTask': 
            riskData = { taskId: $.id }; 
            break; 
        case 'chargeScores': 
            riskData = { bubleId: $.id }; 
            break; 
        case 'sign': 
            riskData = {}; 
        default: 
            break; 
    } 
    const zf = new ZooFakerNecklace($.cookie, $.action); 
    const log = await zf.run(riskData); 

    return log 
} 

if ($.isNode()) { 
  Object.keys(jdCookieNode).forEach((item) => { 
    cookiesArr.push(jdCookieNode[item]) 
  }) 
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {}; 
} else { 
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item); 
} 

const JD_API_HOST = 'https://api.m.jd.com/api'; 
!(async () => { 
  if (!cookiesArr[0]) { 
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"}); 
    return; 
  } 
  for (let i = 0; i < cookiesArr.length; i++) { 
    if (cookiesArr[i]) { 
      cookie = cookiesArr[i]; 
      $.cookie = cookie; 
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]) 
      $.index = i + 1; 
      $.isLogin = true; 
      $.nickName = ''; 
      message = ''; 
      await TotalBean(); 
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`); 
      if (!$.isLogin) { 
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"}); 

        if ($.isNode()) { 
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`); 
        } 
        continue 
      } 
      await jd_necklace(); 
    } 
  } 
  if ($.isNode() && allMessage) { 
    await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: openUrl }) 
  } 
})() 
    .catch((e) => { 
      $.log('', ` ${$.name}, 失败! 原因: ${e}!`, '') 
    }) 
    .finally(() => { 
      $.done(); 
    }) 
async function jd_necklace() { 
  try { 
    await necklace_homePage(); 
    await doTask(); 
    await sign(); 
    await necklace_homePage(); 
    await receiveBubbles(); 
    await necklace_homePage(); 
    // await necklace_exchangeGift($.totalScore);//自动兑换多少钱的无门槛红包，1000代表1元，默认兑换全部点点券 
    await showMsg(); 
  } catch (e) { 
    $.logErr(e) 
  } 
} 
function showMsg() { 
  return new Promise(async resolve => { 
    if (nowTimes.getHours() >= 20) { 
      $.msg($.name, '', `京东账号${$.index} ${$.nickName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n点击弹窗即可去兑换(注：此红包具有时效性)`, { 'open-url': openUrl}); 
    } 
    // 云端大于10元无门槛红包时进行通知推送 
    // if ($.isNode() && $.totalScore >= 20000 && nowTimes.getHours() >= 20) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `京东账号${$.index} ${$.nickName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n点击链接即可去兑换(注：此红包具有时效性)\n↓↓↓ \n\n ${openUrl} \n\n ↑↑↑`, { url: openUrl }) 
    if ($.isNode() && nowTimes.getHours() >= 20 && (process.env.DDQ_NOTIFY_CONTROL ? process.env.DDQ_NOTIFY_CONTROL === 'false' : !!1)) { 
      allMessage += `京东账号${$.index} ${$.nickName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n(京东APP->领券->左上角点点券.注：此红包具有时效性)${$.index !== cookiesArr.length ? '\n\n' : `\n↓↓↓ \n\n "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html" \n\n ↑↑↑`}` 
      allMessage += `红包将在6.21日清空，请及时兑换` 
    } 
    resolve() 
  }) 
} 
async function doTask() { 
  for (let item of $.taskConfigVos) { 
    if (item.taskStage === 0) { 
      console.log(`【${item.taskName}】 任务未领取,开始领取此任务`); 
      $.action = 'startTask', $.id = item.id 
      let ss = await getBody($) 
      await necklace_startTask(ss); 
      console.log(`【${item.taskName}】 任务领取成功,开始完成此任务`); 
      await $.wait(1000); 
      await reportTask(item); 
    } else if (item.taskStage === 2) { 
      console.log(`【${item.taskName}】 任务已做完,奖励未领取`); 
    } else if (item.taskStage === 3) { 
      console.log(`${item.taskName}奖励已领取`); 
    } else if (item.taskStage === 1) { 
      console.log(`\n【${item.taskName}】 任务已领取但未完成,开始完成此任务`); 
      await reportTask(item); 
    } 
  } 
} 
async function receiveBubbles() { 
  for (let item of $.bubbles) { 
    console.log(`\n开始领取点点券`); 
    $.action = 'chargeScores', $.id = item.id 
    let ss = await getBody($) 
    await necklace_chargeScores(ss) 
  } 
} 
async function sign() { 
  if ($.signInfo.todayCurrentSceneSignStatus === 1) { 
    console.log(`\n开始每日签到`) 
    $.action = 'sign' 
    let ss = await getBody($) 
    await necklace_sign(ss); 
  } else { 
    console.log(`当前${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}已签到`) 
  } 
} 
async function reportTask(item = {}) { 
  //普通任务 
  if (item['taskType'] === 2) await necklace_startTask(item.id, 'necklace_reportTask'); 
  //逛很多商品店铺等等任务 
  if (item['taskType'] === 6 || item['taskType'] === 8 || item['taskType'] === 5 || item['taskType'] === 9) { 
    //浏览精选活动任务 
    await necklace_getTask(item.id); 
    $.taskItems = $.taskItems.filter(value => !!value && value['status'] === 0); 
    for (let vo of $.taskItems) { 
      console.log(`浏览精选活动【${vo['title']}】`); 
      await necklace_startTask(item.id, 'necklace_reportTask', vo['id']); 
    } 
  } 
  //首页浏览XX秒的任务 
  if (item['taskType'] === 3) await doAppTask('3', item.id); 
  if (item['taskType'] === 4) await doAppTask('4', item.id); 
} 
//每日签到福利 
function necklace_sign(body) { 
  return new Promise(resolve => { 
    // const body = { 
    //   currentDate: $.lastRequestTime.replace(/:/g, "%3A"), 
    // } 
    $.post(taskPostUrl("necklace_sign", body), async (err, resp, data) => { 
      try { 
        if (err) { 
          console.log(`${JSON.stringify(err)}`) 
          console.log(`${$.name} API请求失败，请检查网路重试`) 
        } else { 
          if (safeGet(data)) { 
            data = JSON.parse(data); 
            if (data.rtn_code === 0) { 
              if (data.data.biz_code === 0) { 
                console.log(`签到成功，时间：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}`) 
                // $.taskConfigVos = data.data.result.taskConfigVos; 
                // $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs; 
              } 
            } else { 
              console.log(`每日签到失败：${JSON.stringify(data)}\n`); 
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
//兑换无门槛红包 
function necklace_exchangeGift(scoreNums) { 
  return new Promise(resolve => { 
    const body = { 
      scoreNums, 
      "giftConfigId": 31, 
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"), 
    } 
    $.post(taskPostUrl("necklace_exchangeGift", body), async (err, resp, data) => { 
      try { 
        if (err) { 
          console.log(`${JSON.stringify(err)}`) 
          console.log(`${$.name} API请求失败，请检查网路重试`) 
        } else { 
          if (safeGet(data)) { 
            data = JSON.parse(data); 
            if (data.rtn_code === 0) { 
              if (data.data.biz_code === 0) { 
                const { result } = data.data; 
                message += `${result.redpacketTitle}：${result.redpacketAmount}元兑换成功\n`; 
                message += `红包有效期：${new Date(result.endTime + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString('zh', {hour12: false})}`; 
                console.log(message) 
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
//领取奖励 
function necklace_chargeScores(bubleId) { 
  return new Promise(resolve => { 
    // const body = { 
    //   bubleId, 
    //   currentDate: $.lastRequestTime.replace(/:/g, "%3A"), 
    // } 
    let body = bubleId 
    $.post(taskPostUrl("necklace_chargeScores", body), async (err, resp, data) => { 
      try { 
        if (err) { 
          console.log(`${JSON.stringify(err)}`) 
          console.log(`${$.name} API请求失败，请检查网路重试`) 
        } else { 
          if (safeGet(data)) { 
            data = JSON.parse(data); 
            if (data.rtn_code === 0) { 
              if (data.data.biz_code === 0) { 
                // $.taskConfigVos = data.data.result.taskConfigVos; 
                // $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs; 
              } 
            } else { 
              console.log(`领取点点券失败：${JSON.stringify(data)}\n`) 
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
function necklace_startTask(taskId, functionId = 'necklace_startTask', itemId = "") { 
  return new Promise(resolve => { 
    let body 
    if (functionId === 'necklace_startTask') { 
      body = taskId 
    } else { 
      body = { 
        taskId, 
        currentDate: $.lastRequestTime.replace(/:/g, "%3A"), 
      } 
    } 
    if (itemId) body['itemId'] = itemId; 
    $.post(taskPostUrl(functionId, body), async (err, resp, data) => { 
      try { 
        if (err) { 
          console.log(`${JSON.stringify(err)}`) 
          console.log(`${$.name} API请求失败，请检查网路重试`) 
        } else { 
          console.log(`${functionId === 'necklace_startTask' ? '领取任务结果' : '做任务结果'}：${data}`); 
          if (safeGet(data)) { 
            data = JSON.parse(data); 
            if (data.rtn_code === 0) { 
              if (data.data.biz_code === 0) { 
                // $.taskConfigVos = data.data.result.taskConfigVos; 
                // $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs; 
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
function necklace_getTask(taskId) { 
  return new Promise(resolve => { 
    const body = { 
      taskId, 
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"), 
    } 
    $.taskItems = []; 
    $.post(taskPostUrl("necklace_getTask", body), async (err, resp, data) => { 
      try { 
        if (err) { 
          console.log(`${JSON.stringify(err)}`) 
          console.log(`${$.name} API请求失败，请检查网路重试`) 
        } else { 
          if (safeGet(data)) { 
            data = JSON.parse(data); 
            if (data.rtn_code === 0) { 
              if (data.data.biz_code === 0) { 
                $.taskItems = data.data.result && data.data.result.taskItems; 
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

function necklace_homePage() { 
  $.taskConfigVos = []; 
  $.bubbles = []; 
  $.signInfo = {}; 
  return new Promise(resolve => { 
    $.post(taskPostUrl('necklace_homePage'), async (err, resp, data) => { 
      try { 
        if (err) { 
          console.log(`${JSON.stringify(err)}`) 
          console.log(`${$.name} API请求失败，请检查网路重试`) 
        } else { 
          if (safeGet(data)) { 
            data = JSON.parse(data); 
            if (data.rtn_code === 0) { 
              if (data.data.biz_code === 0) { 
                $.taskConfigVos = data.data.result.taskConfigVos; 
                $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs; 
                $.lastRequestTime = data.data.result.lastRequestTime; 
                $.bubbles = data.data.result.bubbles; 
                $.signInfo = data.data.result.signInfo; 
                $.totalScore = data.data.result.totalScore; 
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

async function doAppTask(type = '3', id) { 
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
    "taskType": "2", 
    "childActivityUrl": "openapp.jdmobile%3a%2f%2fvirtual%3fparams%3d%7b%5c%22category%5c%22%3a%5c%22jump%5c%22%2c%5c%22des%5c%22%3a%5c%22couponCenter%5c%22%7d", 
    "pageClickKey": "CouponCenter", 
    "lat": "", 
    "taskId": "necklace_" + id, 
    "lng": "", 
  } 
  if (type === '4') { 
    console.log('需等待30秒') 
    await $.wait(15000); 
  } else { 
    console.log('需等待15秒') 
  } 
  await $.wait(15500); 
  await getCcTaskList('reportCcTask', body, type); 
} 
function getCcTaskList(functionId, body, type = '3') { 
  let url = ''; 
  return new Promise(resolve => { 
    if (functionId === 'getCcTaskList') { 
      url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1614320848090&sign=d3259c0c19f6c792883485ae65f8991c&sv=111` 
    } 
    if (type === '3' && functionId === 'reportCcTask') url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1622194121039&sign=d565c4594b8e05645f1fe9a495ac7a7d&sv=122` 
    if (type === '4' && functionId === 'reportCcTask') url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1622193986049&sign=f5abd9fd7b9b8abaa25b34088f9e8a54&sv=102` 
    // if (functionId === 'reportCcTask') { 
    //   url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1614320901023&sign=26e637ba072ddbcfa44c5273ef928696&sv=111` 
    // } 
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
    $.post((options), async (err, resp, data) => { 
      try { 
        if (err) { 
          console.log(`${JSON.stringify(err)}`) 
          console.log(`${$.name} API请求失败，请检查网路重试`) 
        } else { 
          if (safeGet(data)) { 
            if (type === '3' && functionId === 'reportCcTask') console.log(`点击首页领券图标(进入领券中心浏览15s)任务:${data}`) 
            if (type === '4' && functionId === 'reportCcTask') console.log(`点击“券后9.9”任务:${data}`) 
            // data = JSON.parse(data); 
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
function taskPostUrl(function_id, body = {}) { 
  const time = new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000; 
  return { 
    url: `${JD_API_HOST}?functionId=${function_id}&appid=coupon-necklace&loginType=2&client=coupon-necklace&t=${time}&body=${escape(JSON.stringify(body))}&uuid=88732f840b77821b345bf07fd71f609e6ff12f43`, 
    // url: `${JD_API_HOST}?functionId=${function_id}&appid=jd_mp_h5&loginType=2&client=jd_mp_h5&t=${time}&body=${escape(JSON.stringify(body))}`, 
    headers: { 
      "accept": "*/*", 
      "accept-encoding": "gzip, deflate, br", 
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6", 
      "content-length": "0", 
      "cookie": cookie, 
      "origin": "https://h5.m.jd.com", 
      "referer": "https://h5.m.jd.com/", 
      "sec-fetch-dest": "empty", 
      "sec-fetch-mode": "cors", 
      "sec-fetch-site": "same-site", 
      "user-agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1") 
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1") 
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
// prettier-ignore 
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============系统通知=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`${this.name}, 错误!`,t.stack):this.log("",`${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`${this.name}, 结束! ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
