"""
宠汪汪兑换Pro
更新时间：2021-06-30

在env.py中设置变量

cron 59 7,15,23 * * * * 或 0 0,8,16 * * *
"""

import json
import random
import sys
import threading
import time
import datetime
import requests
from env import *


def main(cookie, validate):
    headers = {
        'Host': 'jdjoy.jd.com',
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': 'https://h5.m.jd.com',
        "User-Agent": USER_AGENTS[random.randint(0, len(USER_AGENTS))],
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
        sys.stdout.write(f"{bean['id']} {bean['giftName']} {bean['leftStock']}\n")
        if bean['giftValue'] == JD_JOY_REWARD_NAME:
            while 1:
                if datetime.datetime.now().second == 0:
                    break
                time.sleep(0.1)
            sys.stdout.write('exchange()\n')
            url = f"https://jdjoy.jd.com/common/gift/new/exchange?reqSource=h5&invokeKey=NRp8OPxZMFXmGkaE&validate={validate}"
            data = {"buyParam": {"orderSource": 'pet', "saleInfoId": bean['id']}, "deviceInfo": {}}
            res = requests.post(url, headers=headers, data=json.dumps(data)).json()
            sys.stdout.write(json.dumps(res, ensure_ascii=False) + '\n')
            if res['errorCode'] == 'buy_success':
                sys.stdout.write(f"cookie{cookie.split('pt_pin=')[1].replace(';', '')}兑换成功\n")
    lock.release()


if __name__ == '__main__':
    print("🔔宠汪汪兑换Pro,开始！")
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
