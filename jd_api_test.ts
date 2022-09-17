/**
 * 网络测试
 * 1、测试是否能访问助力池
 * 2、助力获取失败、没有统计到运行次数，很大可能因为访问api失败
 * 3、如果出现失败，自行更换设备dns
 */

import {format} from 'date-fns'
import {getRandomNumberByRange, wait, get} from "./TS_USER_AGENTS"

!(async () => {
  console.log(`\n==================脚本执行- 北京时间(UTC+8)：${format(Date.now(), 'yyyy-MM-dd HH:mm:ss')}\n\n`)

  let cars: string[] = ['bean', 'farm', 'health', 'jxfactory', 'pet']
  let db: string = cars[Math.floor(Math.random() * cars.length)]
  let num: number = getRandomNumberByRange(30, 50)
  console.log(`本次随机选择${db}获取${num}个随机助力码`)
  await car(db, num)

  for (let j = 0; j < cars.length; j++) {
    for (let i = 1; i < 3; i++) {
      let db: string = cars[j]
      await runTimes(db, i)
      await wait(getRandomNumberByRange(1000, 3000))
    }
  }
})()

async function car(db: string, num: number) {
  try {
    let {data} = await get(`https://sharecodepool.cnmb.win/api/${db}/${num}`)
    console.log('获取助力池成功')
    console.log(data.length, data)
  } catch (e: any) {
    console.log(`获取助力池失败:`, e)
  }
}

async function runTimes(db, i) {
  try {
    await get(`https://sharecodepool.cnmb.win/api/runTimes0917?activityId=${db}&sharecode=123`)
    console.log(`${db}上报测试成功 ${i}`)
  } catch (e: any) {
    console.log(`${db}上报测试失败 ${i}`, e)
  }
}