/**
 * 网络测试
 * 1、测试是否能访问助力池
 * 2、助力获取失败、没有统计到运行次数，很大可能因为访问api失败
 * 3、如果出现失败，自行更换设备dns
 */

import axios from 'axios'
import {format} from 'date-fns'
import {getRandomNumberByRange, wait} from "./TS_USER_AGENTS"

!(async () => {
  console.log(`\n==================脚本执行- 北京时间(UTC+8)：${format(Date.now(), 'yyyy-MM-dd HH:mm:ss')}\n\n`)

  let cars: string[] = ['bean', 'farm', 'health', 'jxfactory', 'pet']
  let db: string = cars[Math.floor(Math.random() * cars.length)]
  let num: number = getRandomNumberByRange(5, 20)
  console.log(`本次随机选择${db}获取${num}个随机助力码`)
  await car(db, num)

  let times = getRandomNumberByRange(3, 6)
  console.log(`开始测试${times}次上报`)
  for (let i = 0; i < times; i++) {
    console.log(`第${i + 1}次上报测试`)
    await runTimes()
    await wait(getRandomNumberByRange(2000, 6000))
  }
})()

async function car(db: string, num: number) {
  try {
    let {data} = await axios.get(`https://api.jdsharecode.xyz/api/${db}/${num}`)
    console.log('获取助力池成功')
    console.log(data)
  } catch (e: any) {
    console.log(`获取助力池失败:`, e)
  }
}

async function runTimes() {
  try {
    let {data} = await axios.get(`https://api.jdsharecode.xyz/api/runTimes?activityId=bean&sharecode=123`)
    console.log('测试成功', data)
  } catch (e: any) {
    console.log('测试失败', e)
  }
}