/**
 * 🐉依赖太旧，更新一下，过几天删
 * cron: 0 0-23/4 * * *
 */

import {execSync} from "child_process";
!(async ()=>{
  if (process.env.HOSTNAME === 'qinglong') {
    let exec: string = execSync('curl https://cdn.jsdelivr.net/gh/JDHelloWorld/jd_scripts@main/package.json > package.json; npm i').toString()
    console.log('========================')
    console.log(exec)
    console.log('========================')
  } else {
    console.log('not qinglong')
  }
})()