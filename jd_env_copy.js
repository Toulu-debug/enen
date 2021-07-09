/**
 * task jd_env_copy.js now
 * ts-node jd_ts_test.ts
 */

const fs = require('fs')
let s = ''
for (let key in process.env) {
  s += `${key}=${process.env[key]}` + '\n'
}

fs.writeFileSync('/ql/scripts/.env', s, 'utf-8')
