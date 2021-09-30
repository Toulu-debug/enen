/**
 更新时间：2021-09-30
 cron: 0-23/2 * * * *
 export feedNum=80
 export JD_JOY_teamLevel=2
 */

const $ = new Env("宠汪汪二代目")
console.log('\n====================Hello World====================\n')

const injectToRequest = require("./utils/jd_joy_validate").injectToRequest, USER_AGENT = require("./USER_AGENTS").USER_AGENT, md5 = require('md5')

let cookiesArr = [], cookie = '', notify;
let invokeKey = 'JL1VTNRadM68cIMQ';

$.get = injectToRequest($.get.bind($))
$.post = injectToRequest($.post.bind($))

!(async () => {
  await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      if (!require('./JS_USER_AGENTS').HelloWorld) {
        console.log(`\n【京东账号${$.index}】${$.nickName || $.UserName}：运行环境检测失败\n`);
        break
      }
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);

      let res = await api('gift/getBeanConfigs');
      try {
        console.log('现有积分：', res.data.petCoin)
      } catch (e) {
        console.log('没有获取到积分余额')
        continue
      }

      await getFriends();

      await run('detail/v2');
      await run();
      await feed();

      let tasks = await api('pet/getPetTaskConfig');
      for (let tp of tasks.datas) {
        console.log(tp.taskName, tp.receiveStatus)
        if (tp.receiveStatus === 'unreceive') {
          await award(tp.taskType);
          await $.wait(3000);
        }
        if (tp.taskName === '浏览频道') {
          for (let i = 0; i < 3; i++) {
            console.log(`\t第${i + 1}次浏览频道 检查遗漏`)
            let followChannelList = await api('pet/getFollowChannels');
            for (let t of followChannelList['datas']) {
              if (!t.status) {
                console.log('┖', t['channelName'])
                await beforeTask('follow_channel', t.channelId);
                await doTask(JSON.stringify({"channelId": t.channelId, "taskType": 'FollowChannel'}))
                await $.wait(3000)
              }
            }
            await $.wait(3000)
          }
        }
        if (tp.taskName === '逛会场') {
          for (let t of tp.scanMarketList) {
            if (!t.status) {
              console.log('┖', t.marketName)
              await doTask(JSON.stringify({
                "marketLink": `${t.marketLink || t.marketLinkH5}`,
                "taskType": "ScanMarket"
              }))
              await $.wait(3000)
            }
          }
        }
        if (tp.taskName === '关注商品') {
          for (let t of tp.followGoodList) {
            if (!t.status) {
              console.log('┖', t.skuName)
              await beforeTask('follow_good', t.sku)
              await $.wait(1000)
              await doTask(`sku=${t.sku}`, 'followGood')
              await $.wait(3000)
            }
          }
        }
        if (tp.taskName === '关注店铺') {
          for (let t of tp.followShops) {
            if (!t.status) {
              await beforeTask('follow_shop', t.shopId);
              await $.wait(1000);
              await followShop(t.shopId)
              await $.wait(2000);
            }
          }
        }
      }
    }
  }
})()

function api(fn) {
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = md5('' + invokeKey + lkt).toString()
    $.get({
      url: `https://jdjoy.jd.com/common/${fn}?reqSource=h5&invokeKey=${invokeKey}`,
      headers: {
        'lkt': lkt,
        'lks': lks,
        'Origin': 'https://h5.m.jd.com',
        'Host': 'jdjoy.jd.com',
        'User-Agent': USER_AGENT,
        'cookie': cookie,
        'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html'
      },
    }, (err, resp, data) => {
      try {
        resolve(JSON.parse(data))
      } catch (e) {
        resolve(e)
      }
    })
  })
}

function beforeTask(fn, shopId) {
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = md5('' + invokeKey + lkt).toString()
    $.get({
      url: `https://jdjoy.jd.com/common/pet/icon/click?iconCode=${fn}&linkAddr=${shopId}&reqSource=h5&invokeKey=${invokeKey}`,
      headers: {
        lkt: lkt,
        lks: lks,
        'Content-Type': 'application/json',
        'Origin': 'https://h5.m.jd.com',
        'Host': 'jdjoy.jd.com',
        'User-Agent': USER_AGENT,
        'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
        'cookie': cookie
      }
    }, (err, resp, data) => {
      console.log('before task:', data);
      resolve();
    })
  })
}

function followShop(shopId) {
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = md5('' + invokeKey + lkt).toString()
    $.post({
      url: `https://jdjoy.jd.com/common/pet/followShop?reqSource=h5&invokeKey=${invokeKey}`,
      headers: {
        lkt: lkt,
        lks: lks,
        'User-Agent': USER_AGENT,
        'Accept-Language': 'zh-cn',
        'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html?babelChannel=ttt12&lng=0.000000&lat=0.000000&sid=87e644ae51ba60e68519b73d1518893w&un_area=12_904_3373_62101',
        'Host': 'jdjoy.jd.com',
        'Origin': 'https://h5.m.jd.com',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'cookie': cookie
      },
      body: `shopId=${shopId}`
    }, (err, resp, data) => {
      console.log(data)
      resolve();
    })
  })
}

function doTask(body, fnId = 'scan') {
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = md5('' + invokeKey + lkt).toString()
    $.post({
      url: `https://jdjoy.jd.com/common/pet/${fnId}?reqSource=h5&invokeKey=${invokeKey}`,
      headers: {
        'lkt': lkt,
        'lks': lks,
        'Host': 'jdjoy.jd.com',
        'accept': '*/*',
        'content-type': fnId === 'followGood' || fnId === 'followShop' ? 'application/x-www-form-urlencoded' : 'application/json',
        'origin': 'https://h5.m.jd.com',
        'accept-language': 'zh-cn',
        'referer': 'https://h5.m.jd.com/',
        'Content-Type': fnId === 'followGood' ? 'application/x-www-form-urlencoded' : 'application/json; charset=UTF-8',
        "User-Agent": USER_AGENT,
        'cookie': cookie
      },
      body: body
    }, (err, resp, data) => {
      if (err)
        console.log('\tdoTask() Error:', err)
      try {
        console.log('\tdotask:', data)
        data = JSON.parse(data);
        data.success ? console.log('\t任务成功') : console.log('\t任务失败', JSON.stringify(data))
      } catch (e) {
        $.logErr(e);
      } finally {
        resolve();
      }
    })
  })
}

function feed() {
  let feedNum = process.env.feedNum ? process.env.feedNum : 80
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = md5('' + invokeKey + lkt).toString()
    $.post({
      url: `https://jdjoy.jd.com/common/pet/enterRoom/h5?invitePin=&reqSource=h5&invokeKey=${invokeKey}`,
      headers: {
        'lkt': lkt,
        'lks': lks,
        'Host': 'jdjoy.jd.com',
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': 'https://h5.m.jd.com',
        'accept-language': 'zh-cn',
        "User-Agent": USER_AGENT,
        'referer': 'https://h5.m.jd.com/',
        'Content-Type': 'application/json; charset=UTF-8',
        'cookie': cookie
      },
      body: JSON.stringify({})
    }, (err, resp, data) => {
      data = JSON.parse(data)
      if (new Date().getTime() - new Date(data.data.lastFeedTime) < 10800000) {
        console.log('喂食间隔不够。')
        resolve();
      } else {
        console.log('开始喂食......')
        let lkt = new Date().getTime()
        let lks = md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
        $.get({
          url: `https://jdjoy.jd.com/common/pet/feed?feedCount=${feedNum}&reqSource=h5&invokeKey=JL1VTNRadM68cIMQ`,
          headers: {
            'lkt': lkt,
            'lks': lks,
            'Host': 'jdjoy.jd.com',
            'accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://h5.m.jd.com',
            'accept-language': 'zh-cn',
            "User-Agent": USER_AGENT,
            'referer': 'https://h5.m.jd.com/',
            'cookie': cookie
          },
        }, (err, resp, data) => {
          try {
            data = JSON.parse(data);
            data.errorCode === 'feed_ok' ? console.log(`\t喂食成功！`) : console.log('\t喂食失败', JSON.stringify(data))
          } catch (e) {
            $.logErr(e);
          } finally {
            resolve();
          }
        })
      }
    })
  })
}

function award(taskType) {
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    $.get({
      url: `https://jdjoy.jd.com/common/pet/getFood?reqSource=h5&invokeKey=JL1VTNRadM68cIMQ&taskType=${taskType}`,
      headers: {
        'lkt': lkt,
        'lks': lks,
        'Host': 'jdjoy.jd.com',
        'accept': '*/*',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://h5.m.jd.com',
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'referer': 'https://h5.m.jd.com/',
        'Content-Type': 'application/json; charset=UTF-8',
        'cookie': cookie
      },
    }, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        data.errorCode === 'received' ? console.log('任务完成:', data.data) : console.log('\t任务失败:', data)
      } catch (e) {
        $.logErr(e);
      } finally {
        resolve();
      }
    })
  })
}

function run(fn = 'match') {
  let level = process.env.JD_JOY_teamLevel ? process.env.JD_JOY_teamLevel : 2
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    $.get({
      url: `https://jdjoy.jd.com/common/pet/combat/${fn}?teamLevel=${level}&reqSource=h5&invokeKey=JL1VTNRadM68cIMQ`,
      headers: {
        'lkt': lkt,
        'lks': lks,
        'Host': 'jdjoy.jd.com',
        'origin': 'https://h5.m.jd.com',
        'referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
        "User-Agent": USER_AGENT,
        'cookie': cookie
      },
    }, async (err, resp, data) => {
      try {
        if (fn === 'receive') {
          console.log('领取赛跑奖励：', data)
        } else {
          data = JSON.parse(data);
          let race = data.data.petRaceResult
          if (race === 'participate') {
            console.log('匹配成功！')
          } else if (race === 'unbegin') {
            console.log('还未开始！')
          } else if (race === 'matching') {
            console.log('正在匹配！')
            await $.wait(2000)
            await run()
          } else if (race === 'unreceive') {
            console.log('开始领奖')
            await run('receive')
          } else if (race === 'time_over') {
            console.log('不在比赛时间')
          } else {
            console.log('这是什么！', data)
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        resolve();
      }
    })
  })
}

function getFriends() {
  return new Promise((resolve) => {
    let lkt = new Date().getTime()
    let lks = md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    $.post({
      url: 'https://jdjoy.jd.com/common/pet/enterRoom/h5?invitePin=&reqSource=h5&invokeKey=JL1VTNRadM68cIMQ',
      headers: {
        'lkt': lkt,
        'lks': lks,
        'Host': 'jdjoy.jd.com',
        'Content-Type': 'application/json',
        'X-Requested-With': 'com.jingdong.app.mall',
        'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html?babelChannel=ttt12&sid=445902658831621c5acf782ec27ce21w&un_area=12_904_3373_62101',
        'Origin': 'https://h5.m.jd.com',
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Cookie': cookie
      },
      body: JSON.stringify({})
    }, async (err, resp, data) => {
      let flag = true
      for (let k = 0; k < 20; k++) {
        if (flag) {
          await $.wait(1000)
        } else {
          console.log('无法获取好友列表')
          break
        }
        $.get({
          url: 'https://jdjoy.jd.com/common/pet/h5/getFriends?itemsPerPage=20&currentPage=1&reqSource=h5&invokeKey=JL1VTNRadM68cIMQ',
          headers: {
            'Host': 'jdjoy.jd.com',
            'Accept': '*/*',
            'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
            'cookie': cookie
          }
        }, async (err, resp, data) => {
          data = JSON.parse(data)
          if (data.datas) {
            for (let f of data.datas) {
              if (f.stealStatus === 'can_steal') {
                console.log('可偷:', f.friendPin)
                let lkt = new Date().getTime()
                let lks = md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
                $.get({
                  url: `https://jdjoy.jd.com/common/pet/enterFriendRoom?reqSource=h5&invokeKey=JL1VTNRadM68cIMQ&friendPin=${encodeURIComponent(f.friendPin)}`,
                  headers: {
                    'lkt': lkt,
                    'lks': lks,
                    'Host': 'jdjoy.jd.com',
                    'Accept': '*/*',
                    'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
                    "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                    'cookie': cookie
                  }
                }, (err, resp, data) => {
                  let lkt = new Date().getTime()
                  let lks = md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
                  $.get({
                    url: `https://jdjoy.jd.com/common/pet/getRandomFood?reqSource=h5&invokeKey=JL1VTNRadM68cIMQ&friendPin=${encodeURIComponent(f.friendPin)}`,
                    headers: {
                      'lkt': lkt,
                      'lks': lks,
                      'Host': 'jdjoy.jd.com',
                      'Accept': '*/*',
                      'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/2wuqXrZrhygTQzYA7VufBEpj4amH/index.html',
                      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                      'cookie': cookie
                    }
                  }, (err, resp, data) => {
                    data = JSON.parse(data)
                    console.log('偷狗粮:', data.errorCode, data.data)
                  })
                })
              }
              await $.wait(1500)
            }
          }
        })
      }
      resolve();
    })
  })
}

function requireConfig() {
  return new Promise(resolve => {
    notify = $.isNode() ? require('./sendNotify') : '';
    //Node.js用户请在jdCookie.js处填写京东ck;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    //IOS等用户直接用NobyDa的jd cookie
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
      };
    } else {
      cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
    }
    console.log(`共${cookiesArr.length}个京东账号\n`)
    resolve()
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
