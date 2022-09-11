// /**
//  * 京喜->领88元红包
//  * CK1    HW.ts -> 内部
//  * CK2-n  内部   -> HW.ts
//  * cron: 5 0,6,16 * * *
//  */
//
// import axios from "axios"
// import {requestAlgo, geth5st} from "./utils/V3";
// import {requireConfig, wait, getshareCodeHW, randomString, randomWord, o2s} from "./TS_USER_AGENTS"
//
// const token = require('./utils/jd_jxmc.js').token
//
// let cookie: string = '', res: any = '', UserName: string, UA: string = ''
// let shareCodesSelf: string[] = [], shareCodes: string[] = [], shareCodesHW: string[] = [], jxToken: any, data: any
//
// !(async () => {
//   let cookiesArr: any = await requireConfig()
//   for (let [index, value] of cookiesArr.entries()) {
//     cookie = value
//     UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
//     console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)
//     jxToken = await token(cookie)
//     await requestAlgo('e395f')
//     res = await api('GetUserInfo', 'activeId', {activeId: '529439'})
//     o2s(res)
//     await wait(2000)
//
//     let strUserPin: string = res.Data.strUserPin, dwHelpedTimes: number = res.Data.dwHelpedTimes
//     console.log('收到助力:', dwHelpedTimes)
//     console.log('助力码：', strUserPin)
//     shareCodesSelf.push(strUserPin)
//
//     res = await api('JoinActive', 'phoneid,stepreward_jstoken,strPin,timestamp', {phoneid: jxToken.phoneid, stepreward_jstoken: jxToken.farm_jstoken, strPin: '', timestamp: jxToken.timestamp})
//     res.iRet === 0 ? console.log('JoinActive: 成功') : console.log('JoinActive:', res.sErrMsg)
//     await wait(2000)
//   }
//
//   console.log('内部助力码：', shareCodesSelf)
//
//   for (let [index, value] of cookiesArr.entries()) {
//     await requestAlgo('e395f')
//     cookie = value
//     jxToken = await token(cookie)
//     UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
//     res = await api('GetUserInfo', 'activeId', {activeId: '529439'})
//     await wait(1000)
//     let strUserPin: string = res.Data.strUserPin
//
//     if (shareCodesHW.length === 0) {
//       shareCodesHW = await getshareCodeHW('88hb')
//     }
//     if (index === 0) {
//       shareCodes = Array.from(new Set([...shareCodesHW, ...shareCodesSelf]))
//     } else {
//       shareCodes = Array.from(new Set([...shareCodesSelf, ...shareCodesHW]))
//     }
//     for (let code of shareCodes) {
//       if (code !== strUserPin) {
//         console.log(`账号 ${UserName} 去助力 ${code}`)
//         res = await api('EnrollFriend', 'phoneid,stepreward_jstoken,strPin,timestamp', {
//           phoneid: jxToken.phoneid,
//           stepreward_jstoken: jxToken.farm_jstoken,
//           strPin: code,
//           timestamp: jxToken.timestamp
//         })
//         if (res.iRet === 0) {
//           console.log('成功')
//         } else if (res.iRet === 2015) {
//           console.log('上限')
//           break
//         } else if (res.iRet === 2016) {
//           console.log('火爆')
//           break
//         } else {
//           console.log('其他错误:', res)
//         }
//         await wait(5000)
//       }
//     }
//   }
//
//   // 拆红包
//   for (let [index, value] of cookiesArr.entries()) {
//     await requestAlgo('e395f')
//     cookie = value
//     UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
//     jxToken = await token(cookie)
//     console.log(`\n开始【京东账号${index + 1}】${UserName} 拆红包\n`)
//
//     res = await api('GetUserInfo', 'activeId', {activeId: '529439'})
//     let dwHelpedTimes: number = res.Data.dwHelpedTimes
//     await wait(2000)
//
//     for (let t of res.Data.gradeConfig) {
//       if (dwHelpedTimes >= t.dwHelpTimes && t.dwIsHasDraw === 1) {
//         res = await api('DoGradeDraw', 'grade', {grade: t.dwGrade})
//         if (res.iRet === 0)
//           console.log(`等级${t.dwGrade}红包打开成功`)
//         else {
//           console.log('其他错误', res.sErrMsg ?? JSON.stringify(res))
//           break
//         }
//         await wait(15000)
//       } else {
//         console.log(`等级${t.dwGrade}红包已打开`)
//       }
//     }
//   }
// })()
//
// async function api(fn: string, stk: string, params?: object) {
//   let timestamp: number = Date.now()
//   let url: string = `https://m.jingxi.com/cubeactive/steprewardv3/${fn}?activeId=529439&_stk=${stk}&_ste=1&userDraw=0&publishFlag=1&channel=7&_t=${timestamp}&_=${timestamp}&sceneval=2&g_login_type=1&callback=jsonpCBK${randomWord()}&g_ty=ls`
//   UA = `jdpingou;iPhone;4.13.0;14.4.2;${randomString(40)};network/wifi;model/iPhone10,2;appBuild/100609;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/${Math.random() * 98 + 1};pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`
//   let t: { key: string, value: string } [] = []
//   for (let [key, value] of Object.entries(params)) {
//     t.push({key, value})
//     url += `&${key}=${value}`
//   }
//   let h5st = geth5st(t, 'e395f')
//   url += `&h5st=${encodeURIComponent(h5st)}`
//   try {
//     let {data}: any = await axios.get(url, {
//       headers: {
//         'Host': 'm.jingxi.com',
//         'User-Agent': UA,
//         'Referer': 'https://st.jingxi.com/sns/202106/29/signinhb_new/index.html',
//         'Cookie': cookie
//       }
//     })
//     return JSON.parse(data.match(/jsonpCBK.?\((.*)/)![1])
//   } catch (e: any) {
//     return {}
//   }
// }