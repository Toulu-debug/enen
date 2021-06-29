/**
 * 强制更新
 * cron=0 0-23/12 * * *
 */

const exec = require('child_process').exec;

exec("git fetch --all && git reset --hard origin/main && git pull", (error, stdout, stderr) => {
  console.log(1, error)
  console.log(2, stdout.trim())
  console.log(3, stderr)
})