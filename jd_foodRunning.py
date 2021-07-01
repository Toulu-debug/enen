import json
import time
import requests
from jdEnv import *


class FoodRunning:
    def __init__(self, cookie):
        self.cooke = cookie
        self.buyerNick = ''
        self.token = ''
        self.buyerNick = ''

    def get_token(self):
        res = requests.post(
            'https://api.m.jd.com/client.action?functionId=isvObfuscator&clientVersion=10.0.2&client=android&uuid=818aa057737ba6a4&st=1623934998790&sign=e571148c8dfb456a1795d249c6aa3956&sv=100',
            headers={
                'Host': 'api.m.jd.com',
                'accept': '*/*',
                'user-agent': USER_AGENTS,
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': self.cooke
            }, data='body=%7B%22id%22%3A%22%22%2C%22url%22%3A%22https%3A//xinruidddj-isv.isvjcloud.com%22%7D').json()
        return res['token']

    def api(self, fn):
        headers = {
            'Accept-Language': 'zh-cn',
            'Referer': 'https://jinggengjcq-isv.isvjcloud.com/paoku/index.html',
            'Connection': 'keep-alive',
            'X-Requested-With': 'XMLHttpRequest',
            'Host': 'jinggengjcq-isv.isvjcloud.com',
            'User-Agent': USER_AGENTS,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'Origin': 'https://jinggengjcq-isv.isvjcloud.com',
        }
        params = (
            ('open_id', ''),
            ('mix_nick', ''),
            ('bizExtString', ''),
            ('user_id', '10299171'),
        )
        data = json.dumps({
            "jsonRpc": "2.0",
            "params": {
                "commonParameter": {"appkey": "51B59BB805903DA4CE513D29EC448375", "m": "POST",
                                    "sign": "b27575d69359ec1294677f3072b5c442", "timestamp": 1625133905908,
                                    "userId": 10299171},
                "admJson": {"strTMMixNick": self.token, "method": "/foodRunning/" + fn, "actId": "jd_food_running",
                            "buyerNick": self.buyerNick, "pushWay": 1, "userId": 10299171}}})
        res = requests.post(f'https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/{fn}', headers=headers,
                            params=params, data=data).json()
        return res

    def mission(self, method, body=None):
        if body is None:
            body = {}
        headers = {
            'User-Agent': USER_AGENTS,
            'Accept': 'application/json',
            'Origin': 'https://jinggengjcq-isv.isvjcloud.com',
            'Referer': 'https://jinggengjcq-isv.isvjcloud.com/paoku/index.html',
            'Content-Type': 'application/json; charset=UTF-8',
            'Host': 'jinggengjcq-isv.isvjcloud.com',
        }
        params = (
            ('open_id', ''),
            ('mix_nick', ''),
            ('bizExtString', ''),
            ('user_id', '10299171'),
        )
        data = {"jsonRpc": "2.0", "params": {"commonParameter": {"appkey": "51B59BB805903DA4CE513D29EC448375", "m": "POST", "sign": "ce81175e149f37713f7bcb4cd72f8ad6", "timestamp": round(time.time() * 1000), "userId": 10299171}, "admJson": {"method": "/foodRunning/" + method, "actId": "jd_food_running", "buyerNick": self.buyerNick, "pushWay": 1, "userId": 10299171}}}
        for k, v in body.items():
            print(k, v)
            data['params']['admJson'].update({k: v})
        res = requests.post('https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/' + method, headers=headers, params=params, data=json.dumps(data)).json()
        return res

    def run(self):
        self.token = self.get_token()
        self.buyerNick = self.api('setMixNick')['data']['data']['msg']
        tasks = self.api('DailyTask')['data']['data']
        print(tasks)

        '''
        shop_list = self.mission('ShopList')['data']['data']
        for s in shop_list:
            print(s['id'],s['shopTitle'])
            print('view shop')
            res = self.mission('ViewShop')
            print(res)
            break
        '''

        # print(self.mission('complete/mission', {'goodsNumId': 3, 'missionType': 'viewGoods'}))

        can_do = ['viewBanner', 'viewShop', 'viewGoods', 'addCart']
        for t in tasks:
            if t['hasGotNum'] == '':
                times = t['dayTop']
            else:
                times = t['dayTop'] - t['hasGotNum']
            if t['type'] in can_do:
                print(t['type'], times)

        print('开始任务！')
        time.sleep(3)
        print('任务失败！')
        coin = random.randint(245, 295) * 5
        point = random.randint(1514, 1798)
        print(self.mission('SendCoin', {'coin': coin, 'point': point}))
        print(f'跑酷完成：{point}分，{coin}币')
        for i in range(1, 4):
            res = self.mission('OpenBox', {"awardId": f"jdRunningBox{i}"})
            print('拆盒子：', res['data']['data']['msg'])


if __name__ == '__main__':
    if 'Options:' not in os.popen('sudo -h').read():
        print('珍爱ck，远离docker')
    else:
        ck = cookies[0]
        fr = FoodRunning(ck)
        fr.run()
