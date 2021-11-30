/**
 * 京喜财富岛-合成游戏
 * cron: 30 * * * *
 */

import axios from 'axios'
import {requireConfig, wait, requestAlgo, h5st, getJxToken, randomString} from './TS_USER_AGENTS'

let cookie: string = '', res: any = '', UserName: string, index: number, token: any = {}

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
  await requestAlgo()
  let cookiesArr: any = await requireConfig()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i]
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1
    console.log(`\n开始【京东账号${index}】${UserName}\n`)

    token = getJxToken(cookie)
    let tasks: any
    // 珍珠
    res = await api('user/ComposePearlState', '', {__t: Date.now(), dwGetType: 0})
    let dwCurProgress: number = res.dwCurProgress
    let strDT: string = res.strDT
    let strMyShareId: string = res.strMyShareId
    let ddwSeasonStartTm: number = res.ddwSeasonStartTm
    let RealTmReport: number = res.PearlList.length
    let PearlList = res.PearlList
    console.log('PearlList', JSON.stringify(PearlList))
    let strLT: string = res.oPT[res.ddwCurTime % (res.oPT.length)]
    console.log(`已合成${dwCurProgress}个珍珠，${res.ddwVirHb / 100}元红包`)

    if (res.dayDrawInfo.dwIsDraw === 0) {
      res = await api("user/GetPearlDailyReward", "__t,strZone", {__t: Date.now()})
      if (res.iRet === 0) {
        res = await api("user/PearlDailyDraw", "__t,ddwSeaonStart,strToken,strZone", {__t: Date.now(), ddwSeaonStart: ddwSeasonStartTm, strToken: res.strToken})
        if (res.strPrizeName) {
          console.log('抽奖获得:', res.strPrizeName)
        } else {
          console.log('抽奖失败？', res)
        }
      }
    }

    // 模拟合成
    if (strDT) {
      console.log('继续合成')
      console.log('本次合成需要上报:', RealTmReport)
      for (let j = 0; j < RealTmReport; j++) {
        res = await api('user/RealTmReport', '', {__t: Date.now(), dwIdentityType: 0, strBussKey: 'composegame', strMyShareId: strMyShareId, ddwCount: 10})
        if (res.iRet === 0)
          console.log(`游戏中途上报${j + 1}:OK`)
        await wait(2000)
        console.log(JSON.stringify(PearlList[j]))
        if (PearlList[j].rbf) {
          res = await api('user/ComposePearlAward', '__t,size,strBT,strZone,type', {__t: Date.now(), size: 1, strBT: strDT, type: PearlList[j].type})
          if (res.iRet === 0) {
            console.log(`上报得红包:${res.ddwAwardHb / 100}红包，当前有${res.ddwVirHb / 100}`)
          } else {
            console.log('上报得红包失败:', res)
          }
          await wait(1000)
        }
      }
      // 珍珠奖励
      res = await api(`user/ComposePearlAddProcess`, '__t,strBT,strLT,strZone', {__t: Date.now(), strBT: strDT, strLT: strLT})
      if (res.iRet === 0) {
        console.log(`合成成功:获得${res.ddwAwardHb / 100}红包，当前有${res.dwCurProgress}珍珠，${res.ddwVirHb / 100}红包`)
      } else {
        console.log('合成失败:', res)
      }
    }
  }
})()

async function api(fn: string, stk: string, params: Params = {}, taskPosition = '') {
  let url: string
  if (['GetUserTaskStatusList', 'Award', 'DoTask'].includes(fn)) {
    let bizCode: string
    if (!params.bizCode) {
      bizCode = taskPosition === 'right' ? 'jxbfddch' : 'jxbfd'
    } else {
      bizCode = params.bizCode
    }
    url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?strZone=jxbfd&bizCode=${bizCode}&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))}&g_ty=ls`
  } else {
    url = `https://m.jingxi.com/jxbfd/${fn}?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${Date.now()}&ptag=&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBK${String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))}&g_ty=ls`
  }
  url = h5st(url, stk, params, 10032)
  let {data} = await axios.get(url, {
    headers: {
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'User-Agent': `jdpingou;iPhone;4.13.0;14.4.2;${randomString(40)};network/wifi;model/iPhone10,2;appBuild/100609;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/${Math.random() * 98 + 1};pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
      'Referer': 'https://st.jingxi.com/',
      'Cookie': cookie
    }
  })
  if (typeof data === 'string') {
    try {
      return JSON.parse(data.replace(/\n/g, '').match(/jsonpCBK.?\(([^)]*)/)![1])
    } catch (e) {
      console.log(data)
      return ''
    }
  } else {
    return data
  }
}
