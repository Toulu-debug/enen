/**
 * 当脚本内更新cron时，面板不需要删除已有cron，就能同步更新
 * cron: 0 0-23/2 * * *
 */

import axios from "axios";
import {readFileSync} from "fs";
import {execSync} from "child_process";

const sendNotify = require('./sendNotify').sendNotify
let server: string = '', message: string = '', taskName: string;

!(async () => {
  if (process.env.HOSTNAME === 'qinglong') {
    // 获取token和服务器IP:Port
    let auth: any = JSON.parse(readFileSync(`${process.env.QL_DIR}/config/auth.json`).toString())
    let bearer: string = auth.token
    let netstat = execSync("netstat -tnlp").toString();
    let port: string = netstat.match(/.*0\.0\.0\.0:(\d+).*nginx\.conf/)![1]
    server = `127.0.0.1:${port}`

    // 新cron
    taskName = "jd_joy_new.js"
    let cron: string = '0 0-23/2 * * *';
    let task: any = await get(taskName, bearer);

    if (task && task.schedule !== cron) {
      console.log(`开始更新${task.name}的cron`)
      console.log('旧', task.schedule)
      console.log('新', cron)
      message = `旧  ${task.schedule}\n新  ${cron}\n更新成功`
      await set(task, bearer, cron)
    } else {
      console.log('cron相同，忽略更新')
    }
  } else {
    console.log('NOT 🐉')
  }
})()

async function set(task: any, bearer: string, cron: string) {
  let {data}: any = await axios.put(`http://${server}/api/crons?t=${Date.now()}`, JSON.stringify({
    "name": task.name, "command": task.command, "schedule": cron, "_id": task._id
  }), {
    headers: {
      'Authorization': `Bearer ${bearer}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
      'Content-Type': 'application/json;charset=UTF-8',
    }
  })
  if (data.code === 200) {
    console.log(`${task.name}的cron更新成功`)
    await sendNotify(taskName, message)
  } else {
    console.log('更新失败：', data)
  }
}

async function get(name: string, bearer: string) {
  let {data}: any = await axios.get(`http://${server}/api/crons?searchValue=&t=${Date.now()}`, {
    headers: {
      'Authorization': `Bearer ${bearer}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
      'Content-Type': 'application/json;charset=UTF-8',
    }
  })
  for (let task of data.data) {
    if (task.name === name) {
      return task
    }
  }
  return
}