/**
 * cron: 59 23 * * 0
 */

import {getCookie, wait} from "../TS_USER_AGENTS";
import {bean, farm, pet, factory, sgmh, jxfactory, health} from "../utils/shareCodesTool";

let cookie: string = '', UserName: string, index: number
let beans: string = '', farms: string = '', healths: string = '', pets: string = '', factorys: string = '', jxfactorys: string = '', sgmhs: string = '', s: string = '';
!(async () => {
  let cookiesArr: string[] = await getCookie();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    console.log(`\n开始【京东账号${index}】${UserName}\n`);
    s = await bean(cookie)
    s ? beans += s + '&' : ''
    console.log('种豆得豆:', s)
    s = await farm(cookie)
    s ? farms += s + '&' : ''
    console.log('东东农场:', s)
    s = await health(cookie)
    s ? healths += s + '&' : ''
    console.log('京东健康:', s)
    s = await pet(cookie)
    s ? pets += s + '&' : ''
    console.log('东东萌宠:', s)
    s = await factory(cookie)
    s ? factorys += s + '&' : ''
    console.log('东东工厂:', s)
    s = await jxfactory(cookie)
    s ? jxfactorys += s + '&' : ''
    console.log('京喜工厂:', s)
    s = await sgmh(cookie)
    s ? sgmhs += s + '&' : ''
    console.log('闪购盲盒:', s)
    await wait(5000)
  }
  console.log('/bean', beans.substring(0, beans.length - 1))
  console.log('/farm', farms.substring(0, farms.length - 1))
  console.log('/health', healths.substring(0, healths.length - 1))
  console.log('/pet', pets.substring(0, pets.length - 1))
  console.log('/factory', factorys.substring(0, factorys.length - 1))
  console.log('/jxfactory', jxfactorys.substring(0, jxfactorys.length - 1))
  console.log('/sgmh', sgmhs.substring(0, sgmhs.length - 1))
})()
