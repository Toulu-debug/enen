/**
 * 每周质量报告
 * cron: 0 0 * * 1
 * desc: 每周一凌晨0点执行，更新上周的质量报告
 */

import {subDays, format, getTime} from "date-fns";
import axios from "axios";
import {sendNotify} from './sendNotify';
import USER_AGENT, {requireConfig, wait} from "./TS_USER_AGENTS";

const PrettyTable = require('prettytable');

const START: number = getTime(new Date(format(subDays(Date.now(), 7), 'yyyy-MM-dd 00:00:00')))
let cookie: string = '', res: any = '', UserName: string, index: number, message: string = ''
let headers = ["Type", "Used", "Total"]

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)
    let flag: boolean = true, page: number = 0, redNum: number = 0, total: number = 0
    let jx: number = 0, jxUsed: number = 0, js: number = 0, jsUsed: number = 0, jk: number = 0, jkUsed: number = 0, jd: number = 0, jdUsed: number = 0, all: number = 0, allUsed: number = 0
    let pt = new PrettyTable(), rows = []
    while (1) {
      if (flag) {
        res = await api(page)
        for (let t of res.data.unUseRedInfo.redList) {
          if (t.beginTime * 1000 > START) {
            redNum++
            total = accAdd(total, t.discount * 1)
            if (t.orgLimitStr.indexOf('京喜') > -1) {
              jx = accAdd(jx, t.discount * 1)
              jxUsed = accAdd(jxUsed, accSub(t.discount * 1, t.balance * 1))
            } else if (t.orgLimitStr.indexOf('极速') > -1) {
              js = accAdd(js, t.discount * 1)
              jsUsed = accAdd(jsUsed, accSub(t.discount * 1, t.balance * 1))
            } else if (t.orgLimitStr.indexOf('健康') > -1) {
              jk = accAdd(jk, t.discount * 1)
              jkUsed = accAdd(jkUsed, accSub(t.discount * 1, t.balance * 1))
            } else if (t.orgLimitStr.indexOf('京东商城') > -1) {
              jd = accAdd(jd, t.discount * 1)
              jdUsed = accAdd(jdUsed, accSub(t.discount * 1, t.balance * 1))
            } else {
              all = accAdd(all, t.discount * 1)
              allUsed = accAdd(allUsed, accSub(t.discount * 1, t.balance * 1))
            }
          } else {
            flag = false
          }
        }
        page++
        await wait(1000)
      } else {
        break
      }

    }
    message += `【京东账号${index}】${UserName}\n京喜：${jx}，已用${jxUsed}\n极速：${js}，已用${jsUsed}\n健康：${jk}，已用${jkUsed}\n京东：${jd}，已用${jdUsed}\n通用：${all}，已用${allUsed}\n合计：${total}元，共${redNum}个红包\n\n`

    // console.log('红包数量', redNum)
    // console.log('总计', total)
    // console.log('京喜', jxUsed, '/', jx)
    // console.log('极速', jsUsed, '/', js)
    // console.log('健康', jkUsed, '/', jk)
    // console.log('京东', jdUsed, '/', jd)
    // console.log('通用', allUsed, '/', all)

    rows.push(['JX', jxUsed, jx])
    rows.push(['JS', jsUsed, js])
    rows.push(['JK', jkUsed, jk])
    rows.push(['JD', jdUsed, jd])
    rows.push(['General', allUsed, all])
    rows.push(['Count', '', redNum])
    rows.push(['Total', '', total])
    pt.create(headers, rows);
    pt.print();
  }
  if (message) {
    await sendNotify('每周质量报告', message)
  }
})()

async function api(page: number) {
  let {data} = await axios.get(`https://wq.jd.com/user/info/QueryUserRedEnvelopesV2?type=2&orgFlag=JD_PinGou_New&page=${page}&cashRedType=1&redBalanceFlag=0&channel=3&_=${Date.now()}&sceneval=2`, {
    headers: {
      'authority': 'wq.jd.com',
      'user-agent': USER_AGENT,
      'referer': 'https://wqs.jd.com/',
      'cookie': cookie
    }
  })
  return data
}

function accAdd(arg1: number, arg2: number) {
  let r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return parseFloat(((arg1 * m + arg2 * m) / m).toFixed(2))
}

function accSub(arg1, arg2) {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n))
}