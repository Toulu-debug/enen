import os
import sys
import hashlib
import time

import requests

mobile = input('请输入手机号:')
appid = 959
qversion = '1.0.0'
country_code = 86

ts = round(time.time() * 1000)
sub_cmd = 1
gsign = hashlib.md5(f"{appid}{qversion}{ts}36{sub_cmd}sb2cwlYyaCSN1KUv5RHG3tmqxfEb8NKN".encode()).hexdigest()
data = f"client_ver=1.0.0&gsign={gsign}&appid={appid}&return_page=https%3A%2F%2Fcrpl.jd.com%2Fn%2Fmine%3FpartnerId%3DWBTF0KYY%26ADTAG%3Dkyy_mrqd%26token%3D&cmd=36&sdk_ver=1.0.0&sub_cmd={sub_cmd}&qversion={qversion}&ts={ts}"
headers = {
    'Host': 'qapplogin.m.jd.com',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; V1838T Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.87 Mobile Safari/537.36 hap/1.9/vivo com.vivo.hybrid/1.9.6.302 com.jd.crplandroidhap/1.0.3 ({packageName:com.vivo.hybrid,type:deeplink,extra:{}})',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    'content-length': str(len(data)),
}

try:
    res = requests.post('https://qapplogin.m.jd.com/cgi-bin/qapp/quick', headers=headers, data=data).json()
    gsalt = res['data']['gsalt']
    guid = res['data']['guid']
    lsid = res['data']['lsid']
    rsa_modulus = res['data']['rsa_modulus']

    cookie = f"guid={guid}; lsid={lsid}; gsalt={gsalt}; rsa_modulus={rsa_modulus}"

    ts = round(time.time() * 1000)
    sub_cmd = 2
    gsign = hashlib.md5(f"{appid}{qversion}{ts}36{sub_cmd}{gsalt}".encode()).hexdigest()
    sign = hashlib.md5(f"{appid}{qversion}{country_code}{mobile}4dtyyzKF3w6o54fJZnmeW3bVHl0$PbXj".encode()).hexdigest()
    data = f"country_code={country_code}&client_ver=1.0.0&gsign={gsign}&appid={appid}&mobile={mobile}&sign={sign}&cmd=36&sub_cmd={sub_cmd}&qversion={qversion}&ts={ts}"
    headers.update({
        'cookie': cookie,
        'content-length': str(len(data)),
    })
    requests.post('https://qapplogin.m.jd.com/cgi-bin/qapp/quick', headers=headers, data=data)

    code = input('请输入验证码:')
    ts = round(time.time() * 1000)
    sub_cmd = 3
    gsign = hashlib.md5(f"{appid}{qversion}{ts}36{sub_cmd}{gsalt}".encode()).hexdigest()
    data = f"country_code={country_code}&client_ver=1.0.0&gsign={gsign}&smscode={code}&appid={appid}&mobile={mobile}&cmd=36&sub_cmd={sub_cmd}&qversion={qversion}&ts={ts}"
    headers.update({
        'cookie': cookie,
        'content-length': str(len(data)),
    })
    data = {
        'country_code': country_code,
        'client_ver': '1.0.0',
        'gsign': gsign,
        'smscode': code,
        'appid': appid,
        'mobile': mobile,
        'cmd': '36',
        'sub_cmd': sub_cmd,
        'qversion': qversion,
        'ts': ts
    }
    res = requests.post('https://qapplogin.m.jd.com/cgi-bin/qapp/quick', headers=headers, data=data).json()
    pt_key = res['data']['pt_key']
    pt_pin = res['data']['pt_pin']

    # pt_key = '4dtyyzKF3w6o54fJZnmeW3bVHl0$PbXj'
    # pt_pin = 'jd_crpl_kyy_mrqd'

    print('获取成功，请勿泄漏！\n')
    print(f"pt_key={pt_key}; pt_pin={pt_pin}")

except Exception as e:
    print('程序错误：', e)
    time.sleep(5)

if sys.platform == 'win32':
    os.system('pause')

