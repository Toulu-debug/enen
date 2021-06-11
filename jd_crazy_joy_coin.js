/*
crazy joy
挂机领金币/宝箱专用
活动入口：京东APP我的-更多工具-疯狂的JOY
⚠️建议云端使用。手机端不建议使用(会一直跑下去，永不停止)
疯狂JOY挂机脚本目前会自动合成34级JOY，
合成条件如下：
当存在8个34级JOY，并且剩余金币大于等于6Q，则此条件下合并两个34级JOY
即可为后面继续合成两只新的34级JOY(按全部用30级JOY合成一只34级JOY计算需:166T * 2 * 2 * 2 * 2 = 2.6Q * 2(两只34级JOY) = 5.2Q，取6Q)时

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#crazyJoy挂机
10 1,12 * * * jd_crazy_joy_coin.js, tag=crazyJoy挂机, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jd_crazy_joy.png, enabled=true

================Loon==============
[Script]
cron "10 1,12 * * *" script-path=jd_crazy_joy_coin.js,tag=crazyJoy挂机

===============Surge=================
crazyJoy挂机 = type=cron,cronexp="10 1,12 * * *",wake-system=1,timeout=20,script-path=jd_crazy_joy_coin.js

============小火箭=========
crazyJoy挂机 = type=cron,script-path=jd_crazy_joy_coin.js, cronexpr="10 1,12 * * *", timeout=200, enable=true

 */

const $ = new Env('crazyJoy挂机');
const JD_API_HOST = 'https://api.m.jd.com/';

const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [], cookie = '', message = '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!function(n){"use strict";function r(n,r){var t=(65535&n)+(65535&r);return(n>>16)+(r>>16)+(t>>16)<<16|65535&t}function t(n,r){return n<<r|n>>>32-r}function u(n,u,e,o,c,f){return r(t(r(r(u,n),r(o,f)),c),e)}function e(n,r,t,e,o,c,f){return u(r&t|~r&e,n,r,o,c,f)}function o(n,r,t,e,o,c,f){return u(r&e|t&~e,n,r,o,c,f)}function c(n,r,t,e,o,c,f){return u(r^t^e,n,r,o,c,f)}function f(n,r,t,e,o,c,f){return u(t^(r|~e),n,r,o,c,f)}function i(n,t){n[t>>5]|=128<<t%32,n[14+(t+64>>>9<<4)]=t;var u,i,a,h,g,l=1732584193,d=-271733879,v=-1732584194,C=271733878;for(u=0;u<n.length;u+=16)i=l,a=d,h=v,g=C,d=f(d=f(d=f(d=f(d=c(d=c(d=c(d=c(d=o(d=o(d=o(d=o(d=e(d=e(d=e(d=e(d,v=e(v,C=e(C,l=e(l,d,v,C,n[u],7,-680876936),d,v,n[u+1],12,-389564586),l,d,n[u+2],17,606105819),C,l,n[u+3],22,-1044525330),v=e(v,C=e(C,l=e(l,d,v,C,n[u+4],7,-176418897),d,v,n[u+5],12,1200080426),l,d,n[u+6],17,-1473231341),C,l,n[u+7],22,-45705983),v=e(v,C=e(C,l=e(l,d,v,C,n[u+8],7,1770035416),d,v,n[u+9],12,-1958414417),l,d,n[u+10],17,-42063),C,l,n[u+11],22,-1990404162),v=e(v,C=e(C,l=e(l,d,v,C,n[u+12],7,1804603682),d,v,n[u+13],12,-40341101),l,d,n[u+14],17,-1502002290),C,l,n[u+15],22,1236535329),v=o(v,C=o(C,l=o(l,d,v,C,n[u+1],5,-165796510),d,v,n[u+6],9,-1069501632),l,d,n[u+11],14,643717713),C,l,n[u],20,-373897302),v=o(v,C=o(C,l=o(l,d,v,C,n[u+5],5,-701558691),d,v,n[u+10],9,38016083),l,d,n[u+15],14,-660478335),C,l,n[u+4],20,-405537848),v=o(v,C=o(C,l=o(l,d,v,C,n[u+9],5,568446438),d,v,n[u+14],9,-1019803690),l,d,n[u+3],14,-187363961),C,l,n[u+8],20,1163531501),v=o(v,C=o(C,l=o(l,d,v,C,n[u+13],5,-1444681467),d,v,n[u+2],9,-51403784),l,d,n[u+7],14,1735328473),C,l,n[u+12],20,-1926607734),v=c(v,C=c(C,l=c(l,d,v,C,n[u+5],4,-378558),d,v,n[u+8],11,-2022574463),l,d,n[u+11],16,1839030562),C,l,n[u+14],23,-35309556),v=c(v,C=c(C,l=c(l,d,v,C,n[u+1],4,-1530992060),d,v,n[u+4],11,1272893353),l,d,n[u+7],16,-155497632),C,l,n[u+10],23,-1094730640),v=c(v,C=c(C,l=c(l,d,v,C,n[u+13],4,681279174),d,v,n[u],11,-358537222),l,d,n[u+3],16,-722521979),C,l,n[u+6],23,76029189),v=c(v,C=c(C,l=c(l,d,v,C,n[u+9],4,-640364487),d,v,n[u+12],11,-421815835),l,d,n[u+15],16,530742520),C,l,n[u+2],23,-995338651),v=f(v,C=f(C,l=f(l,d,v,C,n[u],6,-198630844),d,v,n[u+7],10,1126891415),l,d,n[u+14],15,-1416354905),C,l,n[u+5],21,-57434055),v=f(v,C=f(C,l=f(l,d,v,C,n[u+12],6,1700485571),d,v,n[u+3],10,-1894986606),l,d,n[u+10],15,-1051523),C,l,n[u+1],21,-2054922799),v=f(v,C=f(C,l=f(l,d,v,C,n[u+8],6,1873313359),d,v,n[u+15],10,-30611744),l,d,n[u+6],15,-1560198380),C,l,n[u+13],21,1309151649),v=f(v,C=f(C,l=f(l,d,v,C,n[u+4],6,-145523070),d,v,n[u+11],10,-1120210379),l,d,n[u+2],15,718787259),C,l,n[u+9],21,-343485551),l=r(l,i),d=r(d,a),v=r(v,h),C=r(C,g);return[l,d,v,C]}function a(n){var r,t="",u=32*n.length;for(r=0;r<u;r+=8)t+=String.fromCharCode(n[r>>5]>>>r%32&255);return t}function h(n){var r,t=[];for(t[(n.length>>2)-1]=void 0,r=0;r<t.length;r+=1)t[r]=0;var u=8*n.length;for(r=0;r<u;r+=8)t[r>>5]|=(255&n.charCodeAt(r/8))<<r%32;return t}function g(n){return a(i(h(n),8*n.length))}function l(n,r){var t,u,e=h(n),o=[],c=[];for(o[15]=c[15]=void 0,e.length>16&&(e=i(e,8*n.length)),t=0;t<16;t+=1)o[t]=909522486^e[t],c[t]=1549556828^e[t];return u=i(o.concat(h(r)),512+8*r.length),a(i(c.concat(u),640))}function d(n){var r,t,u="";for(t=0;t<n.length;t+=1)r=n.charCodeAt(t),u+="0123456789abcdef".charAt(r>>>4&15)+"0123456789abcdef".charAt(15&r);return u}function v(n){return unescape(encodeURIComponent(n))}function C(n){return g(v(n))}function A(n){return d(C(n))}function m(n,r){return l(v(n),v(r))}function s(n,r){return d(m(n,r))}function b(n,r,t){return r?t?m(r,n):s(r,n):t?C(n):A(n)}$.md5=b}();
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  let count = 0

  if (cookiesArr.length && $.isNode()) {
    console.log(`\n挂机开始，自动8s收一次金币`);
    //兼容iOS
    setInterval(async () => {
      const promiseArr = cookiesArr.map(ck => getCoinForInterval(ck));
      await Promise.all(promiseArr);
    }, 8000);
  }

  while (true) {
    count++
    console.log(`============开始第${count}次挂机=============`)
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
         $.log(`\n京东账号${$.index} ${$.nickName || $.UserName}\ncookie已过期,请重新登录获取\n`)
          continue
        }
        await jdCrazyJoy()
      }
    }
    $.log(`\n\n`)
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdCrazyJoy() {
  $.coin = 0
  $.bean = 0

  $.canBuy = true
  await getJoyList()
  await $.wait(1000)
  if ($.joyIds && $.joyIds.length > 0) {
    $.log('当前JOY分布情况')
    $.log(`\n${$.joyIds[0]} ${$.joyIds[1]} ${$.joyIds[2]} ${$.joyIds[3]}`)
    $.log(`${$.joyIds[4]} ${$.joyIds[5]} ${$.joyIds[6]} ${$.joyIds[7]}`)
    $.log(`${$.joyIds[8]} ${$.joyIds[9]} ${$.joyIds[10]} ${$.joyIds[11]}\n`)
  }

  await getJoyShop()
  await $.wait(1000)

  // 如果格子全部被占有且没有可以合并的JOY，只能回收低级的JOY (且最低等级的JOY小于30级)
  if(checkHasFullOccupied() && !checkCanMerge() && finMinJoyLevel() < 30) {
    const minJoyId = Math.min(...$.joyIds);
    const boxId = $.joyIds.indexOf(minJoyId);
    console.log(`格子全部被占有且没有可以合并的JOY，回收${boxId + 1}号位等级为${minJoyId}的JOY`)
    await sellJoy(minJoyId, boxId);
    await $.wait(1000)
    await getJoyList();
    await $.wait(1000)
  }

  await hourBenefit()
  await $.wait(1000)
  await getCoin()
  await $.wait(1000)

  for (let i = 0; i < $.joyIds.length; ++i) {
    if (!$.canBuy) {
      $.log(`金币不足，跳过购买`)
      break
    }
    if ($.joyIds[i] === 0) {
      await buyJoy($.buyJoyLevel)
      await $.wait(1000)
      await getJoyList()
      await $.wait(1000)
      await getCoin();
    }
  }

  let obj = {};
  $.joyIds.map((vo, idx) => {
    if (vo !== 0) {
      if (obj[vo]) {
        obj[vo].push(idx)
      } else {
        obj[vo] = [idx]
      }
    }
  })
  for (let idx in obj) {
    const vo = obj[idx]
    if (idx < 34 && vo.length >= 2) {
      $.log(`开始合并两只${idx}级joy\n`)
      await mergeJoy(vo[0], vo[1])
      await $.wait(3000)
      await getJoyList()
      await $.wait(1000)
      if ($.joyIds && $.joyIds.length > 0) {
        $.log('合并后的JOY分布情况')
        $.log(`\n${$.joyIds[0]} ${$.joyIds[1]} ${$.joyIds[2]} ${$.joyIds[3]}`)
        $.log(`${$.joyIds[4]} ${$.joyIds[5]} ${$.joyIds[6]} ${$.joyIds[7]}`)
        $.log(`${$.joyIds[8]} ${$.joyIds[9]} ${$.joyIds[10]} ${$.joyIds[11]}\n`)
      }
    }
    if (idx === '34' && vo.length >= 8) {
      if ($.coin >= 6000000000000000) {
        //当存在8个34级JOY，并且剩余金币可为后面继续合成两只新的34级JOY(按全部用30级JOY合成一只34级JOY计算需:1.66T * 2 * 2 * 2 * 2 = 26.56T = 2.6Q)时,则此条件下合并两个34级JOY
        $.log(`开始合并两只${idx}级joy\n`)
        await mergeJoy(vo[0], vo[1])
        await $.wait(3000)
        await getJoyList()
        await $.wait(1000)
        if ($.joyIds && $.joyIds.length > 0) {
          $.log('合并后的JOY分布情况')
          $.log(`\n${$.joyIds[0]} ${$.joyIds[1]} ${$.joyIds[2]} ${$.joyIds[3]}`)
          $.log(`${$.joyIds[4]} ${$.joyIds[5]} ${$.joyIds[6]} ${$.joyIds[7]}`)
          $.log(`${$.joyIds[8]} ${$.joyIds[9]} ${$.joyIds[10]} ${$.joyIds[11]}\n`)
        }
      }
    }
  }
  await getUserBean()
  await $.wait(5000)
  console.log(`当前信息：${$.bean} 京豆，${$.coin} 金币`)
}
//查询格子里面是否还有空格
function checkHasFullOccupied() {
  return !$.joyIds.includes(0);
}

// 查询是否有34级JOY
function checkHas34Level() {
  return $.joyIds.includes(34);
}

//查找格子里面有几个空格
function findZeroNum() {
  return $.joyIds.filter(i => i === 0).length
}
//查找当前 购买 joyLists 中最低等级的那一个
function finMinJoyLevel() {
  return Math.min(...$.joyIds.filter(s => s))
}
/**
 * 来源：https://elecv2.ml/#算法研究之合并类小游戏的最优购买问题
 * 获取下一个合适的购买等级。（算法二优化版）
 * @param     {array}     joyPrices    商店 joy 价格和等级列表
 * @param     {number}    start        开始比较的等级。范围1~30，默认：30
 * @param     {number}    direction    向上比较还是向下比较。0：向下比较，1：向上比较，默认：0
 * @return    {number}                 返回最终适合购买的等级
 */
function getBuyid2b(joyPrices, start = 30, direction = 0) {
  if (start < 1 || start > 30) {
    console.log('start 等级输入不合法')
    return 1
  }
  let maxL = 30        // 设置最高购买等级
  if (direction) {
    // 向上比较
    for (let ind = start - 1; ind < maxL - 1; ind++) {       // 商店 joy 等级和序列号相差1，需要减一下
      if (joyPrices[ind].coins * 2 < joyPrices[ind + 1].coins) return joyPrices[ind].joyId
    }
    return maxL
  } else {
    // 向下比较
    for (let ind = start - 1; ind > 0; ind--) {
      if (joyPrices[ind].coins <= joyPrices[ind - 1].coins * 2) return joyPrices[ind].joyId
    }
    return 1
  }
}

function buyJoyLogic() {
  new Promise(async resolve => {
    let zeroNum = findZeroNum();
    if (zeroNum === 0) {
      console.log('格子满了')
    } else if (zeroNum === 1) {
      await buyJoy(finMinJoyLevel());
    } else {
      let buyLevel = 1, joyPrices
      console.log('joyPrices', JSON.stringify($.joyPrices))
      if (zeroNum > 2) joyPrices = $.joyPrices;
      while (zeroNum--) {
        await $.wait(1000)
        if (zeroNum >= 2 && joyPrices && joyPrices.length) {
          // buyLevel = getBuyid2b(joyPrices, joyPrices.length)     // 具体参数可根据个人情况进行调整
          buyLevel = getBuyid2b(joyPrices)     // 具体参数可根据个人情况进行调整
        }
        if ($.joyPrices) {
          //添加判断。避免在获取$.joyPrices失败时，直接买等级1
          await buyJoy(buyLevel)
        }
      }
    }
    resolve()
  })
}

function checkCanMerge() {
  let obj = {};
  let canMerge = false;
  $.joyIds.forEach((vo, idx) => {
    if (vo !== 0 && vo !== 34) {
      if (obj[vo]) {
        obj[vo].push(idx)
        canMerge = true;
      } else {
        obj[vo] = [idx]
      }
    }
  });
  return canMerge;
}

function getJoyList() {
  $.joyIds = []
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_gameState'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            //console.log(data)
            if (data.success && data.data.joyIds) {
              $.joyIds = data.data.joyIds
            } else
              console.log(`joy信息获取信息失败`)
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

function getJoyShop() {
  const body = {"paramData": {"entry": "SHOP"}}
  return new Promise((resolve) => {
    $.get(taskUrl('crazyJoy_joy_allowBoughtList', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.success && data.data && data.data.shop) {
            const shop = data.data.shop.filter(vo => vo.status === 1) || [];
            $.joyPrices = shop;
            $.buyJoyLevel = shop.length ? shop[shop.length - 1]['joyId'] : 1;//可购买的最大等级
            if ($.isNode() && process.env.BUY_JOY_LEVEL) {
              $.log(`当前可购买的最高JOY等级为${$.buyJoyLevel}级\n`)
              $.buyJoyLevel = (process.env.BUY_JOY_LEVEL * 1) > $.buyJoyLevel ? $.buyJoyLevel : process.env.BUY_JOY_LEVEL * 1;
              $.cost = shop[$.buyJoyLevel - 1]['coins']
            } else {
              $.cost = shop.length ? shop[shop.length - 1]['coins'] : Infinity
            }
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

function mergeJoy(x, y) {
  let body = {"operateType": "MERGE", "fromBoxIndex": x, "targetBoxIndex": y}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_joy_moveOrMerge', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data.newJoyId) {
              if (data.data.newJoyId > 34) {
                let level = function (newJoyId) {
                  switch (newJoyId) {
                    case 1003:
                      return '多多JOY'
                    case 1004:
                      return '快乐JOY'
                    case 1005:
                      return '好物JOY'
                    case 1006:
                      return '省钱JOY'
                    case 1007:
                      return '东东JOY'
                    default:
                      return '未知JOY'
                  }
                }
                console.log(`合并成功，获得${level(data.data.newJoyId)}级Joy`)
                if (data.data.newJoyId === 1007 && $.isNode()) await notify.sendNotify($.name, `京东账号${$.index} ${$.nickName}\n合并成功，获得${level(data.data.newJoyId)}级Joy`)
              } else {
                console.log(`合并成功，获得${data.data.newJoyId}级Joy`)
              }
            } else
              console.log(`合并失败，错误`)
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

function buyJoy(joyId) {
  const body = {"action": "BUY", "joyId": joyId, "boxId": ""}
  return new Promise((resolve) => {
    $.get(taskUrl('crazyJoy_joy_trade', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.success) {
            if (data.data.eventInfo) {
              await openBox(data.data.eventInfo.eventType, data.data.eventInfo.eventRecordId)
              await $.wait(1000)
              $.log('金币不足')
              $.canBuy = false
              return
            }
            $.log(`购买${joyId}级joy成功，剩余金币【${data.data.totalCoins}】`)
            $.coin = data.data.totalCoins
          } else {
            console.log(data.message)
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

// 出售（回收）joy
function sellJoy(joyId, boxId) {
  const body = {"action": "SELL", "joyId": joyId, "boxId": boxId}
  return new Promise((resolve) => {
    $.get(taskUrl('crazyJoy_joy_trade', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.success) {
            if (data.data.eventInfo) {
              await openBox(data.data.eventInfo.eventType, data.data.eventInfo.eventRecordId)
              await $.wait(1000)
              $.canBuy = false
              return
            }
            $.log(`回收${joyId}级joy成功，剩余金币【${data.data.totalCoins}】`)
            $.coin = data.data.totalCoins
          } else {
            console.log(data.message)
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

function hourBenefit() {
  let body = {"eventType": "HOUR_BENEFIT"}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_event_obtainAward', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success)
              console.log(`金币补给领取成功，获得${data.data.coins}金币`)
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

function getUserBean() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_getJdBeanInfo'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.totalBeans)
              $.bean = data.data.totalBeans
            else
              console.log(`京豆信息获取信息失败`)
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

function getCoin() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_joy_produce'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.tryMoneyJoyBeans) {
              console.log(`分红狗生效中，预计获得 ${data.data.tryMoneyJoyBeans} 京豆奖励`)
            }
            if (data.data && data.data.totalCoinAmount) {
              $.coin = data.data.totalCoinAmount;
              $.log(`当前金币:${$.coin}\n`)
            } else {
              $.coin = `获取当前金币数量失败`
            }
            if (data.data && data.data.luckyBoxRecordId) {
              await openBox('LUCKY_BOX_DROP',data.data.luckyBoxRecordId)
              await $.wait(1000)
            }
            if (data.data) {
              $.log(`此次在线收益：获得 ${data.data['coins']} 金币`)
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

// 需传入cookie，不能使用全局的cookie
function getCoinForInterval(taskCookie) {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_joy_produce', '', taskCookie), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            // const userName = decodeURIComponent(taskCookie.match(/pt_pin=(.+?);/) && taskCookie.match(/pt_pin=(.+?);/)[1])
            // data = JSON.parse(data);
            // if (data.data && data.data.tryMoneyJoyBeans) {
            //   console.log(`【京东账号 ${userName}】分红狗生效中，预计获得 ${data.data.tryMoneyJoyBeans} 京豆奖励`)
            // }
            // if (data.data) {
            //   $.log(`【京东账号 ${userName}】此次在线收益：获得 ${data.data['coins']} 金币`)
            // }
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

function openBox(eventType = 'LUCKY_BOX_DROP', boxId) {
  let body = { eventType, "eventRecordId": boxId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_event_getVideoAdvert', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              $.log(`点击幸运盒子成功，剩余观看视频次数：${data.data.advertViewTimes}, ${data.data.advertViewTimes > 0 ? '等待32秒' : '跳出'}`)
              if (data.data.advertViewTimes > 0) {
                await $.wait(32000)
                await rewardBox(eventType, boxId);
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

function rewardBox(eventType, boxId) {
  let body = { eventType, "eventRecordId": boxId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_event_obtainAward', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          $.log(`${JSON.stringify(err)}`)
          $.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              $.log(`幸运盒子奖励领取成功，获得：${data.data.beans}京豆，${data.data.coins}金币`)
            } else {
              $.log(`幸运盒子奖励领取失败，错误信息：${data.message || JSON.stringify(data)}`)
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

function getGrowState() {
  let body = {"paramData":{"eventType":"GROWTH_REWARD"}}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_event_getGrowthAndSceneState', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          $.log(`${JSON.stringify(err)}`)
          $.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success'] && data.data) {
              for(let vo of data.data){
                if(vo['status']){
                  console.log(`${vo['joyId']}升级奖励可以领取`)
                }
              }
            } else {
              $.log(`幸运盒子奖励领取失败，错误信息：${data.message || JSON.stringify(data)}`)
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
function taskUrl(functionId, body = '', taskCookie = cookie) {
  var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxb2398=["\x73\x75\x62\x73\x74\x72","\x6E\x6F\x77","","\x61\x44\x76\x53\x63\x42\x76\x24\x67\x47\x51\x76\x72\x58\x66\x76\x61\x38\x64\x47\x21\x5A\x43\x40\x44\x41\x37\x30\x59\x25\x6C\x58","\x6D\x64\x35","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];let t=Date[__Oxb2398[0x1]]().toString()[__Oxb2398[0x0]](0,10);let e=body|| __Oxb2398[0x2];e= $[__Oxb2398[0x4]](__Oxb2398[0x3]+ e+ t);e= e+ Number(t).toString(16);(function(_0x8b7fx3,_0x8b7fx4,_0x8b7fx5,_0x8b7fx6,_0x8b7fx7,_0x8b7fx8){_0x8b7fx8= __Oxb2398[0x5];_0x8b7fx6= function(_0x8b7fx9){if( typeof alert!== _0x8b7fx8){alert(_0x8b7fx9)};if( typeof console!== _0x8b7fx8){console[__Oxb2398[0x6]](_0x8b7fx9)}};_0x8b7fx5= function(_0x8b7fxa,_0x8b7fx3){return _0x8b7fxa+ _0x8b7fx3};_0x8b7fx7= _0x8b7fx5(__Oxb2398[0x7],_0x8b7fx5(_0x8b7fx5(__Oxb2398[0x8],__Oxb2398[0x9]),__Oxb2398[0xa]));try{_0x8b7fx3= __encode;if(!( typeof _0x8b7fx3!== _0x8b7fx8&& _0x8b7fx3=== _0x8b7fx5(__Oxb2398[0xb],__Oxb2398[0xc]))){_0x8b7fx6(_0x8b7fx7)}}catch(e){_0x8b7fx6(_0x8b7fx7)}})({})
  return {
    url: `${JD_API_HOST}?uts=${e}&appid=crazy_joy&functionId=${functionId}&body=${escape(body)}&t=${t}`,
    headers: {
      'Cookie': taskCookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Referer': 'https://crazy-joy.jd.com/',
      'origin': 'https://crazy-joy.jd.com',
      'Accept-Encoding': 'gzip, deflate, br',
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

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}