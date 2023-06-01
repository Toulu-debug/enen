import axios from "axios"
import {format} from "date-fns"
import * as CryptoJS from 'crypto-js'

class H5ST {
  tk: string
  timestamp: string
  rd: string
  appId: string
  fp: string
  time: number
  ua: string
  enc: string
  url: string
  og: string
  pin: string
  iosVer: string
  api: string

  constructor(appId: string, ua: string, fp: string, url: string, og: string, pin?: string) {
    this.appId = appId
    this.ua = ua
    this.iosVer = ua.match(/iPhone OS (\d{2}_\d)/)[1]
    this.fp = fp
    this.url = url
    this.og = og
    this.pin = pin || ''
    this.api = 'https://sharecodepool.cnmb.win/api'
  }

  async __genAlgo() {
    this.time = Date.now()
    this.timestamp = format(this.time, "yyyyMMddHHmmssSSS")
    let {data: expandParams} = await axios.post(`${this.api}/expandParams`, {
      iosVer: this.iosVer,
      ua: this.ua,
      pin: this.pin,
      url: this.url,
      og: this.og,
      appId: this.appId,
      fp: this.fp
    })
    let {data: algo} = await axios.post(`https://cactus.jd.com/request_algo?g_ty=ajax`, {
      'version': '3.1',
      'fp': this.fp,
      'appId': this.appId.toString(),
      'timestamp': this.time,
      'platform': 'web',
      'expandParams': expandParams
    }, {
      headers: {
        'authority': 'cactus.jd.com',
        'accept': 'application/json',
        'content-type': 'application/json',
        'origin': this.og,
        'referer': this.og,
        'user-agent': this.ua
      }
    })
    this.tk = algo.data.result.tk
    this.rd = algo.data.result.algo.match(/rd='(.*)'/)[1]
    this.enc = algo.data.result.algo.match(/algo\.(.*)\(/)[1]
  }

  __genKey(tk: string, fp: string, ts: string, ai: string, algo: object) {
    let str = `${tk}${fp}${ts}${ai}${this.rd}`
    return algo[this.enc](str, tk)
  }

  async __genH5st(body: object) {
    let y = this.__genKey(this.tk, this.fp, this.timestamp, this.appId, CryptoJS).toString(CryptoJS.enc.Hex)
    let s = ''
    for (let key of Object.keys(body)) {
      key === 'body' ? s += `${key}:${CryptoJS.SHA256(body[key]).toString(CryptoJS.enc.Hex)}&` : s += `${key}:${body[key]}&`
    }
    s = s.slice(0, -1)
    let {data} = await axios.post(`${this.api}/h5st`, {s, y, iosVer: this.iosVer, pin: this.pin, fp: this.fp})
    return encodeURIComponent(`${this.timestamp};${this.fp};${this.appId.toString()};${this.tk};${data.s};3.1;${this.time.toString()};${data.u}`)
  }
}

export {
  H5ST
}