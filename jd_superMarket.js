/*
东东超市
Last Modified time: 2021-3-4 21:22:37
活动入口：京东APP首页-京东超市-底部东东超市
Some Functions Modified From https://github.com/Zero-S1/JD_tools/blob/master/JD_superMarket.py
东东超市兑换奖品请使用此脚本 jd_blueCoin.js
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
=================QuantumultX==============
[task_local]
#东东超市
11 * * * * jd_superMarket.js, tag=东东超市, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jxc.png, enabled=true
===========Loon===============
[Script]
cron "11 * * * *" script-path=jd_superMarket.js,tag=东东超市
=======Surge===========
东东超市 = type=cron,cronexp="11 * * * *",wake-system=1,timeout=3600,script-path=jd_superMarket.js
==============小火箭=============
东东超市 = type=cron,script-path=jd_superMarket.js, cronexpr="11 * * * *", timeout=3600, enable=true
 */
const $ = new Env('东东超市');
let cookiesArr = [], cookie = '', jdSuperMarketShareArr = [], notify, newShareCodes;
let jdNotify = true;//用来是否关闭弹窗通知，true表示关闭，false表示开启。
let drawLotteryFlag = false;//是否用500蓝币去抽奖，true表示开启，false表示关闭。默认关闭
let message = '', subTitle;
const JD_API_HOST = 'https://api.m.jd.com/api';

let shareCodes = []

!(async () => {
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.coincount = 0;
      $.coinerr = "";
      $.blueCionTimes = 0;
      $.isLogin = true;
      console.log(`\n开始【京东账号${$.index}】${$.UserName}\n`);
      message = '';
      subTitle = '';
      await jdSuperMarket();
      await showMsg();
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdSuperMarket() {
  try {
    await receiveBlueCoin();//收蓝币（小费）
    await daySign();//每日签到
    await BeanSign()//
    await doDailyTask();//做日常任务，分享，关注店铺，
    await drawLottery();//抽奖功能(招财进宝)
    await smtg_shopIndex();
    await smtgHome();
    await receiveUserUpgradeBlue();
    await Home();
  } catch (e) {
    $.logErr(e)
  }
}

function showMsg() {
  $.log(`【京东账号${$.index}】${$.nickName}\n${message}`);
  jdNotify = $.getdata('jdSuperMarketNotify') ? $.getdata('jdSuperMarketNotify') : jdNotify;
  if (!jdNotify || jdNotify === 'false') {
    $.msg($.name, subTitle, `【京东账号${$.index}】${$.nickName}\n${message}`);
  }
}

async function drawLottery() {
  console.log(`\n注意⚠:东东超市抽奖已改版,花费500蓝币抽奖一次,现在脚本默认已关闭抽奖功能\n`);
  drawLotteryFlag = $.getdata('jdSuperMarketLottery') ? $.getdata('jdSuperMarketLottery') : drawLotteryFlag;
  if ($.isNode() && process.env.SUPERMARKET_LOTTERY) {
    drawLotteryFlag = process.env.SUPERMARKET_LOTTERY;
  }
  if (`${drawLotteryFlag}` === 'true') {
    const smtg_lotteryIndexRes = await smtg_lotteryIndex();
    if (smtg_lotteryIndexRes && smtg_lotteryIndexRes.data.bizCode === 0) {
      const {result} = smtg_lotteryIndexRes.data
      if (result.blueCoins > result.costCoins && result.remainedDrawTimes > 0) {
        const drawLotteryRes = await smtg_drawLottery();
        console.log(`\n花费${result.costCoins}蓝币抽奖结果${JSON.stringify(drawLotteryRes)}`);
        await drawLottery();
      } else {
        console.log(`\n抽奖失败:已抽奖或者蓝币不足`);
        console.log(`失败详情：\n现有蓝币:${result.blueCoins},抽奖次数:${result.remainedDrawTimes}`)
      }
    }
  } else {
    console.log(`设置的为不抽奖\n`)
  }
}

async function help() {
  return
  console.log(`\n开始助力好友`);
  for (let code of newShareCodes) {
    if (!code) continue;
    const res = await smtgDoAssistPkTask(code);
    console.log(`助力好友${JSON.stringify(res)}`);
  }
}

async function doDailyTask() {
  const smtgQueryShopTaskRes = await smtgQueryShopTask();
  if (smtgQueryShopTaskRes.code === 0 && smtgQueryShopTaskRes.data.success) {
    const taskList = smtgQueryShopTaskRes.data.result.taskList;
    console.log(`\n日常赚钱任务       完成状态`)
    for (let item of taskList) {
      console.log(` ${item['title'].length < 4 ? item['title'] + `\xa0` : item['title'].slice(-4)}         ${item['finishNum'] === item['targetNum'] ? '已完成' : '未完成'} ${item['finishNum']}/${item['targetNum']}`)
    }
    for (let item of taskList) {
      //领奖
      if (item.taskStatus === 1 && item.prizeStatus === 1) {
        const res = await smtgObtainShopTaskPrize(item.taskId);
        console.log(`\n领取做完任务的奖励${JSON.stringify(res)}\n`)
      }
      //做任务
      if ((item.type === 1 || item.type === 11) && item.taskStatus === 0) {
        // 分享任务
        const res = await smtgDoShopTask(item.taskId);
        console.log(`${item.subTitle}结果${JSON.stringify(res)}`)
      }
      if (item.type === 2) {
        //逛会场
        if (item.taskStatus === 0) {
          console.log('开始逛会场')
          const itemId = item.content[item.type].itemId;
          const res = await smtgDoShopTask(item.taskId, itemId);
          console.log(`${item.subTitle}结果${JSON.stringify(res)}`);
        }
      }
      if (item.type === 8) {
        //关注店铺
        if (item.taskStatus === 0) {
          console.log('开始关注店铺')
          const itemId = item.content[item.type].itemId;
          const res = await smtgDoShopTask(item.taskId, itemId);
          console.log(`${item.subTitle}结果${JSON.stringify(res)}`);
        }
      }
      if (item.type === 9) {
        //开卡领蓝币任务
        if (item.taskStatus === 0) {
          console.log('开始开卡领蓝币任务')
          const itemId = item.content[item.type].itemId;
          const res = await smtgDoShopTask(item.taskId, itemId);
          console.log(`${item.subTitle}结果${JSON.stringify(res)}`);
        }
      }
      if (item.type === 10) {
        //关注商品领蓝币
        if (item.taskStatus === 0) {
          console.log('关注商品')
          const itemId = item.content[item.type].itemId;
          const res = await smtgDoShopTask(item.taskId, itemId);
          console.log(`${item.subTitle}结果${JSON.stringify(res)}`);
        }
      }
      if ((item.type === 8 || item.type === 2 || item.type === 10) && item.taskStatus === 0) {
        // await doDailyTask();
      }
    }
  }
}

var _0xod8 = 'jsjiami.com.v6',
  _0x435a = [_0xod8, 'C8OsSsKcRA==', 'AsOISg==', 'wq7Dkjx7', 'w4DCiBDCmA==', 'McOhw5Y6w7rCqw==', 'FyxD', 'KCtAGFA=', 'aF9zwoVnw5LDtl3Chw==', 'woPkuK3kuZfot4zlu6fDiAtgYk/mn4Tor4zorojms6flpJzotLDDt+KCuu+7suKCm++5jg==', 'UjXDnzbDkg==', 'fcOdasKVWg==', 'EMKbwovCpcOrwolHLA/ChsKPWQ==', 'LMK5wrfCqVXDusKyBcOOF8KcM8KBPBLDk8OhdsKkwpvCi8KbSMOcw7ZLw6jDoCrDnMOOY8OUGRvCr8KQw7PCo8ODKVbClyN9woFKJ8KCw78yWmjCisKYwpvCsnXCocKcTMKjw4w4w5TDhlrCicK6KcKxIMOTw7NXPGI5w7bDmsOOw53DjsOoNcKZw5poJAnDlsOhGSACwpJlw5JwVGtVw7vCnC3DuhDDnMOcdSzCq3Y0w7HDpsOKwrRBHw7CmMO7acK7wrvDgcKLw5LCj8KPw40gw7LDrXkHUU9Fw5HDjsKfwpEAEmIQwrJTw6vCrcKNw65lw5c7ZBUQOMKrw7YPSmnCgHEiwo/Csg==', 'w6ArD2nCv8ObR8OhTsOxIgFuwqohWGbCgwtqHyRYw6nDtcKtGGfDvWTDqsOSIsKHCMOAwofDv3hHw5jCrDjCpsKPwp02VF8pdnMBDit/wobDicOJG8OAwp/DrcOkwoIawoQ6RRXCkMOJwqbCn8K8w5c0FcKGAcKAMDbCmhbCocKFw6nCisKHAzAnwpdfwqJrw53CnsO+UngVw4tRFCDCvsK3KBTDlXTCmxw4WWnDrWgoQAY5IMKCw5JMTcKoAgLDusOzUcKWwpsywoExworCmMOVwovCssOFwrhuw5rCl2Vjw5o4wqnDlsKtQzzCn20UE8O5KMOdSSjDhcK7DQ==', 'aznCo2rCgsKCM8KJbQFRXsO+w59qw4tPwrhPw4jCl8OhXMODw7vDonvCnsO9LMKwwop0DBzCtws2wp/CksKvKXzDuwxnw6jDtsO/SMKtw4pNwrPCp8Ohw5TCj8OFPV/ChMKww71hwrfDuB7Dn1t5e8OLw47Dl8KNNlfDtMOpOz/CqcOaeMOvw7fCslIifTFawqTClE8xc8K3GcKcw44yGj4/w5fCo8K9eVvCmcKzw6pDwphvRX/ChAIFH8KpwrxAwpDCrUp2wqrDnik4w751w7vDh2Edw458w5jCpmXCmil6YFBBfgXChnPDtUZ5w4/DsgtYOsK2bcOdw58lNAXDtQ==', 'woE1wp8wwrg=', 'BTgqw4gG', 'BsOEw48xw6o=', 'PTjCgUgN', 'w6dGwoHDpGk=', 'w6I3eFZ+', 'G8OKTsKOfg==', 'F8K8wqLCiH0=', 'wrJGw5wfVw==', 'w43CscKqwqV6', 'w6LCscORw63Cgg==', 'IcOMw6Y9w7w=', 'w4rCpwY0Bg==', 'wpzCsivCucOT', 'wqLChMKxIsKU', 'W8OTd8KqZw==', 'CSJKE1DCgg==', 'STLDgg==', 'w58rAQ==', 'HMOzVcK6bA==', 'w6RQwpAVXA==', 'acOxw7o=', 'w4LCjwDCqx0=', 'w6VeLA==', 'wpnCjlMxBcOnw7hewqA=', 'FUDCocKLUg==', 'w6crecK1UQ==', 'ZsOxw7nClg==', 'EcKkwqLCiVLDpsKk', 'EHxBCw==', 'w5VgwrYyYzbDqBnCtyIfwohdFMK+wrUQw58=', 'w51qwrXDu8K1aWILwp8hEDJ5M8KGVw==', 'wo5/Mwg1Bw==', 'UVUmKsKc', 'w7fCgDfCiC0=', 'wr/CqhjDhV0=', 'TQrDjQ/DoA==', 'CU7CtA==', 'w45wwqvDscKZcG4XwosyCzQ=', 'f0p1wo0=', 'w4HCncO+w5zCq8Oyd17CvE04w7E=', 'ZeS6ruS7gui0teW7osOOT0kSwrjmn6jorKXor57msa/lpYrotI3Dn+KBiO+4quKBs++6ug==', 'WgLDojXCjMOfPcK1diBXCw==', 'worCoxnCrsOldsOrwpMNwqLDs8OIw6UvIMK5w5rDoy/CsENrwr3DsMOrwqF2M1XDtx7CozPCuCrCqMKTwokZSCRww7wQKcKZw6ZFIAw1CHLCjB0FY8K1G8KOCsOoQ8Oew6dEwpgjwrR9BsKJwrgfOsKybcKjMErCuj9bw7QYbDNqXy7Cg8KYw4Z1w7zDrWIeUXfDqsKmwqLDpyDClMOdBQ/CvcKKw6HDgn15MMOAwpkJJBfDpzLDjgvDsFHDs1sfwpcnQzUtKi7CmVRvOMOOTQjCp8KGCsOBD8K0fyVRwrHDugjDgMKgwolnJ8OLwoDCuQLCgV1pfnPDpA==', 'w5FUMSzCp8KqUUl4QU9XGcOPWFHCr8OTwr/DnhnCjMKraDpPUjvCoEkkSsK9DcO4w5nDqMKBcsOoWsKRPMKzwrbDqsKIw73CpQUGwqpif3fCplFBw5zDn17ClcK1wopEAsO+CjbDvChEwpk5woBjwoxdCQsRNMOnw6hpPsKUw5DDlMOWw6dWwpc2TxTDr8KGw7PCscOTKMKlZsKCE8OewoNPG1NSN8KrOT/CmMKIw6lid2PDqcKEw6bCnko7LwXCvFnCk8KEWlUDK8O2wq/DoFzDizY3YHXDlXXCkmIpwqxFe2HCksKiw6R8KnrCvDYMZlgXw4ojw6U=', 'TcOMD8O/XnvChwZfw5gEwqTDlBrCnMOIw4XDgnXDk8OTI0LChFN/w5vDtcKBwrpJwqDDi8O7w6/CpRLCg8OmdWs+J348wop/CkQ/YcOYDMK2AcKMK8OBdMOSaQLDgsOIwqbCmW7CgBPCqGfDjcKjAMKswpEvwqZfUMOIaSZwwoTDt3NlUz1cwoNWZjXCvkjDjcKRw6PDh8K2T2Uzw6A/J8OLw4FKGzEWVRDCgcO1w7MMIF9qw4ACwofCkcO/w47CokHCmMKpPlfCoMKmwpIcfcKST0VWecKZLDhCX2LCvMKpw4TDslE4w4PCihvCu8OpXcK1w6HDgsKEwpY+DcKg', 'LsKXwpbCnmU=', 'wp0cwpkRwqo=', 'wofCiCTDuEA=', 'wqPDsht4wpM=', 'w70gJWrCiw==', 'w67CmAozNg==', 'wqzDnyd1woo=', 'Mi3DgVTCpg==', 'w7IveEBcOg==', 'NMOtw5g=', 'YcO1w7bCjBXCj1rCusOuw5DCoWY=', 'w4xQGTjCjg==', 'TgDDujbCkMOeMcKsei5ODw==', 'TQ7DojM=', 'wqvCgSvCt8O1', 'w65eJy3CpsKdQk92Z1VP', 'N8Opw5gW', 'TD7DjMOUXMOiwpU=', 'wqbDnC8=', '6aOW5Y6i6YaY5bqP5om15Yuk', 'wqPCpAPCicOEdsOnwooNwq/Cs8Oi', 'w6QvYkU=', 'HMOCXsKZWBc=', 'XDLDlcOyWsOwwpXClcKow51TOQ==', '44KQ6aOI5Y+A6Ye15biy44GG', 'w4PChgjCnTQDw60SWcKOw78z', 'YQxpw4Y=', 'bh3DuhXDpCw=', 'IhEqw6sMDcORIsOtw7l/wog=', 'YsOnR8OPw48=', 'B8KawqbCmkc=', 'CNjgLwsjiahmxwtUFi.kcom.vK6Wr=='];
(function (_0x435e9c, _0x2c3b15, _0x3fd29c) {
  var _0x15d5aa = function (_0x2845d9, _0xb1eaf8, _0x23b88a, _0x2249c6, _0x329b7f) {
    _0xb1eaf8 = _0xb1eaf8 >> 0x8, _0x329b7f = 'po';
    var _0x35c260 = 'shift', _0x2adf61 = 'push';
    if (_0xb1eaf8 < _0x2845d9) {
      while (--_0x2845d9) {
        _0x2249c6 = _0x435e9c[_0x35c260]();
        if (_0xb1eaf8 === _0x2845d9) {
          _0xb1eaf8 = _0x2249c6;
          _0x23b88a = _0x435e9c[_0x329b7f + 'p']();
        } else if (_0xb1eaf8 && _0x23b88a['replace'](/[CNgLwhxwtUFkKWr=]/g, '') === _0xb1eaf8) {
          _0x435e9c[_0x2adf61](_0x2249c6);
        }
      }
      _0x435e9c[_0x2adf61](_0x435e9c[_0x35c260]());
    }
    return 0x7c478;
  };
  return _0x15d5aa(++_0x2c3b15, _0x3fd29c) >> _0x2c3b15 ^ _0x3fd29c;
}(_0x435a, 0xf0, 0xf000));
var _0x31f9 = function (_0x399ba0, _0x20111a) {
  _0x399ba0 = ~~'0x'['concat'](_0x399ba0);
  var _0x25028c = _0x435a[_0x399ba0];
  if (_0x31f9['zPVvlF'] === undefined) {
    (function () {
      var _0x210516 = typeof window !== 'undefined' ? window : typeof process === 'object' && typeof require === 'function' && typeof global === 'object' ? global : this;
      var _0x57bbc1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      _0x210516['atob'] || (_0x210516['atob'] = function (_0x20394a) {
        var _0x2b515a = String(_0x20394a)['replace'](/=+$/, '');
        for (var _0x1de264 = 0x0, _0x45341e, _0x202179, _0x2931f0 = 0x0, _0x25ac2b = ''; _0x202179 = _0x2b515a['charAt'](_0x2931f0++); ~_0x202179 && (_0x45341e = _0x1de264 % 0x4 ? _0x45341e * 0x40 + _0x202179 : _0x202179, _0x1de264++ % 0x4) ? _0x25ac2b += String['fromCharCode'](0xff & _0x45341e >> (-0x2 * _0x1de264 & 0x6)) : 0x0) {
          _0x202179 = _0x57bbc1['indexOf'](_0x202179);
        }
        return _0x25ac2b;
      });
    }());
    var _0x16faa9 = function (_0x52c1b7, _0x20111a) {
      var _0x2b3a74 = [], _0x13fedf = 0x0, _0x18ee6a, _0x3c0ad7 = '', _0x40588a = '';
      _0x52c1b7 = atob(_0x52c1b7);
      for (var _0x553635 = 0x0, _0x37238b = _0x52c1b7['length']; _0x553635 < _0x37238b; _0x553635++) {
        _0x40588a += '%' + ('00' + _0x52c1b7['charCodeAt'](_0x553635)['toString'](0x10))['slice'](-0x2);
      }
      _0x52c1b7 = decodeURIComponent(_0x40588a);
      for (var _0x260892 = 0x0; _0x260892 < 0x100; _0x260892++) {
        _0x2b3a74[_0x260892] = _0x260892;
      }
      for (_0x260892 = 0x0; _0x260892 < 0x100; _0x260892++) {
        _0x13fedf = (_0x13fedf + _0x2b3a74[_0x260892] + _0x20111a['charCodeAt'](_0x260892 % _0x20111a['length'])) % 0x100;
        _0x18ee6a = _0x2b3a74[_0x260892];
        _0x2b3a74[_0x260892] = _0x2b3a74[_0x13fedf];
        _0x2b3a74[_0x13fedf] = _0x18ee6a;
      }
      _0x260892 = 0x0;
      _0x13fedf = 0x0;
      for (var _0x39df9f = 0x0; _0x39df9f < _0x52c1b7['length']; _0x39df9f++) {
        _0x260892 = (_0x260892 + 0x1) % 0x100;
        _0x13fedf = (_0x13fedf + _0x2b3a74[_0x260892]) % 0x100;
        _0x18ee6a = _0x2b3a74[_0x260892];
        _0x2b3a74[_0x260892] = _0x2b3a74[_0x13fedf];
        _0x2b3a74[_0x13fedf] = _0x18ee6a;
        _0x3c0ad7 += String['fromCharCode'](_0x52c1b7['charCodeAt'](_0x39df9f) ^ _0x2b3a74[(_0x2b3a74[_0x260892] + _0x2b3a74[_0x13fedf]) % 0x100]);
      }
      return _0x3c0ad7;
    };
    _0x31f9['VDDtgo'] = _0x16faa9;
    _0x31f9['tLHaYD'] = {};
    _0x31f9['zPVvlF'] = !![];
  }
  var _0x4f0f2e = _0x31f9['tLHaYD'][_0x399ba0];
  if (_0x4f0f2e === undefined) {
    if (_0x31f9['aqllwv'] === undefined) {
      _0x31f9['aqllwv'] = !![];
    }
    _0x25028c = _0x31f9['VDDtgo'](_0x25028c, _0x20111a);
    _0x31f9['tLHaYD'][_0x399ba0] = _0x25028c;
  } else {
    _0x25028c = _0x4f0f2e;
  }
  return _0x25028c;
};

function smtgHome() {
  var _0x2b0b51 = {
    'Tnybf': function (_0x3cfac6, _0x5ebf63) {
      return _0x3cfac6(_0x5ebf63);
    }, 'KfcyW': _0x31f9('2c', 'dS]p'), 'ULcFc': function (_0xf3db46, _0x4ddbc1) {
      return _0xf3db46 === _0x4ddbc1;
    }, 'OZgNt': _0x31f9('2d', 'niHx'), 'fgcRm': function (_0x218926, _0xe4ad23) {
      return _0x218926(_0xe4ad23);
    }, 'bynrM': function (_0x4ded26, _0x51a247) {
      return _0x4ded26 !== _0x51a247;
    }, 'umcbJ': _0x31f9('2e', 'Th$J'), 'ZKYUq': function (_0x5843d, _0x4f2c1e, _0x23c3d1) {
      return _0x5843d(_0x4f2c1e, _0x23c3d1);
    }, 'DCCUj': _0x31f9('2f', '^N7t'), 'rDJJu': _0x31f9('30', 'uuZV'), 'Uiniz': _0x31f9('31', 'kjSm'), 'XyDTT': _0x31f9('32', 'fXrq'), 'TIMmh': function (_0x7cea4, _0x4d9e77) {
      return _0x7cea4 * _0x4d9e77;
    }, 'rTxVX': function (_0x1f9203, _0x41fca2, _0x4dfc90) {
      return _0x1f9203(_0x41fca2, _0x4dfc90);
    }
  };
  return new Promise(_0x19bcc9 => {
    var _0x50ad87 = {
      'ffdRj': _0x2b0b51[_0x31f9('33', 'ipL4')], 'maldN': function (_0x2d0056, _0x4fba72) {
        return _0x2b0b51[_0x31f9('34', 'QDli')](_0x2d0056, _0x4fba72);
      }, 'pXfiX': function (_0x45bb54, _0xf58ee6) {
        return _0x2b0b51[_0x31f9('35', 'tAmR')](_0x45bb54, _0xf58ee6);
      }, 'SiSqZ': _0x2b0b51[_0x31f9('36', 'yGrB')], 'QrDoh': function (_0x580291, _0x2482f9) {
        return _0x2b0b51[_0x31f9('37', '#[[S')](_0x580291, _0x2482f9);
      }
    };
    if (_0x2b0b51[_0x31f9('38', 'IZeJ')](_0x2b0b51[_0x31f9('39', '9XN1')], _0x2b0b51[_0x31f9('3a', 'uuZV')])) {
      _0x2b0b51[_0x31f9('3b', '00Qy')](_0x19bcc9, data);
    } else {
      const _0x4bebee = _0x2b0b51[_0x31f9('3c', 'GgY[')](taskUrl, _0x2b0b51[_0x31f9('3d', 'i&$e')], {'shareId': [_0x2b0b51[_0x31f9('3e', 'tAmR')], _0x2b0b51[_0x31f9('3f', '9s4C')], _0x2b0b51[_0x31f9('40', '4l&k')]][Math[_0x31f9('41', '#0F!')](_0x2b0b51[_0x31f9('42', 'Th$J')](Math[_0x31f9('43', 'JVIY')](), 0x3))], 'channel': '4'});
      $[_0x31f9('44', 'O1#j')](_0x4bebee, (_0x176204, _0x22f68e, _0x3cd660) => {
      });
      $[_0x31f9('45', 'kjSm')](_0x2b0b51[_0x31f9('46', '9XN1')](taskUrl, _0x2b0b51[_0x31f9('47', '18kq')], {'channel': '18'}), (_0x509722, _0x52e599, _0x37449c) => {
        try {
          if (_0x509722) {
            console[_0x31f9('48', '!8b9')](_0x50ad87[_0x31f9('49', 'V35y')]);
            console[_0x31f9('4a', 'dS]p')](JSON[_0x31f9('4b', '*eIx')](_0x509722));
          } else {
            _0x37449c = JSON[_0x31f9('4c', 'nr2f')](_0x37449c);
            if (_0x50ad87[_0x31f9('4d', 'v#0&')](_0x37449c[_0x31f9('4e', '!8b9')], 0x0) && _0x37449c[_0x31f9('1f', '1v!Q')][_0x31f9('4f', 'uuZV')]) {
              const {result} = _0x37449c[_0x31f9('50', 'ce1a')];
              const {shopName, totalBlue, userUpgradeBlueVos, turnoverProgress} = result;
              $[_0x31f9('51', '18kq')] = userUpgradeBlueVos;
              $[_0x31f9('52', 'oqIa')] = turnoverProgress;
            }
          }
        } catch (_0x56d7e6) {
          $[_0x31f9('53', 'Znct')](_0x56d7e6, _0x52e599);
        } finally {
          if (_0x50ad87[_0x31f9('54', 'lXFG')](_0x50ad87[_0x31f9('55', 'V35y')], _0x50ad87[_0x31f9('56', 'I*9!')])) {
            _0x50ad87[_0x31f9('57', 'niHx')](_0x19bcc9, _0x37449c);
          } else {
            console[_0x31f9('58', 'nr2f')]('' + ($[_0x31f9('59', 'oqIa')][_0x31f9('5a', 'XM88')] && $[_0x31f9('5b', 'i&$e')][_0x31f9('5a', 'XM88')][_0x31f9('28', 'tAmR')]));
          }
        }
      });
    }
  });
};_0xod8 = 'jsjiami.com.v6';

function receiveBlueCoin(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      $.get(taskUrl('smtg_receiveCoin', {"type": 2, "channel": "18"}), async (err, resp, data) => {
        try {
          if (err) {
            console.log('\n东东超市: API查询请求失败 ‼️‼️')
            console.log(JSON.stringify(err));
          } else {
            data = JSON.parse(data);
            $.data = data;
            if ($.data.data.bizCode !== 0 && $.data.data.bizCode !== 809) {
              $.coinerr = `${$.data.data.bizMsg}`;
              message += `【收取小费】${$.data.data.bizMsg}\n`;
              console.log(`收取蓝币失败：${$.data.data.bizMsg}`)
              return
            }
            if ($.data.data.bizCode === 0) {
              $.coincount += $.data.data.result.receivedBlue;
              $.blueCionTimes++;
              console.log(`【京东账号${$.index}】${$.nickName} 第${$.blueCionTimes}次领蓝币成功，获得${$.data.data.result.receivedBlue}个\n`)
              if (!$.data.data.result.isNextReceived) {
                message += `【收取小费】${$.coincount}个\n`;
                return
              }
            }
            await receiveBlueCoin(3000);
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    }, timeout)
  })
}

async function daySign() {
  const signDataRes = await smtgSign({"shareId": "QcSH6BqSXysv48bMoRfTBz7VBqc5P6GodDUBAt54d8598XAUtNoGd4xWVuNtVVwNO1dSKcoaY3sX_13Z-b3BoSW1W7NnqD36nZiNuwrtyO-gXbjIlsOBFpgIPMhpiVYKVAaNiHmr2XOJptu14d8uW-UWJtefjG9fUGv0Io7NwAQ", "channel": "4"});
  await smtgSign({"shareId": "TBj0jH-x7iMvCMGsHfc839Tfnco6UarNx1r3wZVIzTZiLdWMRrmoocTbXrUOFn0J6UIir16A2PPxF50_Eoo7PW_NQVOiM-3R16jjlT20TNPHpbHnmqZKUDaRajnseEjVb-SYi6DQqlSOioRc27919zXTEB6_llab2CW2aDok36g", "channel": "4"});
  if (signDataRes && signDataRes.code === 0) {
    const signList = await smtgSignList();
    if (signList.data.bizCode === 0) {
      $.todayDay = signList.data.result.todayDay;
    }
    if (signDataRes.code === 0 && signDataRes.data.success) {
      message += `【第${$.todayDay}日签到】成功，奖励${signDataRes.data.result.rewardBlue}蓝币\n`
    } else {
      message += `【第${$.todayDay}日签到】${signDataRes.data.bizMsg}\n`
    }
  }
}

async function BeanSign() {
  const beanSignRes = await smtgSign({"channel": "1"});
  if (beanSignRes && beanSignRes.data['bizCode'] === 0) {
    console.log(`每天从指定入口进入游戏,可获得额外奖励:${JSON.stringify(beanSignRes)}`)
  }
}

function smtgSign(body) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_sign', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

async function receiveUserUpgradeBlue() {
  $.receiveUserUpgradeBlue = 0;
  if ($.userUpgradeBlueVos && $.userUpgradeBlueVos.length > 0) {
    for (let item of $.userUpgradeBlueVos) {
      const receiveCoin = await smtgReceiveCoin({"id": item.id, "type": 5})
      // $.log(`\n${JSON.stringify(receiveCoin)}`)
      if (receiveCoin && receiveCoin.data['bizCode'] === 0) {
        $.receiveUserUpgradeBlue += receiveCoin.data.result['receivedBlue']
      }
    }
    $.log(`店铺升级奖励获取:${$.receiveUserUpgradeBlue}蓝币\n`)
  }
  const res = await smtgReceiveCoin({"type": 4, "channel": "18"})
  // $.log(`${JSON.stringify(res)}\n`)
  if (res && res.data['bizCode'] === 0) {
    console.log(`\n收取营业额：获得 ${res.data.result['receivedTurnover']}\n`);
  }
}

async function Home() {
  const homeRes = await smtgHome();
  if (homeRes && homeRes.data['bizCode'] === 0) {
    const {result} = homeRes.data;
    const {shopName, totalBlue} = result;
    subTitle = shopName;
    message += `【总蓝币】${totalBlue}个\n`;
  }
}

function smtg_shopIndex() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_shopIndex', {"channel": 1}), async (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
          if (data && data.data['bizCode'] === 0) {
            const {shopId, shelfList, merchandiseList, level} = data.data['result'];
            message += `【店铺等级】${level}\n`;
            if (shelfList && shelfList.length > 0) {
              for (let item of shelfList) {
                //status: 2可解锁,1可升级,-1不可解锁
                if (item['status'] === 2) {
                  $.log(`${item['name']}可解锁\n`)
                  await smtg_shelfUnlock({shopId, "shelfId": item['id'], "channel": 1})
                } else if (item['status'] === 1) {
                  $.log(`${item['name']}可升级\n`)
                  await smtg_shelfUpgrade({shopId, "shelfId": item['id'], "channel": 1, "targetLevel": item['level'] + 1});
                } else if (item['status'] === -1) {
                  $.log(`[${item['name']}] 未解锁`)
                } else if (item['status'] === 0) {
                  $.log(`[${item['name']}] 已解锁，当前等级：${item['level']}级`)
                } else {
                  $.log(`未知店铺状态(status)：${item['status']}\n`)
                }
              }
            }
            if (data.data['result']['forSaleMerchandise']) {
              $.log(`\n限时商品${data.data['result']['forSaleMerchandise']['name']}已上架`)
            } else {
              if (merchandiseList && merchandiseList.length > 0) {
                for (let item of merchandiseList) {
                  console.log(`发现限时商品${item.name}\n`);
                  await smtg_sellMerchandise({"shopId": shopId, "merchandiseId": item['id'], "channel": "18"})
                }
              }
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

function smtg_shelfUnlock(body) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_shelfUnlock', body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
        } else {
          $.log(`解锁店铺结果:${data}\n`)
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

function smtg_shelfUpgrade(body) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_shelfUpgrade', body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
        } else {
          $.log(`店铺升级结果:${data}\n`)
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

function smtg_sellMerchandise(body) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_sellMerchandise', body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
        } else {
          $.log(`限时商品售卖结果:${data}\n`)
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

function smtgDoShopTask(taskId, itemId) {
  return new Promise((resolve) => {
    const body = {
      "taskId": taskId,
      "channel": "18"
    }
    if (itemId) {
      body.itemId = itemId;
    }
    $.get(taskUrl('smtg_doShopTask', body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtgObtainShopTaskPrize(taskId) {
  return new Promise((resolve) => {
    const body = {
      "taskId": taskId
    }
    $.get(taskUrl('smtg_obtainShopTaskPrize', body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtgQueryShopTask() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_queryShopTask'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtgSignList() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_signList', {"channel": "18"}), (err, resp, data) => {
      try {
        // console.log('ddd----ddd', data)
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtgDoAssistPkTask(code) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_doAssistPkTask', {"inviteCode": code}), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtgReceiveCoin(body) {
  $.goldCoinData = {};
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_receiveCoin', body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_joinPkTeam(teamId, inviteCode, sharePkActivityId) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_joinPkTeam', {teamId, inviteCode, "channel": "3", sharePkActivityId}), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_getTeamPkDetailInfo() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_getTeamPkDetailInfo'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_businessCirclePKDetail() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_businessCirclePKDetail'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_getBusinessCircleList() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_getBusinessCircleList'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_joinBusinessCircle(circleId) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_joinBusinessCircle', {circleId}), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_businessCircleIndex() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_businessCircleIndex'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_receivedPkTeamPrize() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_receivedPkTeamPrize', {"channel": "1"}), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_getPkPrize() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_getPkPrize'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_quitBusinessCircle() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_quitBusinessCircle'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_shelfList() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_shelfList'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_shelfProductList(shelfId) {
  return new Promise((resolve) => {
    console.log(`开始检查货架[${shelfId}] 可上架产品`)
    $.get(taskUrl('smtg_shelfProductList', {shelfId}), (err, resp, data) => {
      try {
        // console.log(`检查货架[${shelfId}] 可上架产品结果:${data}`)
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_upgradeProduct(productId) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_upgradeProduct', {productId}), (err, resp, data) => {
      try {
        // console.log(`升级商品productId[${productId}]结果:${data}`);
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
        } else {
          console.log(`升级商品结果\n${data}`);
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

function smtg_unlockProduct(productId) {
  return new Promise((resolve) => {
    console.log(`开始解锁商品`)
    $.get(taskUrl('smtg_unlockProduct', {productId}), (err, resp, data) => {
      try {
        // console.log(`解锁商品productId[${productId}]结果:${data}`);
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_upgradeShelf(shelfId) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_upgradeShelf', {shelfId}), (err, resp, data) => {
      try {
        // console.log(`升级货架shelfId[${shelfId}]结果:${data}`);
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
        } else {
          console.log(`升级货架结果\n${data}`)
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

function smtg_unlockShelf(shelfId) {
  return new Promise((resolve) => {
    console.log(`开始解锁货架`)
    $.get(taskUrl('smtg_unlockShelf', {shelfId}), (err, resp, data) => {
      try {
        // console.log(`解锁货架shelfId[${shelfId}]结果:${data}`);
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_ground(productId, shelfId) {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_ground', {productId, shelfId}), (err, resp, data) => {
      try {
        // console.log(`上架商品结果:${data}`);
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_productList() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_productList'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_lotteryIndex() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_lotteryIndex', {"costType": 1, "channel": 1}), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function smtg_drawLottery() {
  return new Promise(async (resolve) => {
    await $.wait(1000);
    $.get(taskUrl('smtg_drawLottery', {"costType": 1, "channel": 1}), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n东东超市: API查询请求失败 ‼️‼️')
          console.log(JSON.stringify(err));
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

function shareCodesFormat() {
  return new Promise(resolve => {
    console.log(`第${$.index}个京东账号的助力码:::${jdSuperMarketShareArr[$.index - 1]}`)
    if (jdSuperMarketShareArr[$.index - 1]) {
      newShareCodes = jdSuperMarketShareArr[$.index - 1].split('@');
    } else {
      console.log(`由于您未提供与京京东账号相对应的shareCode,下面助力将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > shareCodes.length ? (shareCodes.length - 1) : ($.index - 1);
      newShareCodes = shareCodes[tempIndex].split('@');
    }
    console.log(`格式化后第${$.index}个京东账号的助力码${JSON.stringify(newShareCodes)}`)
    resolve();
  })
}

function requireConfig() {
  return new Promise(resolve => {
    notify = $.isNode() ? require('./sendNotify') : '';
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
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
    console.log(`共${cookiesArr.length}个京东账号\n`);
    resolve()
  })
}

function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=jdsupermarket&clientVersion=8.0.0&client=m&body=${escape(JSON.stringify(body))}&t=${Date.now()}`,
    headers: {
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Host': 'api.m.jd.com',
      'Cookie': cookie,
      'Referer': 'https://jdsupermarket.jd.com/game',
      'Origin': 'https://jdsupermarket.jd.com',
    }
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
        const [o, h] = i.split("@"), n = {url: `http://${h}/v1/scripting/evaluate`, body: {script_text: t, mock_type: "cron", timeout: r}, headers: {"X-Key": o, Accept: "*/*"}};
        this.post(n, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }

    loaddata() {
      if (!this.isNode()) return {};
      {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
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
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
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
      let i = {"M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds()};
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