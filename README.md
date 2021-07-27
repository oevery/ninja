# Ninja

一次对于 koa2 vue3 vite 的简单尝试

## 说明

Ninja 仅供学习参考使用，请于下载后的 24 小时内删除，本人不对使用过程中出现的任何问题负责，包括但不限于 `数据丢失` `数据泄露`。

Ninja 仅支持 qinglong 2.8+

[TG 频道](https://t.me/joinchat/sHKuteb_lfdjNmZl)

## 特性

* 扫码，跳转登录添加/更新 cookie

## 文档

1. 容器映射 5701 端口，ninja 目录至宿主机

   例：

   ```diff
   version: "3"
   services:
     qinglong:
       image: whyour/qinglong:latest
       container_name: qinglong
       restart: unless-stopped
       tty: true
       ports:
         - 5700:5700
   +      - 5701:5701
       environment:
         - ENABLE_HANGUP=true
         - ENABLE_WEB_PANEL=true
       volumes:
         - ./config:/ql/config
         - ./log:/ql/log
         - ./db:/ql/db
         - ./repo:/ql/repo
         - ./raw:/ql/raw
         - ./scripts:/ql/scripts
         - ./jbot:/ql/jbot
   +      - ./ninja:/ql/ninja
       labels:
         - com.centurylinklabs.watchtower.enable=false
   ```

2. 进容器内执行以下命令

   ```bash
   git clone https://github.com/MoonBegonia/ninja.git /ql/ninja
   cd /ql/ninja/backend
   pnpm install
   pm2 start
   ```

3. 将一下内容粘贴到 `extra.sh`

   ```bash
   cd /ql/ninja/backend
   pm2 start
   ```

## 注意事项

* 重启后务必执行一次 `ql extra` 保证 Ninja 配置成功。

* 更新 Ninja 只需要在容器中 `ninja/backend` 目录执行 `git pull` 然后 `pm2 start`

* Qinglong 需要在登录状态（`auth.json` 中有 token）
