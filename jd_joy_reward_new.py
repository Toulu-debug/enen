import json
import os
import threading
import time
import datetime
import requests


def main(cookie, validate):
    target = 500 or os.environ.get('JD_JOY_REWARD_NAME')
    headers = {
        'Host': 'jdjoy.jd.com',
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': 'https://h5.m.jd.com',
        "User-Agent": '23',
        'referer': 'https://jdjoy.jd.com/',
        'accept-language': 'zh-cn',
        'cookie': cookie
    }
    url = f"https://jdjoy.jd.com/common/gift/getBeanConfigs?reqSource=h5&invokeKey=NRp8OPxZMFXmGkaE&validate={validate}"
    tasks = requests.get(url, headers=headers).json()
    h = datetime.datetime.now().hour
    config = {}
    if 0 <= h < 8:
        config = tasks['data']['beanConfigs0']
    if 8 <= h < 16:
        config = tasks['data']['beanConfigs8']
    if 16 <= h < 24:
        config = tasks['data']['beanConfigs16']

    for bean in config:
        print(bean['id'], bean['giftName'], bean['leftStock'])
        if bean['giftValue'] == target:
            while 1:
                if datetime.datetime.now().second == 0:
                    break
                time.sleep(0.1)
            print('exchange()')
            url = f"https://jdjoy.jd.com/common/gift/new/exchange?reqSource=h5&invokeKey=NRp8OPxZMFXmGkaE&validate={validate}"
            data = {"buyParam": {"orderSource": 'pet', "saleInfoId": bean['id']}, "deviceInfo": {}}
            res = requests.post(url, headers=headers, data=json.dumps(data)).json()
            print(res, end='')
            if res['errorCode'] == 'buy_success':
                print(f"cookie{cookie.split('pt_pin=')[1].replace(';', '')}兑换成功")
    lock.release()


if __name__ == '__main__':
    print("🔔宠汪汪兑换加强版,开始！")
    cookies = [
        'ck1',
        'ck2',
        'ck3',
        # ...
    ]
    lock = threading.BoundedSemaphore(20)
    if 'test' in os.getcwd():
        path = '..'
    else:
        path = '.'
    with open(f'{path}/validate.txt', encoding='utf-8') as f:
        validates = f.read().split('\n')[:-1]
    print(f"====================共{len(cookies)}个京东账号Cookie=========")
    for i in range(min(len(validates), len(cookies))):
        lock.acquire()
        threading.Thread(target=main, args=(cookies[i], validates[i])).start()
