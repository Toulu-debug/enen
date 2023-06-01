const fs = require('fs')
const dotenv = require('dotenv')

let CookieJDs = []

try {
  process.chdir(__dirname)
  fs.accessSync('.env', fs.constants.R_OK)
  dotenv.config()
} catch (e) {
}

if (process.env.JD_COOKIE) {
  if (process.env.JD_COOKIE.indexOf('&') > -1) {
    CookieJDs = process.env.JD_COOKIE.split('&');
  } else if (process.env.JD_COOKIE.indexOf('\n') > -1) {
    CookieJDs = process.env.JD_COOKIE.split('\n');
  } else {
    CookieJDs = [process.env.JD_COOKIE];
  }
}
if (JSON.stringify(process.env).indexOf('GITHUB') > -1) {
  process.exit(0);
}
CookieJDs = [...new Set(CookieJDs.filter(item => !!item))]
if (!require.main.filename.includes('.ts')) {
  console.log(`\n====================共${CookieJDs.length}个京东账号Cookie=========\n`);
  console.log(`================== ${new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})} =====================\n`)
}
for (let i = 0; i < CookieJDs.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['CookieJD' + index] = CookieJDs[i].trim();
}
