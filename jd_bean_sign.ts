// import {User, JDHelloWorld} from "./TS_JDHelloWorld"
//
// class Jd_bean_sign extends JDHelloWorld {
//   user: User
//   iosVer: string
//
//   constructor() {
//     super();
//   }
//
//   async init() {
//     await this.run(this)
//   }
//
//   async main(user: User) {
//     try {
//       this.user = user
//       this.user.UserAgent = `jdapp;iPhone;11.3.0;`
//       let res: any = await this.get(`https://api.m.jd.com/client.action`, {
//         'Host': 'api.m.jd.com',
//         'referer': 'https://h5.m.jd.com/',
//         'user-agent': this.user.UserAgent,
//         'accept-language': 'zh-CN,zh-Hans;q=0.9',
//         'cookie': this.user.cookie
//       }, {
//         'functionId': 'signBeanAct',
//         'body': '{"fp":"-1","shshshfp":"-1","shshshfpa":"-1","referUrl":"-1","userAgent":"-1","jda":"-1","rnVersion":"3.9"}',
//         'appid': 'ld',
//         'client': 'apple',
//         'clientVersion': '11.3.0',
//         'networkType': 'wifi',
//         'osVersion': this.iosVer,
//         'uuid': '',
//         'openudid': '',
//         'jsonp': `jsonp_${Date.now()}_${this.getRandomNumberByRange(18888, 88888)}`
//       })
//       res = JSON.parse(res.match(/\((.*)\)/)[1])
//       res.code === '0'
//         ? console.log(res.data.dailyAward.title, parseInt(res.data.dailyAward.beanAward.beanCount))
//         : console.log(res.errorMessage)
//     } catch (e) {
//       console.log(e.message)
//       await this.wait(5000)
//     }
//   }
// }
//
// new Jd_bean_sign().init().then()