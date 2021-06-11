## 浏览器插件获取京东cookie教程
 > 此教程内容由tg用户@wukongdada提供,特此感谢

 **以下浏览器都行**

 - Chrome浏览器
 - 新版Edge浏览器(chrome内核)

### 操作步骤

1. 电脑浏览器打开京东网址 [https://m.jd.com/](https://m.jd.com/)
2. Chrome类浏览器安装EditThisCookie插件
      - Chrome插件商店搜EditThisCookie, 或者[打开此网站](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?utm_source=chrome-ntp-icon) 进行安装
      - 仅使用百分浏览器，谷歌浏览器测试过，其他谷歌类浏览器请自行测试。
      - 无法登录Chrome插件商店或者打不开网址建议使用edge chrome版。
3. edge chrome浏览器安装Cookie Editor插件
        - [edge插件商店](edge://extensions/)搜Cookie Editor，或[打开以下网址](https://microsoftedge.microsoft.com/addons/detail/cookie-editor/ajfboaconbpkglpfanbmlfgojgndmhmc?hl=zh-CN) 完成插件安装 
4. 以下是chrome和edge的相关设置截图，输入的网址是 ``jd.com``

    ![Chrome浏览器相关设置](../icon/jd5.png)
    
    ![Edge浏览器相关设置](../icon/jd6.png)
    
5. 现在点击回到京东触屏版，再点击EditThisCookie/Cookie Editor，再点击搜索，输入key或pin，如下图所示的pt_key，复制pt_key的value值。此插件可以看到cookie的有效期。

    ![插件显示](../icon/jd7.png)
    
6. 按照以下格式形成自己的jd_cookie
      - `pt_key=复制插件搜索出来的key值;pt_pin=复制插件搜索出来的pin值;` ,后面的英文引号`;`是必须要的
      - 给一个京东cookie具体示例 `pt_key=jdDC2F833333EFDGTCE5BD4AD1A952D4F4DF84A46052;pt_pin=jd_123456;`      

7. 如果需获取第二个京东账号的cookie,不要在刚才的浏览器上面退出登录账号一(否则刚才获取的cookie会失效),需另外换一个浏览器(Chrome浏览器 `ctr+shift+n` 打开无痕模式也行),然后继续按上面步骤操作即可


