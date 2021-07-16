/**
 * 使用自定义推送(sendNotify)
 * 实现艾特所有人
 * 用于重要消息提示
 */
const fs = require('fs')
const axios = require('axios')
// const tunnel = require('tunnel')
const notify = require('./sendNotify')

try {
  fs.accessSync('./notify.log', fs.constants.R_OK | fs.constants.W_OK)
} catch (e) {
  console.log('找不到日志')
  fs.writeFileSync('./notify.log', Date.now() + '', 'utf-8')
}

let lastPush = fs.readFileSync('./notify.log', 'utf-8') * 1
console.log('上次推送：', lastPush)

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

*/

axios.get("https://api.sharecode.ga/api/notify", {timeout: 3000})
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
