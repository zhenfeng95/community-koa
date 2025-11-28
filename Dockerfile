FROM node:16.20.0

# 谁维护这个项目
LABEL maintainer=2852736760@qq.com

# 在Docker镜像内部创建一个工作目录
WORKDIR /app

COPY . .

RUN npm install --no-progress --registry=https://registry.npmmirror.com

RUN npm run build

EXPOSE 3002 11007

# 挂载目录，配置静态资源
# VOLUME [ "/app/ public" ]

CMD [ "node", "dist/server.bundle.js" ]
