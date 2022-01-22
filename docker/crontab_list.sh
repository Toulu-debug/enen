# 每3天的23:50分清理一次日志(互助码不清理，proc_file.sh对该文件进行了去重)
50 23 */3 * * find /scripts/logs -name '*.log' | grep -v 'sharecodeCollection' | xargs rm -rf
#收集助力码
30 * * * * sh +x /scripts/docker/auto_help.sh collect >>/scripts/logs/auto_help_collect.log 2>&1

##############短期活动##############
#京东极速版红包(活动时间：2021-5-5至2021-5-31)
45 0,23 * * * node /scripts/jd_speed_redpocke.js >>/scripts/logs/jd_speed_redpocke.log 2>&1

#超级直播间红包雨(活动时间不定期，出现异常提示请忽略。红包雨期间会正常)
1,31 0-23/1 * * * node /scripts/jd_live_redrain.js >>/scripts/logs/jd_live_redrain.log 2>&1

#每日抽奖(活动时间：2021-05-01至2021-05-31)
13 1,22,23 * * * node /scripts/jd_daily_lottery.js >>/scripts/logs/jd_daily_lottery.log 2>&1

#金榜创造营 活动时间：2021-05-21至2021-12-31
13 1,22 * * * node /scripts/jd_gold_creator.js >>/scripts/logs/jd_gold_creator.log 2>&1
#5G超级盲盒(活动时间：2021-06-2到2021-07-31)
0 0,1-23/3 * * * node /scripts/jd_mohe.js >>/scripts/logs/jd_mohe.log 2>&1
#明星小店(星店长，2021-06-10)
10 9,18 9-25 8 node /scripts/jd_star_shop.js >>/scripts/logs/jd_star_shop.log 2>&1
#省钱大赢家之翻翻乐
10,40 * * * * node /scripts/jd_big_winner.js >>/scripts/logs/jd_big_winner.log 2>&1
##############长期活动##############
# 签到
7 0,17 * * * cd /scripts && node jd_bean_sign.js >>/scripts/logs/jd_bean_sign.log 2>&1
# 东东超市兑换奖品
59 23 * * * node /scripts/jd_blueCoin.js >>/scripts/logs/jd_blueCoin.log 2>&1
# 摇京豆
5 0,23 * * * node /scripts/jd_club_lottery.js >>/scripts/logs/jd_club_lottery.log 2>&1
# 东东农场
15 6-18/6 * * * node /scripts/jd_fruit.js >>/scripts/logs/jd_fruit.log 2>&1
# 东东农场好友删减奖励
10 5,17 * * * node /scripts/jd_fruit_friend.js >>/scripts/logs/jd_fruit_friend.log 2>&1
# 宠汪汪
45 */2,23 * * * node /scripts/jd_joy.js >>/scripts/logs/jd_joy.log 2>&1
# 宠汪汪积分兑换京豆
0 0-16/8 * * * node /scripts/jd_joy_reward.js >>/scripts/logs/jd_joy_reward.log 2>&1
# 宠汪汪喂食
35 */1 * * * node /scripts/jd_joy_feedPets.js >>/scripts/logs/jd_joy_feedPets.log 2>&1
# 宠汪汪邀请助力
10 13-20/1 * * * node /scripts/jd_joy_run.js >>/scripts/logs/jd_joy_run.log 2>&1
# 摇钱树
23 */2 * * * node /scripts/jd_moneyTree.js >>/scripts/logs/jd_moneyTree.log 2>&1
# 东东萌宠
35 6-18/6 * * * node /scripts/jd_pet.js >>/scripts/logs/jd_pet.log 2>&1
# 京东种豆得豆
10 7-22/1 * * * node /scripts/jd_plantBean.js >>/scripts/logs/jd_plantBean.log 2>&1
# 京东全民开红包
1 1,2,23 * * * node /scripts/jd_redPacket.js >>/scripts/logs/jd_redPacket.log 2>&1
# 进店领豆
6 0 * * * node /scripts/jd_shop.js >>/scripts/logs/jd_shop.log 2>&1
# 东东超市
31 0,1-23/2 * * * node /scripts/jd_superMarket.js >>/scripts/logs/jd_superMarket.log 2>&1
# 取关京东店铺商品
45 23 * * * node /scripts/jd_unsubscribe.js >>/scripts/logs/jd_unsubscribe.log 2>&1
# 京东资产变动
20 9 * * * node /scripts/jd_bean_change.js >>/scripts/logs/jd_bean_change.log 2>&1
# 京豆月资产变动通知
#20 9 * * * node /scripts/jd_bean_month_change.js >>/scripts/logs/jd_bean_month_change.log 2>&1
# 京豆日资产变动通知
#20 8 * * * node /scripts/jd_bean_day_change.js >>/scripts/logs/jd_bean_day_change.log 2>&1
# 京东日资产变动加强版
30 8 * * * node /scripts/jd_bean_day_change_pro.js >>/scripts/logs/jd_bean_day_change_pro.log 2>&1
# 京东抽奖机
0 0,12,23 * * * node /scripts/jd_lotteryMachine.js >>/scripts/logs/jd_lotteryMachine.log 2>&1
# 京东排行榜
21 9 * * * node /scripts/jd_rankingList.js >>/scripts/logs/jd_rankingList.log 2>&1
# 天天提鹅
28 * * * * node /scripts/jd_daily_egg.js >>/scripts/logs/jd_daily_egg.log 2>&1
# 金融养猪
32 0-23/6 * * * node /scripts/jd_pigPet.js >>/scripts/logs/jd_pigPet.log 2>&1
# 京喜工厂
50 * * * * node /scripts/jd_dreamFactory.js >>/scripts/logs/jd_dreamFactory.log 2>&1
# 东东小窝
46 6,23 * * * node /scripts/jd_small_home.js >>/scripts/logs/jd_small_home.log 2>&1
# 东东工厂
26 * * * * node /scripts/jd_jdfactory.js >>/scripts/logs/jd_jdfactory.log 2>&1
# 赚京豆(微信小程序)
12 * * * * node /scripts/jd_syj.js >>/scripts/logs/jd_syj.log 2>&1
# 京东快递签到
47 1 * * * node /scripts/jd_kd.js >>/scripts/logs/jd_kd.log 2>&1
# 京东汽车(签到满500赛点可兑换500京豆)
0 0 * * * node /scripts/jd_car.js >>/scripts/logs/jd_car.log 2>&1
# 领京豆额外奖励(每日可获得3京豆)
23 1,12,22 * * * node /scripts/jd_bean_home.js >>/scripts/logs/jd_bean_home.log 2>&1
# 微信小程序京东赚赚
6 0-5/1,11 * * * node /scripts/jd_jdzz.js >>/scripts/logs/jd_jdzz.log 2>&1
# crazyJoy自动每日任务
30 7,23 * * * node /scripts/jd_crazy_joy.js >>/scripts/logs/jd_crazy_joy.log 2>&1
# 京东汽车旅程赛点兑换金豆
0 0 * * * node /scripts/jd_car_exchange.js >>/scripts/logs/jd_car_exchange.log 2>&1
# 导到所有互助码
23 7 * * * node /scripts/jd_get_share_code.js >>/scripts/logs/jd_get_share_code.log 2>&1
# 口袋书店
38 8,12,18 * * * node /scripts/jd_bookshop.js >>/scripts/logs/jd_bookshop.log 2>&1
# 京喜农场
30 9,12,18 * * * node /scripts/jd_jxnc.js >>/scripts/logs/jd_jxnc.log 2>&1
# 农场集勋章
16 7,16 * * * node /scripts/jd_medal.js >>/scripts/logs/jd_medal.log 2>&1
# 签到领现金
10 */4 * * * node /scripts/jd_cash.js >>/scripts/logs/jd_cash.log 2>&1
# 闪购盲盒
47 8,22 * * * node /scripts/jd_sgmh.js >>/scripts/logs/jd_sgmh.log 2>&1
# 京东秒秒币
10 6,21 * * * node /scripts/jd_ms.js >>/scripts/logs/jd_ms.log 2>&1
#美丽研究院
41 7,12,19 * * * node /scripts/jd_beauty.js >>/scripts/logs/jd_beauty.log 2>&1
#京东保价
#41 0,23 * * * node /scripts/jd_price.js >> /scripts/logs/jd_price.log 2>&1
#京东极速版签到+赚现金任务
21 1,6 * * * node /scripts/jd_speed_sign.js >>/scripts/logs/jd_speed_sign.log 2>&1
#监控crazyJoy分红
10 12 * * * node /scripts/jd_crazy_joy_bonus.js >>/scripts/logs/jd_crazy_joy_bonus.log 2>&1
# 删除优惠券(默认注释，如需要自己开启，如有误删，已删除的券可以在回收站中还原，慎用)
#20 9 * * 6 node /scripts/jd_delCoupon.js >> /scripts/logs/jd_delCoupon.log 2>&1
#家庭号
10 6,7 * * * node /scripts/jd_family.js >>/scripts/logs/jd_family.log 2>&1
#京东直播（又回来了）
30-50/5 12,23 * * * node /scripts/jd_live.js >>/scripts/logs/jd_live.log 2>&1
#京东健康社区
13 1,6,22 * * * node /scripts/jd_health.js >>/scripts/logs/jd_health.log 2>&1
#京东健康社区收集健康能量
5-45/20 * * * * node /scripts/jd_health_collect.js >>/scripts/logs/jd_health_collect.log 2>&1
# 幸运大转盘
10 10,23 * * * node /scripts/jd_market_lottery.js >>/scripts/logs/jd_market_lottery.log 2>&1
# 领金贴
5 0 * * * node /scripts/jd_jin_tie.js >>/scripts/logs/jd_jin_tie.log 2>&1
#京喜牧场
20 0-23/3 * * * node /scripts/jd_jxmc.js >>/scripts/logs/jd_jxmc.log 2>&1
#赚金币
0 5 * * * node /scripts/jd_zjb.js >>/scripts/logs/jd_zjb.log 2>&1
#是兄弟就砍我2
0 5 * * * node /scripts/jd_kanjia2.js >>/scripts/logs/jd_kanjia2.log 2>&1
#0元砍价
0 6 * * * node /scripts/jd_kanjia3.js >>/scripts/logs/jd_kanjia3.log 2>&1
#惊喜工厂抢茅台
0 6 * * * node /scripts/jd_jxgc.js >>/scripts/logs/jd_jxgc.log 2>&1
#推一推
0 0 * * * node /scripts/jd_tyt.js >>/scripts/logs/jd_tyt.log 2>&1
#邀请有礼
0 0 * * * node /scripts/jd_yqyl.js >>/scripts/logs/jd_yqyl.log 2>&1
#全民挖现金
0 6 * * * node /scripts/jd_qmwxj.js >>/scripts/logs/jd_qmwxj.log 2>&1
#品牌狂欢日
0 6 * * * node /scripts/jd_ppkhr.js >>/scripts/logs/jd_ppkhr.log 2>&1
#泡泡大战
1 0 * * * node /scripts/jd_ppdz.js >>/scripts/logs/jd_ppdz.log 2>&1
#我是大老板农场
5 0-23/6 * * * node /scripts/jd_wsdlb.js >>/scripts/logs/jd_wsdlb.log 2>&1
#省钱大赢家获取邀请码
0 6 * * * node /scripts/jd_sq.js >>/scripts/logs/jd_sq.log 2>&1
#省钱大赢家
0,2 0 * * * node /scripts/jd_sqdyj.js >>/scripts/logs/jd_sqdyj.log 2>&1
#是兄弟就砍我
0 0 * * * node /scripts/jd_kanjia.js >>/scripts/logs/jd_kanjia.log 2>&1
#京东试用
30 10 * * * node /scripts/jd_try.js >>/scripts/logs/jd_try.log 2>&1
#东东电竞经理
15 10 * * * node /scripts/jd_zooElecsport.js >>/scripts/logs/jd_zooElecsport.log 2>&1
#QQ星系牧场
30 7 * * * node /scripts/jd_qqxing.js >>/scripts/logs/jd_qqxing.log 2>&1
#京享值PK
15 0,6,13,19,21 * * * node /scripts/jd_jxzpk.js >>/scripts/logs/jd_jxzpk.log 2>&1
#柠檬众筹好物上新
20 12,14 * * * * * * node /scripts/jd_hwsx.js >>/scripts/logs/jd_hwsx.log 2>&1
#点点券
10 0,6,7,10,20 * * * node /scripts/jd_necklace.js >>/scripts/logs/jd_necklace.log 2>&1
#狂欢欧洲杯
15 8,12 * * * node /scripts/jd_europeancup.js >>/scripts/logs/jd_europeancup.log 2>&1
#柠檬京东零食街
0 11 * * * node /scripts/jd_lsj.js >>/scripts/logs/jd_lsj.log 2>&1
#众筹许愿池
0 8,12 * * * node /scripts/jd_wish.js >>/scripts/logs/jd_wish.log 2>&1
#送豆得豆
45 1,12 * * * node /scripts/jd_sendBeans.js >>/scripts/logs/jd_sendBeans.log 2>&1
#柠檬旺财乐园新手上路版
55 2-22/2 * * * node /scripts/jd_joyPark.js >>/scripts/logs/jd_joyPark.log 2>&1
#燃动夏季
12 0,6-23/2 * * * node /scripts/jd_summerMovement.js >>/scripts/logs/jd_summerMovement.log 2>&1
#愤怒的锦鲤
15 0 * * * node /scripts/jd_angryKoi.js >>/scripts/logs/jd_angryKoi.log 2>&1
#京东超级盒子
15 9,20 * 5,6 * node /scripts/jd_superBox.js >>/scripts/logs/jd_superBox.log 2>&1
#京喜财富岛新版
5 * * * * node /scripts/jd_cfd.js >>/scripts/logs/jd_cfd.log 2>&1
#京喜财富岛热气球挂后台
5 * * * * node /scripts/jd_cfd_loop.js >>/scripts/logs/jd_cfd_loop.log 2>&1
#京喜财富岛提现
59 11,12,23 * * * node /scripts/jd_cfdtx.js >>/scripts/logs/jd_cfdtx.log 2>&1
#宠汪汪偷好友积分与狗粮
3 */2 * * * node /scripts/jd_joy_steal.js >>/scripts/logs/jd_joy_steal.log 2>&1
#柠檬特物Z密室大逃脱
30 0 * * * node /scripts/jd_twmsdtt.js >>/scripts/logs/jd_twmsdtt.log 2>&1
#柠檬特务Z行动-星小店
20 0 * * * node /scripts/jd_twzStar.js >>/scripts/logs/jd_twzStar.log 2>&1
#柠檬发财翻翻乐
1 0-23/1 * 6 * node /scripts/jd_fcffl.js >>/scripts/logs/jd_fcffl.log 2>&1
#柠檬发财大赢家
0,2 0 * * * node /scripts/jd_fcdyj.js >>/scripts/logs/jd_fcdyj.log 2>&1
#京东签到图形验证
10 9 * * * node /scripts/jd_signGraphics.js >>/scripts/logs/jd_signGraphics.log 2>&1
#柠檬伊利云养牛
0 12 * * * node /scripts/jd_ylyn.js >>/scripts/logs/jd_ylyn.log 2>&1
#全民抢京豆
08 2 * * * node /scripts/jd_qjd.js >>/scripts/logs/jd_qjd.log 2>&1
#MM领京豆
21 9 * * * node /scripts/jd_ljd.js >>/scripts/logs/jd_ljd.log 2>&1
#粉丝互动
1 8 * * * node /scripts/jd_wxFans.js >>/scripts/logs/jd_wxFans.log 2>&1
#店铺签到
10 8 * * * node /scripts/jd_dpqd.js >>/scripts/logs/jd_dpqd.log 2>&1
#京东摇钱树助力
30 * * * * node /scripts/jd_moneyTree_help.js >>/scripts/logs/jd_moneyTree_help.log 2>&1
#汪汪乐园养joy
20 0-23/3 * * * node /scripts/jd_joy_park.js >>/scripts/logs/jd_joy_park.log 2>&1
#汪汪乐园每日任务
20 7,9,17,20 * * * node /scripts/jd_joy_park_task.js >>/scripts/logs/jd_joy_park_task.log 2>&1
#汪汪乐园每日助力
30 23 * * * node /scripts/jd_joy_park_help.js >>/scripts/logs/jd_joy_park_help.log 2>&1
#汪汪乐园提现
15 10 * * * node /scripts/jd_joy_tx.js >>/scripts/logs/jd_joy_tx.log 2>&1
#京东手机狂欢城
#0 0-18/6 * * * node /scripts/jd_carnivalcity.js >>/scripts/logs/jd_carnivalcity.log 2>&1
#京东手机狂欢城助力
#10 0,8 * * * node /scripts/jd_carnivalcity_help.js >>/scripts/logs/jd_carnivalcity_help.log 2>&1
#京喜签到
20 1,8 * * * node /scripts/jd_jxsign.js >>/scripts/logs/jd_jxsign.log 2>&1
#京喜签到喜豆
30 2,9 * * * node /scripts/jd_jxSignXd.js >>/scripts/logs/jd_jxSignXd.log 2>&1
#女装盲盒抽京豆
35 1,23 * * * node /scripts/jd_nzmh.js >>/scripts/logs/jd_nzmh.log 2>&1
#京喜领88元红包
4 2,10 * * * node /scripts/jd_jxlhb.js >>/scripts/logs/jd_jxlhb.log 2>&1
#8.13-8.25 骁龙品牌日
18 9,19 13-25 8 * node /scripts/jd_xiaolong.js >>/scripts/logs/jd_xiaolong.log 2>&1
#来电好物季
10 1 * * * node /scripts/jd_ldhwj.js >>/scripts/logs/jd_ldhwj.log 2>&1
#领券中心签到
15 0 * * * node /scripts/jd_ccSign.js >>/scripts/logs/jd_ccSign.log 2>&1
#内容鉴赏官
15 3,6 * * * node /scripts/jd_connoisseur.js >>/scripts/logs/jd_connoisseur.log 2>&1
#京东小魔方
15 3,6 * * * node /scripts/jd_mf.js >>/scripts/logs/jd_mf.log 2>&1
#东东世界
15 3,9 * * * node /scripts/jd_ddworld.js >>/scripts/logs/jd_ddworld.log 2>&1
#东东世界兑换
0 0 * * * node /scripts/jd_ddworld_exchange.js >>/scripts/logs/jd_ddworld_exchange.log 2>&1
#跳跳乐瓜分京豆
1 0,11,21 * * * node /scripts/jd_jump.js >>/scripts/logs/jd_jump.log 2>&1
#城城领现金
0 0-23/1 * * * node /scripts/jd_city.js >>/scripts/logs/jd_city.log 2>&1
#预售福利机
5 0,2 * * * node /scripts/jd_ys.js >>/scripts/logs/jd_ys.log 2>&1
#京喜财富岛合成月饼
5 * * * * node /scripts/jd_cfd_mooncake.js >>/scripts/logs/jd_cfd_mooncake.log 2>&1
#京喜财富岛合成生鲜
45 * * * * node /scripts/jd_cfd_fresh.js >>/scripts/logs/jd_cfd_fresh.log 2>&1
#京喜财富岛合成珍珠
30 0-23/2 * * * node /scripts/jd_cfd_pearl.js >>/scripts/logs/jd_cfd_pearl.log 2>&1
#攒金币 赢大礼
22 0,8 * * * node /scripts/jd_GoldcoinToGift.js >>/scripts/logs/jd_GoldcoinToGift.log 2>&1
#京享红包
0 0,12,18,20 * * * node /scripts/jd_redEnvelope.js >>/scripts/logs/jd_redEnvelope.log 2>&1
#财富岛珍珠兑换
59 0-23/1 * * * node /scripts/jd_cfd_pearl_ex.js >>/scripts/logs/jd_cfd_pearl_ex.log 2>&1
#京豆兑换为喜豆
59 0-23/1 * * * node /scripts/jd_exchangejxbeans.js >>/scripts/logs/jd_exchangejxbeans.log 2>&1
#京东签到翻牌
10 8 * * * node /scripts/jd_sign_graphics1.js >>/scripts/logs/jd_sign_graphics1.log 2>&1
#美丽研究院--兑换
1 7,12,19 * * * node /scripts/jd_beauty_ex.js >>/scripts/logs/jd_beauty_ex.log 2>&1
#京东饭粒
18 7,12,19 * * * node /scripts/jd_fanli.js >>/scripts/logs/jd_fanli.log 2>&1
#京东金榜
13 6 * * * node /scripts/jd_gold_sign.js >>/scripts/logs/jd_gold_sign.log 2>&1
#清空购物车
10 6,22 * * * node /scripts/jd_clean_car.js >>/scripts/logs/jd_clean_car.log 2>&1
#京东评价
37 15 * * * node /scripts/jd_evaluation.js >>/scripts/logs/jd_evaluation.log 2>&1
#发财挖宝
40 6,17 * * * node /scripts/jd_fcwb_help.js >>/scripts/logs/jd_fcwb_help.log 2>&1
#京车会签到
19 5 * * * node /scripts/jd_jchsign.js >>/scripts/logs/jd_jchsign.log 2>&1
#京东特价翻翻乐
20 0-23/3 * * * node /scripts/jd_jdtj_winner.js >>/scripts/logs/jd_jdtj_winner.log 2>&1
#见缝插针
15 10 * * * node /scripts/jd_jfcz.js >>/scripts/logs/jd_jfcz.log 2>&1
#京东金融每周领取权益活动
10 17 6 12 * node /scripts/jd_jr_draw.js >>/scripts/logs/jd_jr_draw.log 2>&1
#京东赚京豆一分钱抽奖
10 0 * * * node /scripts/jd_lottery_drew.js >>/scripts/logs/jd_lottery_drew.log 2>&1
#逛京东会场
0 0 * * * node /scripts/jd_mall.js >>/scripts/logs/jd_mall.log 2>&1
#整点红包雨
0 * * * * node /scripts/jd_redrain.js >>/scripts/logs/jd_redrain.log 2>&1
# 炸年兽
#0 0-23/5 * * *  node /scripts/jd_zns.js >> /scripts/logs/jd_zns.log 2>&1
# 年货节签到
23 2,22 * * * node /scripts/jd_nh_sign.js >> /scripts/logs/jd_nh_sign.log 2>&1
#年货节
0 0,20,22 * * * node /scripts/jd_nh_red.js >> /scripts/logs/jd_nh_red.log 2>&1
#京东极速版免单签到
20 0,22 * * * node /scripts/jd_speed_md_sign.js >> /scripts/logs/jd_speed_md_sign.log 2>&1
#天天压岁钱
50 10,18 * * * node /scripts/jd_ttysq.js >> /scripts/logs/jd_ttysq.log 2>&1
#白条抽奖
10 8,20 13-31,1-7 1,2 * node /scripts/jd_bt_sign.js >> /scripts/logs/jd_bt_sign.log 2>&1
# 萌虎摇摇乐
0 0,18 * * * node /scripts/jd_tiger.js >> /scripts/logs/jd_tiger.log 2>&1
# 萌虎摇摇乐助力
0 0,18 * * * node /scripts/jd_tiger_help.js >> /scripts/logs/jd_tiger_help.log 2>&1
# 通天塔签到共建
0 0,3 * * * node /scripts/jd_babel_sign.js >> /scripts/logs/jd_babel_sign.log 2>&1
