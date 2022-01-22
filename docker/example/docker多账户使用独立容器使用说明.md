### 使用此方式，请先理解学会使用 **docker办法一** 的使用方式
> 发现有人好像希望不同账户任务并发执行，不想一个账户执行完了才能再执行另一个，这里写一个`docker办法一`的基础上实现方式，其实就是不同账户创建不同的容器，他们互不干扰单独定时执行自己的任务。
配置使用起来还是比较简单的，具体往下看
### 文件夹目录参考
![image](https://user-images.githubusercontent.com/6993269/97781779-885ae700-1bc8-11eb-93a4-b274cbd6062c.png)
### 具体使用说明直接在图片标注了，文件参考下方图片,配置完成后的[执行命令]()
![image](https://user-images.githubusercontent.com/6993269/97781610-a1af6380-1bc7-11eb-9397-903b47f5ad6b.png)
#### `docker-compose.yml`文件参考
```yaml
version: "3"
services:
  jd_scripts1: #默认
    image: zhaozhanzhan/jd_scripts
    # 配置服务器资源约束。此例子中服务被限制为使用内存不超过200M以及cpu不超过 0.2（单核的20%）
    # 经过实际测试，建议不低于200M
    # deploy:
    #   resources:
    #     limits:
    #       cpus: '0.2'
    #       memory: 200M
    restart: always
    container_name: jd_scripts1
    tty: true
    volumes:
      - ./logs1:/scripts/logs
    environment:
      - JD_COOKIE=pt_key=AAJfjaNrADAS8ygfgIsOxxxxxxxKpfDaZ2pSBOYTxtPqLK8U1Q;pt_pin=lxxxxxx5;
      - TG_BOT_TOKEN=130xxxx280:AAExxxxxxWP10zNf91WQ
      - TG_USER_ID=12xxxx206
      # 互助助码等参数可自行增加，如下。
      # 京东种豆得豆
      # - PLANT_BEAN_SHARECODES=
      
  jd_scripts2: #默认
    image: zhaozhanzhan/jd_scripts
    restart: always
    container_name: jd_scripts2
    tty: true
    volumes:
      - ./logs2:/scripts/logs
    environment:
      - JD_COOKIE=pt_key=AAJfjaNrADAS8ygfgIsOxxxxxxxKpfDaZ2pSBOYTxtPqLK8U1Q;pt_pin=lxxxxxx5;
      - TG_BOT_TOKEN=130xxxx280:AAExxxxxxWP10zNf91WQ
      - TG_USER_ID=12xxxx206
  jd_scripts4: #自定义追加默认之后
    image: zhaozhanzhan/jd_scripts
    restart: always
    container_name: jd_scripts4
    tty: true
    volumes:
      - ./logs4:/scripts/logs
      - ./my_crontab_list4.sh:/scripts/docker/my_crontab_list.sh
    environment:
      - JD_COOKIE=pt_key=AAJfjaNrADAS8ygfgIsOxxxxxxxKpfDaZ2pSBOYTxtPqLK8U1Q;pt_pin=lxxxxxx5;
      - TG_BOT_TOKEN=130xxxx280:AAExxxxxxWP10zNf91WQ
      - TG_USER_ID=12xxxx206
      - CUSTOM_LIST_FILE=my_crontab_list.sh
  jd_scripts5: #自定义覆盖默认
    image: zhaozhanzhan/jd_scripts
    restart: always
    container_name: jd_scripts5
    tty: true
    volumes:
      - ./logs5:/scripts/logs
      - ./my_crontab_list5.sh:/scripts/docker/my_crontab_list.sh
    environment:
      - JD_COOKIE=pt_key=AAJfjaNrADAS8ygfgIsOxxxxxxxKpfDaZ2pSBOYTxtPqLK8U1Q;pt_pin=lxxxxxx5;
      - TG_BOT_TOKEN=130xxxx280:AAExxxxxxWP10zNf91WQ
      - TG_USER_ID=12xxxx206
      - CUSTOM_LIST_FILE=my_crontab_list.sh
      - CUSTOM_LIST_MERGE_TYPE=overwrite

```
#### 目录文件配置好之后在 `jd_scripts_multi`目录执行  
 `docker-compose up -d` 启动；  
 `docker-compose logs` 打印日志；  
 `docker-compose pull` 更新镜像；  
 `docker-compose stop` 停止容器；  
 `docker-compose restart` 重启容器；  
 `docker-compose down` 停止并删除容器； 
 ![image](https://user-images.githubusercontent.com/6993269/97781935-8fcec000-1bc9-11eb-9d1a-d219e7a1caa9.png)

 
