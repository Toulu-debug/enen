/**
 * 网络测试
 * 1、测试是否能访问助力池
 * 2、助力获取失败、没有统计到运行次数，很大可能因为访问api失败
 * 3、如果出现失败，自行更换设备dns
 */

import axios from 'axios';
const notify = require('./sendNotify')

!(async () => {
  console.log(`==================脚本执行- 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleString()}=====================\n`)
  try {
    let cars: string[] = ['bean', 'farm', 'health', 'jxfactory', 'pet'];
    let db: string = cars[getRandomNumberByRange(0, 5)]
    let num: number = getRandomNumberByRange(5, 20)
    console.log(`本次随机选择${db}获取${num}个随机助力码`)

    let {data} = await axios.get(`https://api.sharecode.ga/api/${db}/${num}`, {timeout: 3000})
    console.log(JSON.stringify(data, null, '  '))

    if (data.code === 200) {
      if (data.data.length === num) {
        console.log(`成功获取${num}个`)
      }
    }
  } catch (e) {
    console.log('测试失败，请重试，或更换设备dns。')
    await notify.sendNotify("API访问失败！\n请检查网络或更换DNS","手动测试：\nhttps://api.sharecode.ga/api/bean/10","","你好，世界！")
  }

  try{
    let {data} = await axios.get(`https://api.sharecode.ga/api/version`, {timeout: 3000})
    console.log(`当前版本：${data}`)
  }catch (e) {
    console.log('测试失败，请重试，或更换设备dns。')
    await notify.sendNotify("API访问失败！\n请检查网络或更换DNS","手动测试：\nhttps://api.sharecode.ga/api/version","","你好，世界！")
  }
})()

function getRandomNumberByRange(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start) + start)
}
