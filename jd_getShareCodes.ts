/**
 * cron 0 20 * * 6
 */

import {requireConfig, TotalBean} from "./TS_USER_AGENTS";
import {bean, farm, pet, factory, sgmh, jxfactory, cash, carnivalcity} from "./tools/shareCodesTool";

const notify = require('./sendNotify')
let cookie: string = '', UserName: string, index: number;

!(async () => {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    if (!isLogin) {
      notify.sendNotify(__filename.split('/').pop(), `cookie已失效\n京东账号${index}：${nickName || UserName}`)
      continue
    }
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

    console.log('种豆得豆:', await bean(cookie))
    console.log('东东农场:', await farm(cookie))
    console.log('东东萌宠:', await pet(cookie))
    console.log('东东工厂:', await factory(cookie))
    console.log('京喜工厂:', await jxfactory(cookie))
    console.log('闪购盲盒:', await sgmh(cookie))
    console.log('领现金呀:', await cash(cookie))
    console.log('狂欢城呀:', await carnivalcity(cookie))

  }
})()
