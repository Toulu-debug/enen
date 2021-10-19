/**
 * cron: * * * * *
 */

const exec = require('child_process').exec

exec('ps -e|grep jxmc|grep -v grep', (error, stdout, stderr) => {
  exec(`kill -9 ${stdout.split(' ')[1]}`)
})