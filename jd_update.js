/**
 * 强制更新
 * cron=0 0-23/12 * * *
 */

const exec = require('child_process').exec;

if(process.env.PWD==='/ql/scripts'){
  exec("cd /ql/repo/JDHelloWorld_jd_scripts")
}

exec("git fetch --all; git reset --hard origin/main; git pull", (error, stdout, stderr) => {
  console.log(stdout.trim())
})

if(process.env.PWD==='/ql/scripts') {
  if (__dirname.indexOf('/ql/') > -1) {
    exec('ql repo https://github.com/JDHelloWorld/jd_scripts.git "jd_|jx_|getCookie" "activity|backUp|Coupon|enen" "^jd[^_]|USER|tools"', (error, stdout, stderr) => {
      console.log(stdout.trim())
    })
  }
}