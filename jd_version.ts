/**
 * 仓库可更新提醒
 * 仅通知，不会自动更新
 */

import axios from "axios";
import {execSync} from "child_process";
import {sendNotify} from './sendNotify';

!(async () => {
  let cwd: string = '.'
  if (process.env.HOSTNAME === 'qinglong') {
    cwd = '/ql/repo/JDHelloWorld_jd_scripts'
  }
  let localVersion: string = execSync("git rev-parse HEAD", {cwd}).toString().trim()
  console.log('local ', localVersion)

  let remote: { version: string, commit: string } = await githubVersion()
  console.log('remote', remote)
  if (remote.version && remote.version !== localVersion) {
    await sendNotify('JDHelloWorld new commit', `有新版本了\n${remote.commit}`)
  }
})()

async function githubVersion() {
  try {
    // process.env.ProxyUrl = 'http://127.0.0.1:1080'
    let config: object = {timeout: 5000}
    if (process.env.ProxyUrl) {
      Object.assign(config, {
        proxy: {
          host: process.env.ProxyUrl.match(/https?:\/\/(.*):/)[1],
          port: parseInt(process.env.ProxyUrl.match(/https?:.*:(\d+)/)[1])
        }
      })
    }
    let {data} = await axios.get('https://github.com/JDHelloWorld/jd_scripts/commits/main', config)
    return {
      version: data.match(/<a.*commit\/(.*)" class="d-none js-permalink-shortcut" data-hotkey="y">Permalink<\/a>/)[1],
      commit: data.match(/<a class="Link--primary text-bold js-navigation-open markdown-title" data-pjax="true" href="\/JDHelloWorld\/jd_scripts\/commit\/.*">(.*)<\/a>/)[1]
    }
  } catch (e) {
    return {
      version: '',
      commit: ''
    }
  }
}