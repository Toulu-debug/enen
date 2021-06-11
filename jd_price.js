/*
京东保价
京东 api 只能查询60天的订单
保价期限是以物流签收时间为准的，30天是最长保价期。
所以订单下单时间以及发货、收货时间，也可能占用很多天，60天内的订单进行保价是正常的。
没进行过保价的60天内的订单。查询一次，不符合保价的，不会再次申请保价。
支持云端cookie使用
修改自：https://raw.githubusercontent.com/ZCY01/daily_scripts/main/jd/jd_priceProtect.js
修改自：https://raw.githubusercontent.com/id77/QuantumultX/master/task/jdGuaranteedPrice.js

京东保价页面脚本：https://static.360buyimg.com/siteppStatic/script/priceskus-phone.js
iOS同时支持使用 NobyDa 与 domplin 脚本的京东 cookie
活动时间：2021-2-14至2021-3-3
活动地址：https://prodev.m.jd.com/jdlite/active/31U4T6S4PbcK83HyLPioeCWrD63j/index.html
活动入口：京东保价
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京东保价
0 2 * * * jd_price.js, tag=京东保价, img-url=https://raw.githubusercontent.com/Orz-3/task/master/jd.png, enabled=true

================Loon==============
[Script]
cron "0 2 * * *" script-path=jd_price.js,tag=京东保价

===============Surge=================
京东保价 = type=cron,cronexp="0 2 * * *",wake-system=1,timeout=3600,script-path=jd_price.js

============小火箭=========
京东保价 = type=cron,script-path=jd_price.js, cronexpr="0 2 * * *", timeout=3600, enable=true
 */

const $ = new Env('京东保价');

const selfDomain = 'https://msitepp-fm.jd.com/';
const unifiedGatewayName = 'https://api.m.jd.com/';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg(
      $.name,
      '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取',
      'https://bean.m.jd.com/',
      {
        'open-url': 'https://bean.m.jd.com/',
      }
    );
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(
        $.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
      );
      $.index = i + 1;
      $.isLogin = false;
      $.nickName = '';
      await totalBean();
      if (!$.isLogin) {
        $.msg(
          $.name,
          `【提示】cookie已失效`,
          `京东账号${$.index} ${
            $.nickName || $.UserName
          }\n请重新登录获取\nhttps://bean.m.jd.com/`,
          {
            'open-url': 'https://bean.m.jd.com/',
          }
        );
        continue;
      }
      console.log(
        `\n***********开始【账号${$.index}】${
          $.nickName || $.UserName
        }********\n`
      );
      try {
        $.hasNext = true;
        $.refundtotalamount = 0;
        $.orderList = new Array();
        $.applyMap = {};
        $.token = '';
        $.feSt = 'f';
        console.log(`💥 获得首页面，解析超参数`);
        await getHyperParams();
        // console.log($.HyperParam)
        console.log(`----------`);
        console.log(`🧾 获取所有价格保护列表，排除附件商品`);
        for (let page = 1; $.hasNext; page++) {
          await getApplyData(page);
        }
        console.log(`----------`);
        console.log(`🗑 删除不符合订单`);
        console.log(`----------`);
        let taskList = [];
        for (let order of $.orderList) {
          taskList.push(historyResultQuery(order));
        }
        await Promise.all(taskList);
        console.log(`----------`);
        console.log(`📊 ${$.orderList.length}个商品即将申请价格保护！`);
        console.log(`----------`);
        for (let order of $.orderList) {
          await skuApply(order);
          await $.wait(300);
        }
        console.log(`----------`);
        console.log(`⏳ 等待申请价格保护结果...`);
        console.log(`----------`);
        for (let i = 1; i <= 30 && Object.keys($.applyMap).length > 0; i++) {
          await $.wait(1000);
          if (i % 5 == 0) {
            await getApplyResult();
          }
        }
        showMsg();
      } catch (e) {
        $.logErr(e)
      }
    }
  }
})()
  .catch((e) => {
    console.log(`❗️ ${$.name} 运行错误！\n${e}`);
  })
  .finally(() => $.done());

const getValueById = function (text, id) {
  try {
    const reg = new RegExp(`id="${id}".*value="(.*?)"`);
    const res = text.match(reg);
    return res[1];
  } catch (e) {
    throw new Error(`getValueById:${id} err`);
  }
};

function getHyperParams() {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'https://msitepp-fm.jd.com/rest/priceprophone/priceProPhoneMenu',
      headers: {
        Host: 'msitepp-fm.jd.com',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Connection: 'keep-alive',
        Cookie: $.cookie,
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Accept-Language': 'zh-cn',
        Referer: 'https://ihelp.jd.com/',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    };
    $.get(options, (err, resp, data) => {
      try {
        if (err) throw new Error(JSON.stringify(err));
        $.HyperParam = {
          sid_hid: getValueById(data, 'sid_hid'),
          type_hid: getValueById(data, 'type_hid'),
          isLoadLastPropriceRecord: getValueById(
            data,
            'isLoadLastPropriceRecord'
          ),
          isLoadSkuPrice: getValueById(data, 'isLoadSkuPrice'),
          RefundType_Orderid_Repeater_hid: getValueById(
            data,
            'RefundType_Orderid_Repeater_hid'
          ),
          isAlertSuccessTip: getValueById(data, 'isAlertSuccessTip'),
          forcebot: getValueById(data, 'forcebot'),
          useColorApi: getValueById(data, 'useColorApi'),
        };
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        resolve();
      }
    });
  });
}

function getApplyData(page) {
  return new Promise((resolve, reject) => {
    $.hasNext = false;
    const { sid_hid, type_hid, forcebot } = $.HyperParam;
    const pageSize = 5;

    let paramObj = {
      page,
      pageSize,
      keyWords: '',
      sid: sid_hid,
      type: type_hid,
      forcebot,
      token: $.token,
      feSt: $.feSt,
    };

    $.post(taskUrl('siteppM_priceskusPull', paramObj), (err, resp, data) => {
      try {
        if (err) {
          console.log(
            `🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(
              err
            )}`
          );
        } else {
          let pageErrorVal = data.match(
            /id="pageError_\d+" name="pageError_\d+" value="(.*?)"/
          )[1];
          if (pageErrorVal == 'noexception') {
            let pageDatasSize = eval(
              data.match(
                /id="pageSize_\d+" name="pageSize_\d+" value="(.*?)"/
              )[1]
            );
            $.hasNext = pageDatasSize >= pageSize;
            let orders = [...data.matchAll(/skuApply\((.*?)\)/g)];
            let titles = [...data.matchAll(/<p class="name">(.*?)<\/p>/g)];
            for (let i = 0; i < orders.length; i++) {
              let info = orders[i][1].split(',');
              if (info.length != 4) {
                throw new Error(`价格保护 ${order[1]}.length != 4`);
              }
              const item = {
                orderId: eval(info[0]),
                skuId: eval(info[1]),
                sequence: eval(info[2]),
                orderCategory: eval(info[3]),
                title: `🛒${titles[i][1].substr(0, 15)}🛒`,
              };
              let id = `skuprice_${item.orderId}_${item.skuId}_${item.sequence}`;
              let reg = new RegExp(`${id}.*?isfujian="(.*?)"`);
              isfujian = data.match(reg)[1];
              if (isfujian == 'false') {
                let skuRefundTypeDiv_orderId = `skuRefundTypeDiv_${item.orderId}`;
                item['refundtype'] = getValueById(
                  data,
                  skuRefundTypeDiv_orderId
                );
                // 设置原路返还
                if (item.refundtype === '2') item.refundtype = '1';
                $.orderList.push(item);
              }
              //else...尊敬的顾客您好，您选择的商品本身为赠品，是不支持价保的呦，请您理解。
            }
          }
        }
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        resolve();
      }
    });
  });
}

//  申请按钮
function skuApply(order) {
  return new Promise((resolve, reject) => {
    const { orderId, orderCategory, skuId, refundtype } = order;
    const { sid_hid, type_hid, forcebot } = $.HyperParam;

    let paramObj = {
      orderId,
      orderCategory,
      skuId,
      sid: sid_hid,
      type: type_hid,
      refundtype,
      forcebot,
      token: $.token,
      feSt: $.feSt,
    };

    console.log(`🈸 ${order.title}`);
    $.post(taskUrl('siteppM_proApply', paramObj), (err, resp, data) => {
      try {
        if (err) {
          console.log(
            `🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(
              err
            )}`
          );
        } else {
          data = JSON.parse(data);
          if (data.flag) {
            if (data.proSkuApplyId != null) {
              $.applyMap[data.proSkuApplyId[0]] = order;
            }
          } else {
            console.log(`🚫 ${order.title} 申请失败：${data.errorMessage}`);
          }
        }
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        resolve();
      }
    });
  });
}

// 历史结果查询
function historyResultQuery(order) {
  return new Promise((resolve, reject) => {
    const { orderId, sequence, skuId } = order;
    const { sid_hid, type_hid, forcebot } = $.HyperParam;

    let paramObj = {
      orderId,
      skuId,
      sequence,
      sid: sid_hid,
      type: type_hid,
      pin: undefined,
      forcebot,
    };

    const reg = new RegExp(
      'overTime|[^库]不支持价保|无法申请价保|请用原订单申请'
    );
    let deleted = true;
    $.post(taskUrl('siteppM_skuProResultPin', paramObj), (err, resp, data) => {
      try {
        if (err) {
          console.log(
            `🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(
              err
            )}`
          );
        } else {
          deleted = reg.test(data);
        }
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        if (deleted) {
          console.log(`🚫 删除商品：${order.title}`);
          $.orderList = $.orderList.filter((item) => {
            return item.orderId != order.orderId || item.skuId != order.skuId;
          });
        }
        resolve();
      }
    });
  });
}

function getApplyResult() {
  function handleApplyResult(ajaxResultObj) {
    if (
      ajaxResultObj.hasResult != 'undefined' &&
      ajaxResultObj.hasResult == true
    ) {
      //有结果了
      let proSkuApplyId = ajaxResultObj.applyResultVo.proSkuApplyId; //申请id
      let order = $.applyMap[proSkuApplyId];
      delete $.applyMap[proSkuApplyId];
      if (ajaxResultObj.applyResultVo.proApplyStatus == 'ApplySuccess') {
        //价保成功
        $.refundtotalamount += ajaxResultObj.applyResultVo.refundtotalamount;
        console.log(
          `📋 ${order.title} \n🟢 申请成功：￥${$.refundtotalamount}`
        );
        console.log(`-----`);
      } else {
        console.log(
          `📋 ${order.title} \n🔴 申请失败：${ajaxResultObj.applyResultVo.failTypeStr} \n🔴 失败类型:${ajaxResultObj.applyResultVo.failType}`
        );
        console.log(`-----`);
      }
    }
  }
  return new Promise((resolve, reject) => {
    let proSkuApplyIds = Object.keys($.applyMap).join(',');
    const { pin, type_hid } = $.HyperParam;

    let paramObj = {
      proSkuApplyIds,
      pin,
      type: type_hid,
    };

    $.post(taskUrl('siteppM_moreApplyResult', paramObj), (err, resp, data) => {
      try {
        if (err) {
          console.log(
            `🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(
              err
            )}`
          );
        } else if (data) {
          data = JSON.parse(data);
          let resultArray = data.applyResults;
          for (let i = 0; i < resultArray.length; i++) {
            let ajaxResultObj = resultArray[i];
            handleApplyResult(ajaxResultObj);
          }
        }
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        resolve();
      }
    });
  });
}

function taskUrl(functionid, body) {
  let urlStr = selfDomain + 'rest/priceprophone/priceskusPull';
  const { useColorApi, forcebot } = $.HyperParam;

  if (useColorApi == 'true') {
    urlStr =
      unifiedGatewayName +
      'api?appid=siteppM&functionId=' +
      functionid +
      '&forcebot=' +
      forcebot +
      '&t=' +
      new Date().getTime();
  }
  return {
    url: urlStr,
    headers: {
      Host: useColorApi == 'true' ? 'api.m.jd.com' : 'msitepp-fm.jd.com',
      Accept: '*/*',
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://msitepp-fm.jd.com',
      Connection: 'keep-alive',
      Referer: 'https://msitepp-fm.jd.com/rest/priceprophone/priceProPhoneMenu',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      Cookie: $.cookie,
    },
    body: body ? `body=${JSON.stringify(body)}` : undefined,
  };
}

function showMsg() {
  console.log(`🧮 本次价格保护金额：${$.refundtotalamount}💰`);
  if ($.refundtotalamount) {
    $.msg(
      $.name,
      ``,
      `京东账号${$.index} ${$.nickName || $.UserName}\n🎉 本次价格保护金额：${
        $.refundtotalamount
      }💰`,
      {
        'open-url':
          'https://msitepp-fm.jd.com/rest/priceprophone/priceProPhoneMenu',
      }
    );
  }
}

function totalBean() {
  return new Promise((resolve) => {
    const options = {
      url: `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      headers: {
        Accept: 'application/json,text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-cn',
        Connection: 'keep-alive',
        Cookie: $.cookie,
        Referer: 'https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      },
    };
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              return;
            }
            $.isLogin = true;
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

function jsonParse(str) {
  if (typeof str == 'string') {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg(
        $.name,
        '',
        '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie'
      );
      return [];
    }
  }
}
// https://github.com/chavyleung/scripts/blob/master/Env.js
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}