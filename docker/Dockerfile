FROM node:lts-alpine3.12

LABEL AUTHOR="zhaozhanzhan" \
      VERSION=1.0.1

ARG KEY="-----BEGIN OPENSSH PRIVATE KEY-----\n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\n-----END OPENSSH PRIVATE KEY-----"

# FROM # 基础镜像 比如node
# MAINTAINER # 镜像是谁写的 姓名+邮箱(MAINTAINER已经被废弃)
# LABEL # 给镜像添加一些元数据
# ARG # 构建参数,与 ENV 作用一至.不过作用域不一样。ARG设置的环境变量仅对Dockerfile内有效,也就是说只有docker build的过程中有效，构建好的镜像内不存在此环境变量
# RUN # 镜像构建时需要运行的命令
# ADD # 添加，比如添加一个tomcat压缩包
# WORKDIR # 镜像的工作目录
# VOLUME # 挂载的目录
# EXPOSE # 指定暴露端口，跟-p一个道理
# RUN # 最终要运行的
# CMD # 指定这个容器启动的时候要运行的命令，只有最后一个会生效，而且可被替代
# ENTRYPOINT # 指定这个容器启动的时候要运行的命令，可以追加命令
# ONBUILD # 当构建一个被继承Dockerfile 这个时候运行ONBUILD指定，触发指令
# COPY # 将文件拷贝到镜像中
# ENV # 构建的时候设置环境变量

# ====================================================================
# Add proxy, using --build-arg "HTTP_PROXY=http://192.168.1.100:7890"

ENV HTTP_PROXY ${HTTP_PROXY}
ENV HTTPS_PROXY ${HTTP_PROXY}
ENV http_proxy ${HTTP_PROXY}
ENV https_proxy ${HTTP_PROXY}

# set -e ： -e这个参数的含义是,当命令发生错误的时候,停止脚本的执行
# set -x ： -x参数的作用是把将要运行的命令用一个+标记之后显示出来
# echo -e ：激活转义字符
# echo -n ：不换行输出
# apk : 软件包管理工具
# mkdir -p ：递归创建目录，即使上级目录不存在，会按目录层级自动创建目录
# git clone -b : 克隆指定的分支 git clone -b 分支名 仓库地址

# 设置环境变量，容器内部使用
ENV DEFAULT_LIST_FILE=crontab_list.sh \
    CUSTOM_LIST_MERGE_TYPE=append \
    COOKIES_LIST=/scripts/logs/cookies.list \
    REPO_URL=git@gitee.com:zhaozhanzhan520/jd_docker.git \
    REPO_BRANCH=master

RUN set -ex \
    && echo $http_proxy \
    && echo -e "https://mirrors.ustc.edu.cn/alpine/latest-stable/main\nhttps://mirrors.ustc.edu.cn/alpine/latest-stable/community" > /etc/apk/repositories \
    && apk update \
    && apk upgrade \
    && apk add --no-cache bash tzdata git moreutils curl jq openssh-client \
    && apk add --no-cache make gcc g++ python3-dev pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev \
    && rm -rf /var/cache/apk/* \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && mkdir -p /root/.ssh \
    && echo -e $KEY > /root/.ssh/id_rsa \
    && chmod 600 /root/.ssh/id_rsa \
    && ssh-keyscan gitee.com > /root/.ssh/known_hosts \
    && git clone -b $REPO_BRANCH $REPO_URL /scripts \
    && cd /scripts \
    && mkdir logs \
    && npm config set registry https://registry.npm.taobao.org \
    && npm install \
    && cp /scripts/docker/docker_entrypoint.sh /usr/local/bin \
    && chmod +x /usr/local/bin/docker_entrypoint.sh

#Add pip install mirror:

RUN echo "[global] \
    index-url = https://mirrors.aliyun.com/pypi/simple \
    trusted-host = mirrors.aliyun.com \
    timeout = 120 \
    " > /etc/pip.conf
# ====================================================================
# RUN pip install --upgrade pip 
# ====================================================================
ENV HTTP_PROXY ""
ENV HTTPS_PROXY ""
ENV http_proxy ""
ENV https_proxy ""
# ====================================================================

WORKDIR /scripts

ENTRYPOINT ["docker_entrypoint.sh"]

# alpine版本内嵌的是BusyBox，使用alpine的crontab实际就是使用BusyBox的crond服务
CMD [ "crond" ]