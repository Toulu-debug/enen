import re
import requests


def wskey_to_ptkey(wskey):
    url = "https://api.jds.codes/jd/gentoken"
    data = {"url": "https://home.m.jd.com/myJd/newhome.action"}
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        "Content-Type": "application/json"
    }
    res = requests.post(url, json=data, headers=headers).json()
    res = res['data']['sign']
    uuid = re.search(r'uuid=(.*?)&', res).group(1)
    client_version = re.search(r'clientVersion=(.*?)&', res).group(1)
    client = re.search(r'client=(.*?)&', res).group(1)
    sign = re.search(r'(st=.*)', res).group(1)
    url = f"https://api.m.jd.com/client.action?functionId=genToken&clientVersion={client_version}&uuid={uuid}&client={client}&{sign}"
    headers = {
        "Host": 'api.m.jd.com',
        "Cookie": wskey,
        "accept": '*/*',
        "referer": '',
        'user-agent': "okhttp/3.12.1;jdmall;apple;version/9.4.0;build/88830;screen/1440x3007;os/11;network/wifi;",
        'accept-language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'content-type': 'application/x-www-form-urlencoded;',
    }
    res = requests.post(url, headers=headers, data="body=%7B%22to%22%3A%20%22https%3A//home.m.jd.com/myJd/newhome.action%22%2C%20%22action%22%3A%20%22to%22%7D").json()
    token_key = res['tokenKey']

    url = f"https://un.m.jd.com/cgi-bin/app/appjmp?tokenKey={token_key}&to=https://plogin.m.jd.com/jd-mlogin/static/html/appjmp_blank.html"
    s = requests.Session()
    s.get(url, allow_redirects=True)
    return f"pt_key={s.cookies.get_dict()['pt_key']};pt_pin={s.cookies.get_dict()['pt_pin']};"


_wskey = 'pin=jd_;wskey=AAJ;'
cookie = wskey_to_ptkey(_wskey)
print(cookie)
