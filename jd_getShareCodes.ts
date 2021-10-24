/**
 * cron: 59 23 * * 0
 */

import {requireConfig} from "./TS_USER_AGENTS";
import {bean, farm, pet, factory, sgmh, jxfactory, health} from "./utils/shareCodesTool";

let cookie: string = '', UserName: string, index: number;

!(async () => {
  let cookiesArr: any = await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);

    console.log('种豆得豆:', await bean(cookie))
    console.log('东东农场:', await farm(cookie))
    console.log('京东健康:', await health(cookie))
    console.log('东东萌宠:', await pet(cookie))
    console.log('东东工厂:', await factory(cookie))
    console.log('京喜工厂:', await jxfactory(cookie))
    console.log('闪购盲盒:', await sgmh(cookie))
  }
})()
