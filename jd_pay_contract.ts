/**
 * Env("检查并停用免密支付")
 * cron: 35 21 * * *
 */

import axios from 'axios'
import { sendNotify as notify } from './sendNotify'
import USER_AGENT, { requireConfig, wait } from './TS_USER_AGENTS'

export interface ResponseModel {
  errcode: number,
  data?: {
    status: number
  },
  msg?: string
}

export class PayContract {
  cookie?: string

  constructor(cookie: string) {
    this.cookie = cookie
  }

  async check() {
    const response: ResponseModel = await this.fetch(`/wxcontractgw/querypappaycontract`)
    if (response.errcode === 0) {
      if (response.data.status === 1) {
        return 'disabled'
      } else {
        return 'enabled'
      }
    } else {
      console.log(response)
    }
    return 'invalid'
  }

  async terminate() {
    const response: ResponseModel = await this.fetch(`/wxcontractgw/terminatepappaycontract`)
    const result: boolean = response.errcode === 0
    if (!result) {
      console.log(response)
    }
    return result
  }

  async fetch(api: string) {
    return axios.get(`https://wq.jd.com${api}?appid=wxae3e8056daea8727&_=${(new Date()).getTime()}&g_login_type=0&callback=jsonpCBKE&g_tk=1600943825&g_ty=ls`, {
      headers: {
        "Host": "wq.jd.com",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent": USER_AGENT,
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Referer": "https://wqs.jd.com/",
        "Cookie": this.cookie
      }
    })
      .then((response) => {
        if (typeof response.data === 'string') {
          return JSON.parse(response.data.match(/\{.*\}/)[0])
        } else {
          return response.data
        }
      })
      .catch((error) => {
        console.log(error?.response?.status, error?.response?.statusText)
      })
  }
}

!(async () => {
  if (!process.env) {
    process.env = {}
  }
  if (!process.env['JD_PAY_CONTRACT']) {
    process.env['JD_PAY_CONTRACT'] = false
  }
  if (process.env['JD_PAY_CONTRACT'].toString().toLocaleLowerCase() !== 'true') {
    console.log(`当前未启用检查并停用免密支付\n如需启用请添加 JD_PAY_CONTRACT=true\n`)
    console.log(`如果有个别账户需要跳过检查\n请添加 JD_PAY_CONTRACT_IGNORE=pin\n提示：多个账户请多次添加\n`)
    return
  }
  let cookies: Array<string> = await requireConfig()
  if (typeof cookies[0] === 'undefined') {
    console.log(`当前似乎没有任何 Cookie，请先添加\n`)
    return
  }
  let sendNotify: boolean = false
  let ignorePins: Array<string> = []
  let logs: Array<string> = []
  if (process.env['JD_PAY_CONTRACT_IGNORE']) {
    if (process.env['JD_PAY_CONTRACT_IGNORE'].indexOf('&') !== -1) {
      ignorePins = process.env['JD_PAY_CONTRACT_IGNORE'].split('&')
    } else if (process.env['JD_PAY_CONTRACT_IGNORE'].indexOf("\n") !== -1) {
      ignorePins = process.env['JD_PAY_CONTRACT_IGNORE'].split("\n")
    } else {
      ignorePins = [process.env['JD_PAY_CONTRACT_IGNORE']]
    }
  }
  console.log(`如果有个别账户需要跳过检查\n请添加 JD_PAY_CONTRACT_IGNORE=pin\n提示：多个账户请多次添加\n`)
  for (let i: number = 0; i < cookies.length; i++) {
    let matches: Object = cookies[i].match(/pt_pin=([^;\s]+)/)
    if (!matches) {
      sendNotify = true
      console.log(`*********【京东账户${i + 1}】*********\nCookie 格式错误，请检查\n${cookies[i]}\n`)
      logs.push(`【京东账户${i + 1}】`)
      logs.push(`Cookie 格式错误，请检查\n`)
      continue
    }
    let pin: string = matches[1]
    console.log(`*********【京东账户${i + 1}】${decodeURIComponent(pin)}*********\n`)
    logs.push(`【京东账户${i + 1}】${decodeURIComponent(pin)}`)
    if (ignorePins.indexOf(pin) !== -1) {
      console.log(`🙅‍♀️该账户已被设定为跳过检查\n`)
      logs.push(`🙅‍♀️该账户已被设定为跳过检查\n`)
      continue
    }
    let contract: PayContract = new PayContract(cookies[i])
    let result: string = await contract.check()
    if (result === 'invalid') {
      sendNotify = true
      logs.push(`🤦‍♀️该账户 Cookie 已失效\n`)
      console.log(`🤦‍♀️该账户 Cookie 已失效\n`)
      wait(3000)
      continue
    }
    if (result === 'enabled') {
      sendNotify = true
      console.log(`🤦‍♀️该账户已启用免密支付，正在尝试停用 ...`)
      await wait(3000)
      let successfully: boolean = await contract.terminate()
      if (successfully) {
        logs.push(`✅已成功停用免密支付\n`)
        console.log(`✅已成功停用免密支付！\n`)
      } else {
        logs.push(`❎免密支付停用失败，请手动停用\n`)
        console.log(`❎免密支付停用失败！请手动停用：`)
        console.log(`京东购物或者京喜小程序 -> 我的 -> 右上角齿轮⚙️ -> 微信免密支付 -> 已开通，点击去关闭`)
      }
      await wait(3000)
      continue
    }
    if (result === 'disabled') {
      logs.push(`🎉该账户未启用免密支付，请继续保持\n`)
      console.log(`🎉该账户未启用免密支付，请继续保持！\n`)
      await wait(3000)
      continue
    }
    sendNotify = true
    logs.push(`❌发生未知错误，请检查日志\n`)
    console.log(`❌发生未知错误\n`)
    await wait(3000)
  }
  if (sendNotify && logs.length > 0) {
    logs.push(`京东购物或者京喜小程序 -> 我的 -> 右上角齿轮⚙️ -> 微信免密支付 -> 已开通，点击去关闭`)
    await notify("检查并停用免密支付", logs.join("\n"))
  }
})()
