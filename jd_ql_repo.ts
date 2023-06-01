/**
 * 🐉 ql repo
 * cron: 30 2 * * *
 */

import {execSync} from "child_process";

if (process.env.HOSTNAME === 'qinglong' || process.env.QL_DIR) {
  process.chdir('../../repo/JDHelloWorld_jd_scripts/')
  execSync('git fetch --all; git reset --hard origin/main; git pull')
  execSync('ql repo https://github.com/JDHelloWorld/jd_scripts.git "jd_|jx_" "backUp" "^jd[^_]|USER|^TS|utils"')
}
