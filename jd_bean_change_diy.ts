/**
 * Usage: jd_bean_change_diy [options]
 *
 * Options:
 *   -V, --version           output the version number
 *   -i, --index <index>     Cookie index (default: "1")
 *   -i0 --in <in>           今日收入 (default: "18")
 *   -i1 --yIn <yIn>         昨日收入 (default: "2")
 *   -o1 --yOut <yOut>       昨日支出 (default: "0")
 *   -b --balance <balance>  当前京豆 (default: "27793")
 *   -h, --help              display help for command
 *
 * ts-node jd_bean_change_diy.ts -i 1 -i0 50 -i1 85 -o1 0 -b 9527
 *
 * cron: 0 0 1 1 *
 */

import {getRandomNumberByRange, randomWord} from "./TS_USER_AGENTS";
import {Command} from 'commander';
import {sendNotify} from './sendNotify';

const program = new Command();

program.version('0.0.1')
  .option('-i, --index <index>', 'Cookie index', '1')
  .option('-i0 --in <in>', '今日收入', getRandomNumberByRange(0, 50).toString())
  .option('-i1 --yIn <yIn>', '昨日收入', getRandomNumberByRange(0, 50).toString())
  .option('-o1 --yOut <yOut>', '昨日支出', '0')
  .option('-b --balance <balance>', '当前京豆', getRandomNumberByRange(3000, 30000).toString())
  .parse(process.argv);

let options = program.opts();
console.log(options);

let msg = `账号${options.index}：jd_${randomWord(10).toLowerCase()}\n今日收入：${options.in}京豆\n昨日收入：${options.yIn}京豆\n昨日支出：${options.yOut}京豆\n当前京豆：${options.balance}(今日过期0京豆)`;

sendNotify('京东资产变动通知', msg).then()
