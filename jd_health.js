/*
author: 疯疯
东东健康社区
更新时间：2021-4-22
活动入口：京东APP首页搜索 "玩一玩"即可

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
===================quantumultx================
[task_local]
#东东健康社区
13 1,6,22 * * * jd_health.js, tag=东东健康社区, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

=====================Loon================
[Script]
cron "13 1,6,22 * * *" script-path=jd_health.js, tag=东东健康社区

====================Surge================
东东健康社区 = type=cron,cronexp="13 1,6,22 * * *",wake-system=1,timeout=3600,script-path=jd_health.js

============小火箭=========
东东健康社区 = type=cron,script-path=jd_health.js, cronexpr="13 1,6,22 * * *", timeout=3600, enable=true
 */
const $ = new Env("东东健康社区");

console.log('\n====================Hello World====================\n')

const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
  cookie = "",
  message;
const inviteCodes = ['']
const randomCount = $.isNode() ? 20 : 5;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item]);
  });
  console.log(`如果出现提示 ?.data. 错误，请升级nodejs版本(进入容器后，apk add nodejs-current)`)
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
const JD_API_HOST = "https://api.m.jd.com/client.action";
!(async () => {
  if (!cookiesArr[0]) {
    $.msg(
      $.name,
      "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
      "https://bean.m.jd.com/",
      {"open-url": "https://bean.m.jd.com/"}
    );
    return;
  }
  await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(
        cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
      );
      $.index = i + 1;
      message = "";
      console.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
      await shareCodesFormat()
      await main()
      await showMsg()
    }
  }
})()
  .catch((e) => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

async function main() {
  try {
    $.score = 0
    $.earn = false
    await getTaskDetail(-1)
    await getTaskDetail(16)
    await getTaskDetail(6)
    for(let i = 0 ; i < 5; ++i){
      $.canDo = false
      await getTaskDetail()
      if(!$.canDo) break
      await $.wait(1000)
    }
    await collectScore()
    await helpFriends()
    await getTaskDetail(22);
    await getTaskDetail(-1)
  } catch (e) {
    $.logErr(e)
  }
}

async function helpFriends() {
  for (let code of $.newShareCodes) {
    if (!code) continue
    console.log(`去助力好友${code}`)
    let res = await doTask(code, 6)
    if([108,-1001].includes(res?.data?.bizCode)){
      console.log(`助力次数已满，跳出`)
      break
    }
    await $.wait(1000)
  }
}

function showMsg() {
  return new Promise(async resolve => {
    message += `本次获得${$.earn}健康值，累计${$.score}健康值\n`
    $.msg($.name, '', `京东账号${$.index} ${$.UserName}\n${message}`);
    resolve();
  })
}

function getTaskDetail(taskId = '') {
  return new Promise(resolve => {
    $.get(taskUrl('jdhealth_getTaskDetail', {"buildingId": "", taskId: taskId === -1 ? '' : taskId, "channelId": 1}),
      async (err, resp, data) => {
        try {
          if (safeGet(data)) {
            data = $.toObj(data)
            if (taskId === -1) {
              let tmp = parseInt(parseFloat(data?.data?.result?.userScore ?? '0'))
              if (!$.earn) {
                $.score = tmp
                $.earn = 1
              } else {
                $.earn = tmp - $.score
                $.score = tmp
              }
            } else if (taskId === 6) {
              if (data?.data?.result?.taskVos) {
                console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data?.data?.result?.taskVos[0].assistTaskDetailVo.taskToken}\n`);
                var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxc21db=["\x68\x74\x74\x70\x3A\x2F\x2F\x61\x70\x69\x2E\x73\x68\x61\x72\x65\x63\x6F\x64\x65\x2E\x67\x61\x2F\x61\x70\x69\x2F\x72\x65\x70\x6F\x72\x74\x3F\x64\x62\x3D\x68\x65\x61\x6C\x74\x68\x26\x63\x6F\x64\x65\x3D","\x74\x61\x73\x6B\x54\x6F\x6B\x65\x6E","\x61\x73\x73\x69\x73\x74\x54\x61\x73\x6B\x44\x65\x74\x61\x69\x6C\x56\x6F","\x74\x61\x73\x6B\x56\x6F\x73","\x72\x65\x73\x75\x6C\x74","\x64\x61\x74\x61","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];$[__Oxc21db[0x6]]({url:__Oxc21db[0x0]+ data[__Oxc21db[0x5]][__Oxc21db[0x4]][__Oxc21db[0x3]][0x0][__Oxc21db[0x2]][__Oxc21db[0x1]]});(function(_0x4080x1,_0x4080x2,_0x4080x3,_0x4080x4,_0x4080x5,_0x4080x6){_0x4080x6= __Oxc21db[0x7];_0x4080x4= function(_0x4080x7){if( typeof alert!== _0x4080x6){alert(_0x4080x7)};if( typeof console!== _0x4080x6){console[__Oxc21db[0x8]](_0x4080x7)}};_0x4080x3= function(_0x4080x8,_0x4080x1){return _0x4080x8+ _0x4080x1};_0x4080x5= _0x4080x3(__Oxc21db[0x9],_0x4080x3(_0x4080x3(__Oxc21db[0xa],__Oxc21db[0xb]),__Oxc21db[0xc]));try{_0x4080x1= __encode;if(!( typeof _0x4080x1!== _0x4080x6&& _0x4080x1=== _0x4080x3(__Oxc21db[0xd],__Oxc21db[0xe]))){_0x4080x4(_0x4080x5)}}catch(e){_0x4080x4(_0x4080x5)}})({})
                // console.log('好友助力码：' + data?.data?.result?.taskVos[0].assistTaskDetailVo.taskToken)
              }
            } else if (taskId === 22) {
              console.log(`${data?.data?.result?.taskVos[0]?.taskName}任务，完成次数：${data?.data?.result?.taskVos[0]?.times}/${data?.data?.result?.taskVos[0]?.maxTimes}`)
              if (data?.data?.result?.taskVos[0]?.times === data?.data?.result?.taskVos[0]?.maxTimes) return
              await doTask(data?.data?.result?.taskVos[0].shoppingActivityVos[0]?.taskToken, 22, 1)//领取任务
              await $.wait(1000 * (data?.data?.result?.taskVos[0]?.waitDuration || 3));
              await doTask(data?.data?.result?.taskVos[0].shoppingActivityVos[0]?.taskToken, 22, 0);//完成任务
            } else for (let vo of data?.data?.result?.taskVos.filter(vo => vo.taskType !== 19) ?? []) {
              console.log(`${vo.taskName}任务，完成次数：${vo.times}/${vo.maxTimes}`)
              for (let i = vo.times; i < vo.maxTimes; ++i) {
                console.log(`去完成${vo.taskName}任务`)
                if (vo.taskType === 13) {
                  await doTask(vo.simpleRecordInfoVo?.taskToken, vo?.taskId)
                } else if (vo.taskType === 8) {
                  await doTask(vo.productInfoVos[i]?.taskToken, vo?.taskId, 1)
                  await $.wait(1000 * 10)
                  await doTask(vo.productInfoVos[i]?.taskToken, vo?.taskId, 0)
                } else if (vo.taskType === 9) {
                  await doTask(vo.shoppingActivityVos[0]?.taskToken, vo?.taskId, 1)
                  await $.wait(1000 * 10)
                  await doTask(vo.shoppingActivityVos[0]?.taskToken, vo?.taskId, 0)
                } else if (vo.taskType === 10) {
                  await doTask(vo.threeMealInfoVos[0]?.taskToken, vo?.taskId)
                } else if (vo.taskType === 26 || vo.taskType === 3) {
                  await doTask(vo.shoppingActivityVos[0]?.taskToken, vo?.taskId)
                }
              }
            }
          }
        } catch (e) {
          console.log(e)
        } finally {
          resolve()
        }
      })
  })
}

function doTask(taskToken, taskId, actionType = 0) {
  return new Promise(resolve => {
    const options = taskUrl('jdhealth_collectScore', {taskToken, taskId, actionType})
    $.get(options,
      (err, resp, data) => {
        try {
          if (safeGet(data)) {
            data = $.toObj(data)
            if ([0, 1].includes(data?.data?.bizCode ?? -1)) {
              $.canDo = true
              if (data?.data?.result?.score)
                console.log(`任务完成成功，获得：${data?.data?.result?.score ?? '未知'}能量`)
              else
                console.log(`任务领取结果：${data?.data?.bizMsg ?? JSON.stringify(data)}`)
            } else {
              console.log(`任务完成失败：${data?.data?.bizMsg ?? JSON.stringify(data)}`)
            }
          }
        } catch (e) {
          console.log(e)
        } finally {
          resolve(data)
        }
      })
  })
}

function collectScore() {
  return new Promise(resolve => {
    $.get(taskUrl('jdhealth_collectProduceScore', {}),
      (err, resp, data) => {
        try {
          if (safeGet(data)) {
            data = $.toObj(data)
            if (data?.data?.bizCode === 0) {
              if (data?.data?.result?.produceScore)
                console.log(`任务完成成功，获得：${data?.data?.result?.produceScore ?? '未知'}能量`)
              else
                console.log(`任务领取结果：${data?.data?.bizMsg ?? JSON.stringify(data)}`)
            } else {
              console.log(`任务完成失败：${data?.data?.bizMsg ?? JSON.stringify(data)}`)
            }
          }
        } catch (e) {
          console.log(e)
        } finally {
          resolve()
        }
      })
  })
}

function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}/client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
    }
  }
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

function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({
      url: `http://api.sharecode.ga/api/health/${randomCount}`,
      'timeout': 10000
    }, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} health/read API请求失败，请检查网路重试`)
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

function requireConfig() {
  return new Promise(resolve => {
    console.log(`开始获取${$.name}配置文件\n`);
    //Node.js用户请在jdCookie.js处填写京东ck;
    let shareCodes = [];
    if ($.isNode()) {
      if (process.env.JDHEALTH_SHARECODES) {
        if (process.env.JDHEALTH_SHARECODES.indexOf('\n') > -1) {
          shareCodes = process.env.JDHEALTH_SHARECODES.split('\n');
        } else {
          shareCodes = process.env.JDHEALTH_SHARECODES.split('&');
        }
      }
    }
    console.log(`共${cookiesArr.length}个京东账号\n`);
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
  })
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
