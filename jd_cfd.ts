/**
 * 京喜财富岛
 * cron: 40 * * * *
 */

import axios from 'axios'
import {Md5} from 'ts-md5'
import {getDate} from 'date-fns'
import {getCookie, wait, getJxToken, getBeanShareCode, getFarmShareCode, randomWord, getshareCodeHW, getShareCodePool} from './TS_USER_AGENTS'
import {requestAlgo, geth5st} from "./utils/V3"
import {existsSync, readFileSync} from "fs";

let cookie: string = '', res: any = '', UserName: string, index: number, ua: string = null, account: any[] = []
let shareCode: string[] = [], shareCodeSelf: string[] = [], shareCodeHW: string[] = [], isCollector: Boolean = false, token: any = {}

interface Params {
  strBuildIndex?: string,
  ddwCostCoin?: number,
  taskId?: number,
  dwType?: string,
  configExtra?: string,
  strStoryId?: string,
  triggerType?: number,
  ddwTriggerDay?: number,
  ddwConsumeCoin?: number,
  dwIsFree?: number,
  ddwTaskId?: string,
  strShareId?: string,
  strMarkList?: string,
  dwSceneId?: string,
  strTypeCnt?: string,
  dwUserId?: number,
  ddwCoin?: number,
  ddwMoney?: number,
  dwPrizeLv?: number,
  dwPrizeType?: number,
  strPrizePool?: string,
  dwFirst?: any,
  dwIdentityType?: number,
  strBussKey?: string,
  strMyShareId?: string,
  ddwCount?: number,
  __t?: number,
  strBT?: string,
  dwCurStageEndCnt?: number,
  dwRewardType?: number,
  dwRubbishId?: number,
  strPgtimestamp?: number,
  strPhoneID?: string,
  strPgUUNum?: string,
  showAreaTaskFlag?: number,
  strVersion?: string,
  strIndex?: string
  strToken?: string
  dwGetType?: number,
  ddwSeaonStart?: number,
  size?: number,
  type?: number,
  strLT?: string,
  dwQueryType?: number,
  dwPageIndex?: number,
  dwPageSize?: number,
  dwProperty?: number,
  bizCode?: string,
  dwCardType?: number,
  strCardTypeIndex?: string,
  dwIsReJoin?: number,
}

!(async () => {
  if (existsSync('./utils/account.json')) {
    try {
      account = JSON.parse(readFileSync('./utils/account.json').toString())
    } catch (e) {
      console.log(e)
    }
  }

  await requestAlgo('92a36', 'jdpingou;')
  let cookiesArr: string[] = await getCookie()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    ua = 'jdpingou;'
    for (let acc of account) {
      if (acc?.pt_pin.includes(UserName) && acc?.jdpingou) {
        ua = acc.jdpingou
        console.log('指定UA：', ua)
        break
      }
    }

    token = getJxToken(cookie)
    try {
      await makeshareCode()
    } catch (e) {
      console.log(e)
    }

    // 当日累计获得财富
    let todayMoney: number = 0, flag: boolean = true
    for (let dwPageIndex = 0; dwPageIndex < 5; dwPageIndex++) {
      if (!flag) break
      res = await api('user/GetMoneyDetail', '_cfd_t,bizCode,dwEnv,dwPageIndex,dwPageSize,dwProperty,dwQueryType,ptag,source,strZone', {dwQueryType: 0, dwPageIndex: 1, dwPageSize: 10, dwProperty: 1})
      await wait(1000)
      for (let t of res?.Detail) {
        if (getDate(t.ddwTime * 1000) === getDate(new Date())) {
          todayMoney += t.ddwValue
        } else {
          flag = false
          break
        }
      }
    }
    console.log('今日累计获得财富:', todayMoney)

    // 离线
    res = await api('user/QueryUserInfo', '_cfd_t,bizCode,ddwTaskId,dwEnv,ptag,source,strMarkList,strPgUUNum,strPgtimestamp,strPhoneID,strShareId,strZone', {ddwTaskId: '', strShareId: '', strMarkList: 'guider_step,collect_coin_auth,guider_medal,guider_over_flag,build_food_full,build_sea_full,build_shop_full,build_fun_full,medal_guider_show,guide_guider_show,guide_receive_vistor,daily_task,guider_daily_task', strPgtimestamp: token.strPgtimestamp, strPhoneID: token.strPhoneID, strPgUUNum: token.strPgUUNum})
    await wait(5000)

    res = await api('user/QueryUserInfo', '_cfd_t,bizCode,ddwTaskId,dwEnv,dwIsReJoin,ptag,source,strPgUUNum,strPgtimestamp,strPhoneID,strShareId,strVersion,strZone', {ddwTaskId: '', strShareId: '', strMarkList: 'undefined', strVersion: '1.0.1', dwIsReJoin: 0, strPgtimestamp: token.strPgtimestamp, strPhoneID: token.strPhoneID, strPgUUNum: token.strPgUUNum})
    console.log('财富余额:', res.ddwRichBalance)
    await wait(5000)

    // 寻宝
    for (let xb of res.XbStatus.XBDetail) {
      if (xb.dwRemainCnt !== 0) {
        res = await api('user/TreasureHunt', '_cfd_t,bizCode,dwEnv,ptag,source,strIndex,strZone', {strIndex: xb.strIndex})
        if (res.iRet === 0) {
          console.log('发现宝物:', res.AwardInfo.ddwValue)
        } else {
          console.log('寻宝失败:', res)
          break
        }
        await wait(2000)
      }
    }

    let tasks: any
    // 加速卡任务
    tasks = await api('story/GetPropTask', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    for (let t of tasks.Data.TaskList) {
      if (t.dwCompleteNum === t.dwTargetNum && t.dwAwardStatus === 2) {
        res = await api('Award', '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId', {bizCode: tasks.Data.strZone, taskId: t.ddwTaskId})
        await wait(1000)
        if (res.ret === 0) {
          let prizeInfo: any = JSON.parse(res.data.prizeInfo)
          let CardList: any = prizeInfo.CardInfo.CardList
          let cards: string = ''
          for (let card of CardList) {
            cards += card.strCardName
          }
          console.log('加速卡领取成功', cards)
        } else {
          console.log('加速卡领取失败', res)
          break
        }
      }
      if (t.dwCompleteNum < t.dwTargetNum && t.strTaskName !== '去接待NPC' && t.strTaskName.indexOf('累计邀请') === -1) {
        console.log(t.strTaskName)
        res = await api('DoTask', '_cfd_t,bizCode,configExtra,dwEnv,ptag,source,strZone,taskId', {bizCode: tasks.Data.strZone, taskId: t.ddwTaskId})
        await wait(t.dwLookTime * 1000 ?? 2000)
        if (res.ret === 0) {
          console.log('加速卡任务完成')
        } else {
          console.log('加速卡任务失败', res)
          break
        }
      }
    }

    // 加速卡
    res = await api('user/GetPropCardCenterInfo', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    let richcard: any = res.cardInfo.richcard, coincard: any = res.cardInfo.coincard
    for (let card of coincard) {
      if (card.dwCardNums !== 0) {
        res = await api('user/UsePropCard', '_cfd_t,bizCode,dwCardType,dwEnv,ptag,source,strCardTypeIndex,strZone', {dwCardType: 1, strCardTypeIndex: encodeURIComponent(card.strCardTypeIndex)})
        if (res.iRet === 0) {
          console.log('金币加速卡使用成功')
        } else {
          console.log('金币加速卡使用失败', res)
        }
        break
      }
    }
    for (let card of richcard) {
      if (card.dwCardNums !== 0) {
        res = await api('user/UsePropCard', '_cfd_t,bizCode,dwCardType,dwEnv,ptag,source,strCardTypeIndex,strZone', {dwCardType: 2, strCardTypeIndex: encodeURIComponent(card.strCardTypeIndex)})
        if (res.iRet === 0) {
          console.log('点券加速卡使用成功')
        } else {
          console.log('点券加速卡使用失败', res)
        }
        break
      }
    }

    // 任务⬇️
    console.log('底部任务列表开始')
    for (let j = 0; j < 30; j++) {
      if (await task() === 0) {
        break
      }
      await wait(3000)
    }
    console.log('底部任务列表结束')

    // 升级建筑
    for (let j = 0; j < 5; j++) {
      res = await api('user/QueryUserInfo', '_cfd_t,bizCode,ddwTaskId,dwEnv,ptag,source,strMarkList,strPgUUNum,strPgtimestamp,strPhoneID,strShareId,strZone', {ddwTaskId: '', strShareId: '', strMarkList: 'guider_step,collect_coin_auth,guider_medal,guider_over_flag,build_food_full,build_sea_full,build_shop_full,build_fun_full,medal_guider_show,guide_guider_show,guide_receive_vistor,daily_task,guider_daily_task', strPgtimestamp: token.strPgtimestamp, strPhoneID: token.strPhoneID, strPgUUNum: token.strPgUUNum})
      let wallet: number = res.ddwCoinBalance
      console.log('金币余额:', wallet)
      let build: string = '', minLV: number = 99999
      for (let b of ['food', 'fun', 'shop', 'sea']) {
        res = await api('user/GetBuildInfo', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strZone', {strBuildIndex: b})
        await wait(2000)
        if (res.dwBuildLvl <= minLV) {
          minLV = res.dwBuildLvl
          build = b
        }
      }
      console.log('最低等级建筑:', minLV, build)

      res = await api('user/GetBuildInfo', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strZone', {strBuildIndex: build})
      console.log(`${build}升级需要:`, res.ddwNextLvlCostCoin)
      await wait(2000)
      if (res.dwCanLvlUp === 1 && res.ddwNextLvlCostCoin <= wallet) {
        res = await api('user/BuildLvlUp', '_cfd_t,bizCode,ddwCostCoin,dwEnv,ptag,source,strBuildIndex,strZone', {ddwCostCoin: res.ddwNextLvlCostCoin, strBuildIndex: build})
        await wait(2000)
        if (res.iRet === 0) {
          console.log(`升级成功`)
          await wait(2000)
        } else {
          console.log('升级失败', res)
        }
      } else {
        break
      }
      await wait(3000)
    }

    // 签到 助力奖励
    res = await api('story/GetTakeAggrPage', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    let employee: any = res.Data.Employee.EmployeeList.filter((e: any) => {
      return e.dwStatus === 0
    })
    for (let emp of employee) {
      let empRes: any = await api('story/helpdraw', '_cfd_t,bizCode,dwEnv,dwUserId,ptag,source,strZone', {dwUserId: emp.dwId})
      if (empRes.iRet === 0)
        console.log('助力奖励领取成功:', empRes.Data.ddwCoin)
      await wait(1000)
    }
    if (res.Data.Sign.dwTodayStatus === 0) {
      console.log('今日未签到')
      for (let sign of res.Data.Sign.SignList) {
        if (sign.dwDayId === res.Data.Sign.dwTodayId) {
          res = await api('story/RewardSign',
            '_cfd_t,bizCode,ddwCoin,ddwMoney,dwEnv,dwPrizeLv,dwPrizeType,ptag,source,strPgUUNum,strPgtimestamp,strPhoneID,strPrizePool,strZone',
            {
              ddwCoin: sign.ddwCoin,
              ddwMoney: sign.ddwMoney,
              dwPrizeLv: sign.dwBingoLevel,
              dwPrizeType: sign.dwPrizeType,
              strPrizePool: sign.strPrizePool,
              strPgtimestamp: token.strPgtimestamp,
              strPhoneID: token.strPhoneID,
              strPgUUNum: token.strPgUUNum
            })
          if (res.iRet === 0)
            console.log('签到成功:', res.Data.ddwCoin, res.Data.ddwMoney, res.Data.strPrizePool)
          else
            console.log('签到失败:', res)
          break
        }
      }
    } else {
      console.log('今日已经签到')
    }
    await wait(2000)

    res = await api('user/QueryUserInfo', '_cfd_t,bizCode,ddwTaskId,dwEnv,ptag,source,strMarkList,strPgUUNum,strPgtimestamp,strPhoneID,strShareId,strVersion,strZone', {
      ddwTaskId: '',
      strShareId: '',
      strMarkList: 'guider_step,collect_coin_auth,guider_medal,guider_over_flag,build_food_full,build_sea_full,build_shop_full,build_fun_full,medal_guider_show,guide_guider_show,guide_receive_vistor,daily_task,guider_daily_task,cfd_has_show_selef_point',
      strPgUUNum: token.strPgUUNum,
      strPgtimestamp: token.strPgtimestamp,
      strPhoneID: token.strPhoneID,
      strVersion: '1.0.1'
    })
    await wait(5000)
    if (res.StoryInfo.StoryList) {
      // 美人鱼
      if (res.StoryInfo.StoryList[0].Mermaid) {
        console.log(`发现美人鱼🧜‍♀️`)
        /*
        let MermaidRes: any = await api('story/MermaidOper', '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone', {
          strStoryId: res.StoryInfo.StoryList[0].strStoryId,
          dwType: '1',
          ddwTriggerDay: res.StoryInfo.StoryList[0].ddwTriggerDay
        })
        await wait(3000)
        if (MermaidRes.iRet === 0) {
          MermaidRes = await api('story/MermaidOpe', '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone', {
            strStoryId: res.StoryInfo.StoryList[0].strStoryId,
            dwType: '3',
            ddwTriggerDay: res.StoryInfo.StoryList[0].ddwTriggerDay
          })
          if (MermaidRes.iRet === 0) {
            console.log(`拯救美人鱼成功`)
          }
        }
        await wait(1000)
        MermaidRes = await api('story/MermaidOper', '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone', {
          strStoryId: res.StoryInfo.StoryList[0].strStoryId,
          dwType: '2',
          ddwTriggerDay: res.StoryInfo.StoryList[0].ddwTriggerDay
        })
        if (MermaidRes.iRet === 0)
          console.log('获得金币:', MermaidRes.Data.ddwCoin)

         */
      }
      await wait(2000)

      if (res.StoryInfo.StoryList[0].Special) {
        console.log(`船来了，乘客是${res.StoryInfo.StoryList[0].Special.strName}`)
        let shipRes: any = await api('story/SpecialUserOper', '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone,triggerType', {
          strStoryId: res.StoryInfo.StoryList[0].strStoryId,
          dwType: '2',
          triggerType: 0,
          ddwTriggerDay: res.StoryInfo.StoryList[0].ddwTriggerDay
        })
        console.log('正在下船，等待30s')
        await wait(30000)
        shipRes = await api('story/SpecialUserOper', '_cfd_t,bizCode,ddwTriggerDay,dwEnv,dwType,ptag,source,strStoryId,strZone,triggerType', {
          strStoryId: res.StoryInfo.StoryList[0].strStoryId,
          dwType: '3',
          triggerType: 0,
          ddwTriggerDay: res.StoryInfo.StoryList[0].ddwTriggerDay
        })
        if (shipRes.iRet === 0)
          console.log('船客接待成功')
        else
          console.log('船客接待失败', shipRes)
      }

      isCollector = false
      if (res.StoryInfo.StoryList[0].Collector) {
        console.log('收藏家出现')
        // TODO 背包满了再卖给收破烂的
        res = await api('story/CollectorOper', '_cfd_t,bizCode,dwEnv,ptag,source,strZone,strStoryId,dwType,ddwTriggerDay', {strStoryId: res.StoryInfo.StoryList[0].strStoryId, dwType: '2', ddwTriggerDay: res.StoryInfo.StoryList[0].ddwTriggerDay})
        await wait(1000)
        isCollector = true
        // 清空背包
        res = await api('story/querystorageroom', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
        let bags: number[] = []
        for (let s of res.Data.Office) {
          bags.push(s.dwType)
          bags.push(s.dwCount)
        }
        await wait(1000)
        let strTypeCnt: string = ''
        for (let n = 0; n < bags.length; n++) {
          if (n % 2 === 0)
            strTypeCnt += `${bags[n]}:`
          else
            strTypeCnt += `${bags[n]}|`
        }
        if (bags.length !== 0) {
          res = await api('story/sellgoods', '_cfd_t,bizCode,dwEnv,dwSceneId,ptag,source,strTypeCnt,strZone',
            {dwSceneId: isCollector ? '2' : '1', strTypeCnt: strTypeCnt})
          console.log('卖贝壳收入:', res.Data.ddwCoin, res.Data.ddwMoney)
        }
      }
      await wait(2000)
    }

    // 清空背包
    res = await api('story/querystorageroom', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    let bags: number[] = []
    for (let s of res.Data.Office) {
      bags.push(s.dwType)
      bags.push(s.dwCount)
    }
    await wait(1000)
    let strTypeCnt: string = ''
    for (let n = 0; n < bags.length; n++) {
      if (n % 2 === 0)
        strTypeCnt += `${bags[n]}:`
      else
        strTypeCnt += `${bags[n]}|`
    }
    if (bags.length !== 0) {
      res = await api('story/sellgoods', '_cfd_t,bizCode,dwEnv,dwSceneId,ptag,source,strTypeCnt,strZone',
        {dwSceneId: isCollector ? '2' : '1', strTypeCnt: strTypeCnt})
      console.log('卖贝壳收入:', res.Data.ddwCoin, res.Data.ddwMoney)
    }

    // 垃圾🚮
    res = await api('story/QueryRubbishInfo', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    if (res.Data.StoryInfo.StoryList.length !== 0) {
      console.log('有垃圾')
      await api('story/RubbishOper', '_cfd_t,bizCode,dwEnv,dwRewardType,dwType,ptag,source,strZone', {
        dwType: '1',
        dwRewardType: 0
      })
      await wait(1000)
      for (let j = 1; j < 9; j++) {
        res = await api('story/RubbishOper', '_cfd_t,bizCode,dwEnv,dwRewardType,dwRubbishId,dwType,ptag,source,strZone', {
          dwType: '2',
          dwRewardType: 0,
          dwRubbishId: j
        })
        await wait(1500)
      }
    }
    await wait(2000)

    // 任务➡️
    res = await api('story/GetActTask', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    await wait(2000)
    for (let t of res.Data.TaskList) {
      if ([1, 2].indexOf(t.dwOrderId) > -1 && t.dwCompleteNum < t.dwTargetNum && t.strTaskName !== '升级1个建筑') {
        console.log('开始任务➡️:', t.strTaskName)
        res = await api('DoTask', '_cfd_t,bizCode,configExtra,dwEnv,ptag,source,strZone,taskId', {taskId: t.ddwTaskId, configExtra: ''}, 'right')
        await wait(t.dwLookTime * 1000)
        if (res.ret === 0) {
          console.log('任务完成')
        } else {
          console.log('任务失败', res)
        }
      }
    }

    res = await api('story/GetActTask', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    await wait(2000)
    for (let t of res.Data.TaskList) {
      if (t.dwCompleteNum === t.dwTargetNum && t.dwAwardStatus === 2) {
        res = await api('Award', '_cfd_t,bizCode,configExtra,dwEnv,ptag,source,strZone,taskId', {taskId: t.ddwTaskId}, 'right')
        await wait(1000)
        if (res.ret === 0) {
          try {
            res = JSON.parse(res.data.prizeInfo)
            console.log(`领奖成功:`, res.ddwCoin, res.ddwMoney)
          } catch (e) {
            console.log(`领奖成功:`, res)
          }
        } else {
          console.log('领奖失败', res)
        }
      }
    }

    res = await api('story/GetActTask', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    await wait(2000)
    if (res.Data.dwStatus === 3) {
      res = await api('story/ActTaskAward', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
      if (res.ret === 0) {
        console.log('100财富任务完成')
      }
    }
    await wait(2000)

    // 导游
    res = await api('user/EmployTourGuideInfo', '_cfd_t,bizCode,dwEnv,ptag,source,strZone')
    if (!res.TourGuideList) {
      console.log('手动雇佣4个试用导游')
    } else {
      for (let e of res.TourGuideList) {
        if (e.strBuildIndex !== 'food' && e.ddwRemainTm === 0) {
          let employ: any = await api('user/EmployTourGuide', '_cfd_t,bizCode,ddwConsumeCoin,dwEnv,dwIsFree,ptag,source,strBuildIndex,strZone',
            {ddwConsumeCoin: e.ddwCostCoin, dwIsFree: 0, strBuildIndex: e.strBuildIndex})
          if (employ.iRet === 0)
            console.log(`雇佣${e.strBuildIndex}导游成功`)
          if (employ.iRet === 2003)
            break
          await wait(1000)
        }
      }
    }
    await wait(2000)

    for (let b of ['fun', 'shop', 'sea', 'food']) {
      res = await api('user/CollectCoin', '_cfd_t,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strZone', {strBuildIndex: b, dwType: '1'})
      console.log(`${b}收金币:`, res.ddwCoin)
      await wait(1000)
    }
  }

  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    if (shareCodeHW.length === 0) {
      shareCodeHW = await getshareCodeHW('jxcfd')
    }
    // 获取随机助力码
    let pool: string[] = await getShareCodePool('jxcfd', 30)
    shareCode = Array.from(new Set([...shareCodeSelf, ...shareCodeHW, ...pool]))

    for (let code of shareCode) {
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
      console.log(`【账号${index + 1}】 ${UserName} 去助力 ${code}`)
      res = await api('story/helpbystage', '_cfd_t,bizCode,dwEnv,ptag,source,strShareId,strZone', {strShareId: code})
      if (res.iRet === 0) {
        console.log('助力成功:', res.Data.GuestPrizeInfo.strPrizeName)
      } else if (res.iRet === 2190 || res.sErrMsg === '达到助力上限') {
        console.log('上限')
        break
      } else if (res.iRet === 1023) {
        console.log('信号弱')
        break
      } else if (res.iRet === 2191) {
        console.log('已助力')
      } else {
        console.log('其他错误:', res)
      }
      await wait(3000)
    }
  }
})()

async function api(fn: string, stk: string, params: Params = {}, taskPosition = '') {
  let timestamp: number = Date.now()

  let url: string, t: { key: string, value: string } [] = [
    {key: 'strZone', value: 'jxbfd'},
    {key: 'source', value: 'jxbfd'},
    {key: 'dwEnv', value: '7'},
    {key: 'ptag', value: ''},
    {key: '_cfd_t', value: timestamp.toString()},
  ]

  if (['GetUserTaskStatusList', 'Award', 'DoTask'].includes(fn)) {
    let bizCode: string
    if (!params.bizCode) {
      bizCode = taskPosition === 'right' ? 'jxbfddch' : 'jxbfd'
    } else {
      bizCode = params.bizCode
    }
    url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?strZone=jxbfd&bizCode=${bizCode}&source=jxbfd&dwEnv=7&_cfd_t=${timestamp}&ptag=&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
  } else {
    url = `https://m.jingxi.com/jxbfd/${fn}?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${timestamp}&ptag=&_stk=${encodeURIComponent(stk)}&_ste=1&_=${timestamp}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
  }
  for (let [key, value] of Object.entries(params)) {
    t.push({key, value})
    url += `&${key}=${value}`
  }
  let h5st = geth5st(t, '92a36')
  url += `&h5st=${encodeURIComponent(h5st)}`

  let {data} = await axios.get(url, {
    headers: {
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'User-Agent': ua,
      'Referer': 'https://st.jingxi.com/',
      'Cookie': cookie + 'cid=4;'
    }
  })
  try {
    return JSON.parse(data.match(/jsonpCBK.?\(([^)]*)/)![1])
  } catch (e) {
    console.log(data)
    return ''
  }
}

async function task() {
  console.log('刷新任务列表')
  res = await api('GetUserTaskStatusList', '_cfd_t,bizCode,dwEnv,ptag,showAreaTaskFlag,source,strZone,taskId', {taskId: 0, showAreaTaskFlag: 1})
  await wait(2000)
  for (let t of res.data.userTaskStatusList) {
    if (t.awardStatus === 2 && t.completedTimes === t.targetTimes) {
      console.log('可领奖:', t.taskName)
      res = await api('Award', '_cfd_t,bizCode,dwEnv,ptag,source,strZone,taskId', {taskId: t.taskId, bizCode: t.bizCode})
      await wait(2000)
      if (res.ret === 0) {
        try {
          res = JSON.parse(res.data.prizeInfo)
          console.log(`领奖成功:`, res.ddwCoin, res.ddwMoney)
        } catch (e) {
          console.log('领奖成功:', res)
        }
        await wait(1000)
        return 1
      } else {
        console.log('领奖失败:', res)
        return 0
      }
    }
    if (t.dateType === 2 && t.awardStatus === 2 && t.completedTimes < t.targetTimes && t.taskCaller === 1) {
      console.log('做任务:', t.taskId, t.taskName, t.completedTimes, t.targetTimes)
      res = await api('DoTask', '_cfd_t,bizCode,configExtra,dwEnv,ptag,source,strZone,taskId', {taskId: t.taskId, configExtra: '', bizCode: t.bizCode})
      await wait(5000)
      if (res.ret === 0) {
        console.log('任务完成')
        return 1
      } else {
        console.log('任务失败')
        return 0
      }
    }
  }
  return 0
}

async function makeshareCode() {
  try {
    res = await api('user/QueryUserInfo', '_cfd_t,bizCode,ddwTaskId,dwEnv,ptag,source,strPgUUNum,strPgtimestamp,strPhoneID,strShareId,strVersion,strZone', {
      ddwTaskId: '',
      strShareId: '',
      strMarkList: 'undefined',
      strPgUUNum: token.strPgUUNum,
      strPgtimestamp: token.strPgtimestamp,
      strPhoneID: token.strPhoneID,
      strVersion: '1.0.1'
    })
    console.log('助力码:', res.strMyShareId)
    shareCodeSelf.push(res.strMyShareId)
    let bean: string = await getBeanShareCode(cookie)
    let farm: string = await getFarmShareCode(cookie)
    let pin: string = Md5.hashStr(cookie.match(/pt_pin=([^;]*)/)![1])
    let {data}: any = await axios.get(`https://api.jdsharecode.xyz/api/autoInsert/jxcfd?sharecode=${res.strMyShareId}&bean=${bean}&farm=${farm}&pin=${pin}`)
    console.log(data.message)
  } catch (e) {
    console.log('自动提交失败')
    console.log(e)
  }
}
