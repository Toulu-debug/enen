// author：疯疯
/*
球队赢好礼
默认：不加购物车，不注册店铺会员卡。
活动地址：https://mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct?id=tclTeamAct002&user_id=10299171
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============QuantumultX==============
[task_local]
#球队赢好礼
10 1 * * * jd_tcl.js, tag=球队赢好礼, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdyjd.png, enabled=true
=================Loon===============
[Script]
cron "10 1 * * *" script-path=jd_tcl.js,tag=球队赢好礼
=================Surge==============
[Script]
球队赢好礼 = type=cron,cronexp="10 1 * * *",wake-system=1,timeout=3600,script-path=jd_tcl.js

============小火箭=========
球队赢好礼 = type=cron,script-path=jd_tcl.js, cronexpr="10 1 * * *", timeout=3600, enable=true
*/

const $ = new Env("球队赢好礼");
const notify = $.isNode() ? require("./sendNotify") : "";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const sck = $.isNode() ? "set-cookie" : "Set-Cookie";
let cookiesArr = [],
  cookie = "",
  message;
let shareUUID= [
  '262AD0499F3DBB829A73A2D6A7C9B4F32616D531C3528AC13306F568F805BCBC98C78860AD2DDA6EACB606811A93B977D5541778D6BA2AAA3F72022FEF371B086688517369194A1C9489E6861B365E9DCC404E4905CE4ACDDDB48F49F13BFF8E',
  '262AD0499F3DBB829A73A2D6A7C9B4F32616D531C3528AC13306F568F805BCBC98C78860AD2DDA6EACB606811A93B977D5541778D6BA2AAA3F72022FEF371B086688517369194A1C9489E6861B365E9DCC404E4905CE4ACDDDB48F49F13BFF8E'
]
let isPurchaseShops = false
isPurchaseShops = $.isNode() ? (process.env.PURCHASE_SHOPS ? process.env.PURCHASE_SHOPS : isPurchaseShops) : ($.getdata("isPurchaseShops") ? $.getdata("isPurchaseShops") : isPurchaseShops);

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...jsonParse($.getdata("CookiesJD") || "[]").map((item) => item.cookie),
  ].filter((item) => !!item);
}
const JD_API_HOST = "https://api.m.jd.com/client.action";
!(async () => {
  if (!cookiesArr[0]) {
    $.msg(
      $.name,
      "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
      "https://bean.m.jd.com/",
      { "open-url": "https://bean.m.jd.com/" }
    );
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(
        cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
      );
      $.index = i + 1;
      message = "";
      console.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
      await genToken();
      await isvObfuscator();
      await setCookie();
      await main()
    }
  }
  if ($.isNode()) await notify.sendNotify(`${$.name}`, `${message}\n\n如需做注册店铺会员任务，请点击下方链接手动完成\nhttps%3A%2F%2Fmpdz-isv.isvjcloud.com%2Fql%2Ffront%2Ftcl002%2FloadTclAct%3Fid%3DtclTeamAct002%26user_id%3D10299171\n\nhttps://mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct?id=tclTeamAct002&user_id=10299171`);
})()
  .catch((e) => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function showMsg() {
  return new Promise(resolve => {
    $.log($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    resolve()
  })
}
async function main() {
  await loadAct()
  await helpFriend(shareUUID[Math.floor(Math.random() * 2)])
  await sign()
  await $.wait(1000)
  await getShopList()
  if (isPurchaseShops) await getGoodsList()
  await browse()
  await $.wait(1000)
  await browse(1)
  await $.wait(1000)
  await draw()
}

function helpFriend(inviterNickAes = '4C8602ED441A318612CD57B4A16EB59EE8AF00C05E1043CAA3E9C10B6DA615700C9463CE3D33670238160230F84D490EE29440149504E2EB1EAD11840F8E2980DDDA672BF446E2FCC0D1D6B4E52826D1') {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/helpFriend', `inviterNickAes=${inviterNickAes}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          console.log(data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function loadAct() {
  return new Promise((resolve) => {
    $.get(taskGetUrl(), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          //console.log(data)
          let id = data.match(/<input type="hidden" id="buyer_nick_code" name="buyer_nick_code" value="(.*)">/)
          //console.log('好友助力码' + id[1])
          if (data.indexOf('<div class="yourChoice">') === -1) {
            console.log(`未选择球队，去选择`)
            await chooseTeam()
          } else {
            console.log(`已选择球队`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function chooseTeam() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/chooseTeam', `team=0`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          console.log(`选择队伍结果：` + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function sign() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/goSign'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          console.log(`签到结果：` + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function browse(type = 0) {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/browesVenue', `type=${type}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          console.log(`浏览会场结果：` + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function getShopList() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/showshopload'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          for (let vo of data.data) {
            if (!vo.followFlag) {
              await browseShop(vo.id)
              await $.wait(1000)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function browseShop(shopId) {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/goBrowseShop', `shopId=${shopId}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          console.log('关注店铺结果：' + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function getGoodsList() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/showgoodsload'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          for (let vo of data.data) {
            if (!vo.itemFlag) {
              await goPlus(vo.skuId)
              await $.wait(1000)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function goPlus(goodId) {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/goplus', `goodId=${goodId}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          console.log('加入购物车结果：' + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function draw() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/drawTcl002', ``), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          message = '抽奖结果：' + data.msg
          console.log('抽奖结果：' + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function genToken() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=genToken',
    body: 'uuid=8888888&client=apple&clientVersion=9.5.2&st=1619194107036&sign=8feb09628c3c7a76dd0f2f8a694eaf79&sv=100&body=%7B%22to%22%3A%22https%3A//mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct%3Fid%3DtclTeamAct002%26user_id%3D10299171%26comeResource%3D10%26bizExtString%3D4C8602ED441A318612CD57B4A16EB59EE8AF00C05E1043CAA3E9C10B6DA615700C9463CE3D33670238160230F84D490EE29440149504E2EB1EAD11840F8E2980DDDA672BF446E2FCC0D1D6B4E52826D1%22%2C%22action%22%3A%22to%22%7D',
    headers: {
      Host: "api.m.jd.com",
      accept: "*/*",
      "user-agent": "JD4iPhone/167638 (iPhone; iOS 13.7; Scale/3.00)",
      "accept-language":
        "zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6",
      "content-type": "application/x-www-form-urlencoded",
      Cookie: cookie,
    },
  };
  return new Promise((resolve) => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API请求失败，请检查网路重试`);
          console.log(`${JSON.stringify(err)}`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.isvToken = data["tokenKey"];
            // console.log($.isvToken);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function isvObfuscator() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
    body: 'uuid=8888888&client=apple&clientVersion=9.5.2&st=1619194362037&sign=1f829aab2583c598c1b6b1feeec5fe05&sv=101&body=%7B%22url%22%3A%22https%3A//mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct%3Fid%3DtclTeamAct002%26user_id%3D10299171%26comeResource%3D10%26bizExtString%3D4C8602ED441A318612CD57B4A16EB59EE8AF00C05E1043CAA3E9C10B6DA615700C9463CE3D33670238160230F84D490EE29440149504E2EB1EAD11840F8E2980DDDA672BF446E2FCC0D1D6B4E52826D1%22%2C%22id%22%3A%22%22%7D',
    headers: {
      Host: "api.m.jd.com",
      accept: "*/*",
      "user-agent": "JD4iPhone/167638 (iPhone; iOS 13.7; Scale/3.00)",
      "accept-language":
        "zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6",
      "content-type": "application/x-www-form-urlencoded",
      Cookie: cookie,
    },
  };
  return new Promise((resolve) => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.token = data["token"];
            // console.log($.token);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function setCookie() {
  return new Promise((resolve) => {
    $.post(taskUrl('front/setMixNick', `strTMMixNick=${$.token}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          let setCookie = resp.headers[sck];
          let  dfs = setCookie.toString().match(/dfs=(.*?);/)[1];
          let  jwt = setCookie.toString().match(/jwt=(.*?);/)[1];
          cookie = `dfs=${dfs}; jwt=${jwt}; IsvToken=${$.token}`;
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function taskUrl(functionId, body) {
  return {
    url: `https://mpdz-isv.isvjcloud.com/${functionId}`,
    body: `userId=10299171&source=01&${body}`,
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      'Cookie': cookie,
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      Connection: "keep-alive",
      Host: "mpdz-isv.isvjcloud.com",
      "User-Agent": 'jdapp;iPhone;9.5.0;14.0.1;370c564f3ec5abbbe14f1f9f46ac73742fd56f58;network/wifi;ADID/4F7F967C-F9D8-41DE-902A-D87F8D45113A;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone11,8;addressid/33553535;supportBestPay/0;appBuild/167638;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'
    }
  }
}

function taskGetUrl() {
  return {
    url: `https://mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct?id=tclTeamAct002&user_id=10299171&comeResource=10&bizExtString=4C8602ED441A318612CD57B4A16EB59EE8AF00C05E1043CAA3E9C10B6DA615700C9463CE3D33670238160230F84D490EE29440149504E2EB1EAD11840F8E2980DDDA672BF446E2FCC0D1D6B4E52826D1`,
    headers: {
      'Host': 'mpdz-isv.isvjcloud.com',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-cn',
      'Cookie': cookie,
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, "", "不要在BoxJS手动复制粘贴修改cookie");
      return [];
    }
  }
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
