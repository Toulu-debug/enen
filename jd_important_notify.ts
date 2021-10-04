/**
 * 用sendNotify推送通知
 * 主要用于自爆通知，及时推送给不常上tg的
 * cron: 0 0-23/1 * * *
 */
import {sendNotify} from './sendNotify'
import * as dotenv from 'dotenv';
import {accessSync, readFileSync, writeFileSync} from "fs";

dotenv.config()

!(async () => {
  let env: string = ''
  try {
    accessSync('.env')
    env = readFileSync('.env').toString()
  } catch (e) {
    writeFileSync('.env', '')
  }

  let lastMsg: string = process.env.ImportantNotify || ''
  let latestMsg = '2021-10-04  自爆了，重新提交'
  if (lastMsg !== latestMsg) {
    await sendNotify("@所有人", latestMsg)
    if (env.indexOf('ImportantNotify') > -1)
      env = env.replace(/ImportantNotify.*/, `ImportantNotify='${latestMsg}'`)
    else
      env += `ImportantNotify='${latestMsg}'\n`
    writeFileSync('.env', env)
  }
})()

/*
const config = {}
if (process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
  config.httpsAgent = tunnel.httpsOverHttp({
    proxy: {
      host: '127.0.0.1',
      port: '1080',
    },
  });
}


axios.get("https://api.sharecode.ga/api/notify", {timeout: 10000})
  .then(async (res) => {
    let obj = res.data
    if (obj.time !== lastPush) {
      // 有新提醒
      await notify.sendNotify(`@所有人\n\n${obj.title}`, obj.content, '', '\n\n你好，世界！')
      fs.writeFileSync('./notify.log', obj.time + '', 'utf-8')
    }
  })
  .catch(() => {
    console.log('error')
  })
*/
