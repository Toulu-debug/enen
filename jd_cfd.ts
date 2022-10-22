import {JDHelloWorld, User} from "./TS_JDHelloWorld";
import {H5ST} from "./utils/h5st_3.1";
import {getJxToken, wait} from "./TS_USER_AGENTS";

class Cfd extends JDHelloWorld {
  user: User
  shareCodeSelf: string[] = []
  h5stTool: H5ST
  token: { strPgtimestamp: string, strPhoneID: string, strPgUUNum: string }
  _ombfd: string

  constructor() {
    super();
  }

  async init() {
    await this.run(this)
  }

  async api(fn: string, obj: any = {}) {
    let timestamp: number = Date.now()
    let body = {
      'strZone': 'jxbfd',
      'bizCode': 'jxbfd',
      'source': 'jxbfd',
      'strDeviceId': this.token.strPhoneID,
      'dwEnv': '7',
      '_cfd_t': timestamp.toString(),
      'ptag': '',
      '_ste': '1',
      '_': timestamp.toString(),
      'sceneval': '2',
      'g_login_type': '1',
      'callback': `jsonpCBK${this.getRandomWord()}`,
      'g_ty': 'ls',
      'appCode': 'msd1188198',
    }
    Object.assign(body, obj)
    this._ombfd ? body['_imbfd'] = this._ombfd : ''
    if (body['_stk'].includes('_imbfd') && (!this._ombfd || !body['_imbfd'])) {
      console.log('h5st body 缺少 _imbfd')
      process.exit(0)
    }
    let h5stBody = {}
    for (let key of body['_stk'].split(',').sort()) {
      h5stBody[key] = body[key]
    }
    body['h5st'] = await this.h5stTool.__genH5st(h5stBody)
    let params: string = ''
    for (let key of Object.keys(body)) {
      params += `${key}=${body[key]}&`
    }
    let data: any = await this.get(`https://m.jingxi.com/jxbfd/${fn}?${params}`, {
      'Host': 'm.jingxi.com',
      'User-Agent': this.user.UserAgent,
      'Referer': 'https://st.jingxi.com/',
      'cookie': this.user.cookie
    })
    data = JSON.parse(data.match(/jsonpCBK.?.?\(([\w\W]*)\)/)[1])
    this._ombfd = data._ombfd || ''
    return data
  }

  async main(user: User) {
    this.user = user
    this.user.cookie += '; cid=4;'
    this.user.UserAgent = `jdpingou;Mozilla/5.0 (iPhone; CPU iPhone OS ${this.getIosVer()} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;`
    this.token = getJxToken(this.user.cookie)
    let res: any, data: any

    this.h5stTool = new H5ST('92a36', this.user.UserAgent, process.env.FP_92A36 ?? "", 'https://st.jingxi.com/fortune_island/index2.html', 'https://st.jingxi.com', this.user.UserName)
    await this.h5stTool.__genAlgo()

    res = await this.api('user/QueryUserInfo', {
      _stk: '_cfd_t,bizCode,ddwTaskId,dwEnv,dwIsReJoin,ptag,source,strDeviceId,strMarkList,strPgUUNum,strPgtimestamp,strPhoneID,strShareId,strVersion,strZone',
      'ddwTaskId': '',
      'strShareId': '',
      'strMarkList': 'guider_step,collect_coin_auth,guider_medal,guider_over_flag,build_food_full,build_sea_full,build_shop_full,build_fun_full,medal_guider_show,guide_guider_show,guide_receive_vistor,daily_task,guider_daily_task,cfd_has_show_selef_point,choose_goods_has_show,daily_task_win,new_user_task_win,guider_new_user_task,guider_daily_task_icon,guider_nn_task_icon,tool_layer,new_ask_friend_m',
      'strPgtimestamp': this.token.strPgtimestamp,
      'strPhoneID': this.token.strPhoneID,
      'strPgUUNum': this.token.strPgUUNum,
      'strVersion': '1.0.1',
      'dwIsReJoin': '0',
    })
    await this.wait(1000)

    for (let xb of res.XbStatus.XBDetail) {
      if (xb.dwRemainCnt && Date.now() > xb.ddwColdEndTm * 1000) {
        data = await this.api('user/TreasureHunt', {
          _stk: '_cfd_t,_imbfd,bizCode,dwEnv,ptag,source,strDeviceId,strIndex,strZone',
          strIndex: xb.strIndex
        })
        console.log('寻宝', xb.strIndex, data.AwardInfo.ddwValue)
        await this.wait(5000)
      }
    }

    // 背包
    res = await this.api('story/querystorageroom', {
      _stk: '_cfd_t,_imbfd,bizCode,dwEnv,ptag,source,strDeviceId,strZone',
    })
    for (let t of res.Data.Office) {
      data = await this.api('story/sellgoods', {
        _stk: '_cfd_t,_imbfd,bizCode,dwEnv,dwSceneId,ptag,source,strDeviceId,strTypeCnt,strZone',
        dwSceneId: '1',
        strTypeCnt: `${t.dwType}:${t.dwCount}`,
      })
      console.log('卖贝壳', data.Data.ddwCoin)
      await this.wait(2000)
    }

    // 贝壳
    res = await this.api('story/queryshell', {
      _stk: '_cfd_t,_imbfd,bizCode,dwEnv,ptag,source,strDeviceId,strZone',
    })
    await this.wait(1000)
    for (let pick of res.Data.NormShell) {
      for (; pick.dwNum; pick.dwNum--) {
        data = await this.api('story/pickshell', {
          _stk: '_cfd_t,_imbfd,bizCode,dwEnv,dwType,ptag,source,strDeviceId,strZone',
          dwType: pick.dwType
        })
        console.log(data.Data.strFirstDesc)
        await this.wait(2000)
      }
    }

    for (let strBuildIndex of ['fun', 'shop', 'sea', 'food']) {
      data = await this.api('user/CollectCoin', {
        _stk: '_cfd_t,_imbfd,bizCode,dwEnv,dwType,ptag,source,strBuildIndex,strDeviceId,strZone',
        dwType: '1',
        strBuildIndex: strBuildIndex
      })
      console.log(`${strBuildIndex}收金币:`, data.ddwCoin)
      await wait(2000)
    }
  }
}

new Cfd().init().then()