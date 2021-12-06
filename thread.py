import threading
import os
import re
import sys
from urllib.parse import quote

cookies = []


def get_cookies():
    if not os.path.exists('./test/logs'):
        os.makedirs('./test/logs')
    with open("jdCookie.js", 'r') as f:
        txt = f.read()
    for cookie in re.findall("(.*['\"]pt_key[^'|\"]*)", txt):
        if '//' not in cookie:
            cookie = re.search(r"(pt_key.*)", cookie).group(0)
            cookies.append(cookie)
    print(len(cookies), cookies)


def main(ck, index):
    filename = sys.argv[1]
    for file in os.listdir('./'):
        if filename in file:
            filename = file
    if '.ts' in filename:
        program = "ts-node"
    elif '.js' in filename:
        program = "node"
    else:
        program = "node"
    with open(f"./test/logs/{filename.split('.')[0]}-{index}.log", 'w') as f:
        f.truncate(0)
    os.system(f"{program} {filename} {quote(ck)} >> ./test/logs/{filename.split('.')[0]}-{index}.log &")
    print('done')


if __name__ == '__main__':
    print(sys.argv)
    get_cookies()
    for i in range(len(cookies)):
        threading.Thread(target=main, args=(cookies[i], i)).start()
