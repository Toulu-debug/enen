import re
import json
import time

import requests

ua = 'jdapp;android;10.0.5;11;0393465333165363-5333430323261366;network/wifi;model/M2102K1C;osVer/30;appBuild/88681;partner/lc001;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; M2102K1C Build/RKQ1.201112.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045534 Mobile Safari/537.36'
res = requests.get(
    'https://plogin.m.jd.com/cgi-bin/mm/new_login_entrance?lang=chs&appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
    headers={
        'Connection': 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-cn',
        'Referer': 'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
        'User-Agent': ua,
        'Host': 'plogin.m.jd.com'
    })

headers = res.headers
data = json.loads(res.text)

s_token = data['s_token']
print('s_token', s_token)
guid = re.search(r'guid=([^;]*)', headers['set-cookie']).group(1)
lsid = re.search(r'lsid=([^;]*)', headers['set-cookie']).group(1)
lstoken = re.search(r'lstoken=([^;]*)', headers['set-cookie']).group(1)
cookies = f'guid={guid};lang=chs;lsid={lsid};lstoken={lstoken};'
print(cookies)

headers = {
    'Connection': 'Keep-Alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-cn',
    'referer': f'https://plogin.m.jd.com/login/login?appid=300&returnurl=https%3A%2F%2Fwq.jd.com%2Fpassport%2FLoginRedirect%3Fstate%3D{round(time.time())}%26returnurl%3Dhttps%253A%252F%252Fhome.m.jd.com%252FmyJd%252Fnewhome.action%253Fsceneval%253D2%2526ufc%253D%2526&source=wq_passport',
    'User-Agent': ua,
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
stepsHeaders = res.headers
data = json.loads(res.text)
token = data['token']

okl_token = re.search(r'okl_token=([^;]*)', res.headers['set-cookie']).group(1)
print(okl_token)
url = f'https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token={token}'

