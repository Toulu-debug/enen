import re
import json
import time
import qrcode
import requests
from jdEnv import *


def main():
    res = requests.get(
        'https://plogin.m.jd.com/cgi-bin/mm/new_login_entrance?lang=chs&appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
        headers={
            'Connection': 'Keep-Alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-cn',
            'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
            'User-Agent': USER_AGENTS,
            'Host': 'plogin.m.jd.com'
        })
    headers = res.headers
    data = json.loads(res.text)
    s_token = data['s_token']
    guid = re.search(r'guid=([^;]*)', headers['set-cookie']).group(1)
    lsid = re.search(r'lsid=([^;]*)', headers['set-cookie']).group(1)
    lstoken = re.search(r'lstoken=([^;]*)', headers['set-cookie']).group(1)
    cookies = f'guid={guid};lang=chs;lsid={lsid};lstoken={lstoken};'
    headers = {
        'Connection': 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-cn',
        'referer': f'https://plogin.m.jd.com/login/login?appid=300&returnurl=https%3A%2F%2Fwq.jd.com%2Fpassport%2FLoginRedirect%3Fstate%3D{round(time.time())}%26returnurl%3Dhttps%253A%252F%252Fhome.m.jd.com%252FmyJd%252Fnewhome.action%253Fsceneval%253D2%2526ufc%253D%2526&source=wq_passport',
        'User-Agent': USER_AGENTS,
        'Host': 'plogin.m.jd.com',
        'cookie': cookies
    }

    data = {
        'lang': 'chs',
        'appid': '300',
        'returnurl': f'https://wqlogin2.jd.com/passport/LoginRedirect?state=${round(time.time())}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action',
        'source': 'wq_passport',
    }
    params = (
        ('s_token', s_token),
        ('v', round(time.time() * 1000)),
        ('remember', 'true'),
    )
    res = requests.post('https://plogin.m.jd.com/cgi-bin/m/tmauthreflogurl', headers=headers, params=params, data=data)
    data = json.loads(res.text)
    token = data['token']
    okl_token = re.search(r'okl_token=([^;]*)', res.headers['set-cookie']).group(1)
    url = f'https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token={token}'
    print(url)

    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=1,
    )
    qr.add_data(url)
    qr.print_ascii(invert=True)

    params = (
        ('token', token),
        ('ou_state', '0'),
        ('okl_token', okl_token),
    )
    headers = {
        'authority': 'plogin.m.jd.com',
        'accept': 'application/json, text/plain, */*',
        'user-agent': USER_AGENTS,
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://plogin.m.jd.com',
        'referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https%3A%2F%2Fwq.jd.com%2Fpassport%2FLoginRedirect%3Fstate%3D1101506179622%26returnurl%3Dhttps%253A%252F%252Fhome.m.jd.com%252FmyJd%252Fnewhome.action%253Fsceneval%253D2%2526ufc%253D%2526&source=wq_passport',
        'cookie': cookies,
    }
    data = {
        'lang': 'chs',
        'appid': '300',
        'returnurl': 'https://wq.jd.com/passport/LoginRedirect?state=1101506179622&returnurl=https%3A%2F%2Fhome.m.jd.com%2FmyJd%2Fnewhome.action%3Fsceneval%3D2%26ufc%3D%26',
        'source': 'wq_passport'
    }
    while 1:
        res = requests.post('https://plogin.m.jd.com/cgi-bin/m/tmauthchecktoken', headers=headers, params=params, data=data)
        res_headers = res.headers
        res = res.json()
        if res['errcode'] == 0:
            print('登陆成功！')
            cookie = re.search(r'(pt_key=\S*)', res_headers['set-cookie']).group(1) + re.search(r'(pt_pin=\S*)', res_headers['set-cookie']).group(1)
            print(cookie)
            break
        elif res['errcode'] == 21:
            print('二维码失效')
            break
        elif res['errcode'] == 176:
            print('未登录')
        else:
            print('其他错误：', res)
            break
        time.sleep(1)


if __name__ == '__main__':
    if root():
        main()
