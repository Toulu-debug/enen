/**
 * ql repo JDHelloWorld
 * cron: 0 * * * *
 */

import {execSync} from "child_process";

if (process.env.HOSTNAME === 'qinglong') {
  let exec: string = execSync('ql repo https://github.com/JDHelloWorld/jd_scripts.git "jd_|jx_" "backUp|update" "^jd[^_]|USER|^TS|utils"').toString()
  console.log(exec)
}