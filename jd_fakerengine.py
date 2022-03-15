import time
import requests
from lxml import etree


class Faker:
    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self.headers = {
            'authority': 'www.fakerengine.com',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://www.fakerengine.com',
            'referer': 'https://www.fakerengine.com/',
        }
        self.url = 'https://www.fakerengine.com/wp-json/b2/v1/userMission'
        self.auth = ''

    def api(self, fn: str, data: dict, api_type: str = ''):
        if api_type == 'jwt':
            return requests.post(f'https://www.fakerengine.com/wp-json/jwt-auth/v1/{fn}', headers=self.headers, data=data).json()
        else:
            return requests.post(f'https://www.fakerengine.com/wp-json/b2/v1/{fn}', headers=self.headers, data=data).json()

    def login(self):
        data = {
            'number': '4',
            'width': '186',
            'height': '50'
        }
        res = self.api('getRecaptcha', data)
        token = res['token']
        data = {
            'nickname': '',
            'username': self.username,
            'password': self.password,
            'code': '',
            'img_code': '',
            'invitation_code': '',
            'token': token,
            'smsToken': '',
            'luoToken': '',
            'confirmPassword': '',
            'loginType': ''
        }
        res = self.api('token', data, 'jwt')
        self.auth = res['token']
        self.headers.update({'authorization': f'Bearer {self.auth}'})
        self.get_task_data()

    def get_task_data(self):
        res = self.api('getTaskData', {})
        print(res)
        for k, v in res['task'].items():
            if v['finish'] != v['times']:
                print(k, v)

                if v['name'] == '签到':
                    pass

                if v['name'] == '评论':
                    print(v['url'])
                    self.comment_submit(v['url'].split('/')[-2])

                if v['name'] == '关注某人':
                    for i in range(v['times'] - v['finish']):
                        self.author_follow()
                        time.sleep(2)
            else:
                print(v['name'], '已完成')

    def author_follow(self):
        res = requests.get('https://www.fakerengine.com/?s=&type=user', headers=self.headers).text
        html = etree.HTML(res)
        user_ids = []
        user_links = html.xpath("//div[@class='user-s-cover']/a/@href")
        for user_link in user_links:
            user_id = user_link.split('/')[-1]
            user_ids.append(user_id)
        data = {}
        for i in range(len(user_ids)):
            data.update({f'ids[{i}]': user_ids[i]})
        res = self.api('checkFollowByids', data)
        for k, v in res.items():
            if not v:
                self.api('AuthorFollow', {'user_id': k})
                break

    def comment_submit(self, comment_post_id: int):
        res = self.api('commentSubmit', {
            'comment_post_ID': comment_post_id,
            'author': self.username,
            'comment': '板凳',
            'comment_parent': '0',
            'img[imgUrl]': '',
            'img[imgId]': ''
        })
        print(res)


if __name__ == '__main__':
    username = ''
    password = ''
    if username and password:
        faker = Faker(username, password)
        faker.login()
