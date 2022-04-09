/**
 * 🐉 ql repo
 * cron: 15 * * * *
 */

import {execSync} from "child_process";
import {wait, getRandomNumberByRange} from "./TS_USER_AGENTS";

!(async () => {
  if (process.env.HOSTNAME === 'qinglong' || process.env.QL_DIR) {
    await wait(getRandomNumberByRange(1000, 60 * 3 * 1000));
    execSync('ql repo https://github.com/JDHelloWorld/jd_scripts.git "jd_|jx_" "backUp" "^jd[^_]|USER|^TS|utils"')
  }
})()
