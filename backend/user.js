/* eslint-disable camelcase */
'use strict';

const got = require('got');
require('dotenv').config();
const QRCode = require('qrcode');
const { addEnv, delEnv, getEnvs, getEnvsCount, updateEnv } = require('./ql');
const path = require('path');
const qlDir = process.env.QL_DIR || '/ql';
const notifyFile = path.join(qlDir, 'shell/notify.sh');
const { exec } = require('child_process');
const { GET_RANDOM_TIME_UA } = require('./utils/USER_AGENT');

const api = got.extend({
  retry: { limit: 0 },
  responseType: 'json',
});

module.exports = class User {
  ua;
  pt_key;
  pt_pin;
  cookie;
  eid;
  timestamp;
  nickName;
  token;
  okl_token;
  cookies;
  QRCode;
  remark;
  #s_token;

  constructor({ token, okl_token, cookies, pt_key, pt_pin, cookie, eid, remarks, remark, ua }) {
    this.token = token;
    this.okl_token = okl_token;
    this.cookies = cookies;
    this.pt_key = pt_key;
    this.pt_pin = pt_pin;
    this.cookie = cookie;
    this.eid = eid;
    this.remark = remark;
    this.ua = ua;

    if (pt_key && pt_pin) {
      this.cookie = 'pt_key=' + this.pt_key + ';pt_pin=' + this.pt_pin + ';';
    }

    if (cookie) {
      this.pt_pin = cookie.match(/pt_pin=(.*?);/)[1];
      this.pt_key = cookie.match(/pt_key=(.*?);/)[1];
    }

    if (remarks) {
      this.remark = remarks.match(/remark=(.*?);/) && remarks.match(/remark=(.*?);/)[1];
    }
  }

  async getQRConfig() {
    this.ua = this.ua || process.env.NINJA_UA || GET_RANDOM_TIME_UA();
    const taskUrl = `https://plogin.m.jd.com/cgi-bin/mm/new_login_entrance?lang=chs&appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=${Date.now()}&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport`;
    const response = await api({
      url: taskUrl,
      headers: {
        Connection: 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-cn',
        Referer: taskUrl,
        'User-Agent': this.ua,
        Host: 'plogin.m.jd.com',
      },
    });
    const headers = response.headers;
    const data = response.body;
    await this.#formatSetCookies(headers, data);

    if (!this.#s_token) {
      throw new Error('二维码创建失败！');
    }

    const nowTime = Date.now();
    // eslint-disable-next-line prettier/prettier
    const taskPostUrl = `https://plogin.m.jd.com/cgi-bin/m/tmauthreflogurl?s_token=${
      this.#s_token
    }&v=${nowTime}&remember=true`;

    const configRes = await api({
      method: 'post',
      url: taskPostUrl,
      body: `lang=chs&appid=300&source=wq_passport&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=${nowTime}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action`,
      headers: {
        Connection: 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-cn',
        Referer: taskUrl,
        'User-Agent': this.ua,
        Host: 'plogin.m.jd.com',
        Cookie: this.cookies,
      },
    });
    const configHeaders = configRes.headers;
    const configData = configRes.body;

    this.token = configData.token;
    if (this.token)
      this.QRCode = await QRCode.toDataURL(
        `https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token=${this.token}`
      );
    const cookies = configHeaders['set-cookie'][0];
    this.okl_token = cookies.substring(cookies.indexOf('=') + 1, cookies.indexOf(';'));
  }

  async checkQRLogin() {
    if (!this.token || !this.okl_token || !this.cookies) {
      throw new Error('初始化登录请求失败！');
    }
    const nowTime = Date.now();
    const loginUrl = `https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=${nowTime}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport`;
    const getUserCookieUrl = `https://plogin.m.jd.com/cgi-bin/m/tmauthchecktoken?&token=${this.token}&ou_state=0&okl_token=${this.okl_token}`;
    const response = await api({
      method: 'POST',
      url: getUserCookieUrl,
      body: `lang=chs&appid=300&source=wq_passport&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=${nowTime}&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action`,
      headers: {
        Connection: 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-cn',
        Referer: loginUrl,
        'User-Agent': this.ua,
        Cookie: this.cookies,
      },
    });
    const data = response.body;
    const headers = response.headers;
    if (data.errcode === 0) {
      const pt_key = headers['set-cookie'][1];
      this.pt_key = pt_key.substring(pt_key.indexOf('=') + 1, pt_key.indexOf(';'));
      const pt_pin = headers['set-cookie'][2];
      this.pt_pin = pt_pin.substring(pt_pin.indexOf('=') + 1, pt_pin.indexOf(';'));
      this.cookie = 'pt_key=' + this.pt_key + ';pt_pin=' + this.pt_pin + ';';

      const result = await this.CKLogin();
      result.errcode = 0;
      return result;
    }

    return {
      errcode: data.errcode,
      message: data.message,
    };
  }

  async CKLogin() {
    let message;
    await this.#getNickname();
    const envs = await getEnvs();
    const poolInfo = await User.getPoolInfo();
    const env = await envs.find((item) => item.value.match(/pt_pin=(.*?);/)[1] === this.pt_pin);
    if (!env) {
      // 新用户
      if (!poolInfo.allowAdd) {
        throw new UserError('管理员已关闭注册，去其他地方看看吧', 210, 200);
      } else if (poolInfo.marginCount === 0) {
        throw new UserError('本站已到达注册上限，你来晚啦', 211, 200);
      } else {
        const remarks = `remark=${this.nickName};`;
        const body = await addEnv(this.cookie, remarks);
        if (body.code !== 200) {
          throw new UserError(body.message || '添加账户错误，请重试', 220, body.code || 200);
        }
        this.eid = body.data[0]._id;
        this.timestamp = body.data[0].timestamp;
        message = `注册成功，${this.nickName}`;
        this.#sendNotify('Ninja 运行通知', `用户 ${this.nickName}(${decodeURIComponent(this.pt_pin)}) 已上线`);
      }
    } else {
      this.eid = env._id;
      const body = await updateEnv(this.cookie, this.eid);
      if (body.code !== 200) {
        throw new UserError(body.message || '更新账户错误，请重试', 221, body.code || 200);
      }
      this.timestamp = body.data.timestamp;
      message = `欢迎回来，${this.nickName}`;
      this.#sendNotify('Ninja 运行通知', `用户 ${this.nickName}(${decodeURIComponent(this.pt_pin)}) 已更新 CK`);
    }
    return {
      nickName: this.nickName,
      eid: this.eid,
      timestamp: this.timestamp,
      message,
    };
  }

  async getUserInfoByEid() {
    const envs = await getEnvs();
    const env = await envs.find((item) => item._id === this.eid);
    if (!env) {
      throw new UserError('没有找到这个账户，重新登录试试看哦', 230, 200);
    }
    this.cookie = env.value;
    this.timestamp = env.timestamp;
    const remarks = env.remarks;
    if (remarks) {
      this.remark = remarks.match(/remark=(.*?);/) && remarks.match(/remark=(.*?);/)[1];
    }
    await this.#getNickname();
    return {
      nickName: this.nickName,
      eid: this.eid,
      timestamp: this.timestamp,
      remark: this.remark,
    };
  }

  async updateRemark() {
    if (!this.eid || !this.remark || this.remark.replace(/(^\s*)|(\s*$)/g, '') === '') {
      throw new UserError('参数错误', 240, 200);
    }

    const envs = await getEnvs();
    const env = await envs.find((item) => item._id === this.eid);
    if (!env) {
      throw new UserError('没有找到这个账户，重新登录试试看哦', 230, 200);
    }
    this.cookie = env.value;

    const remarks = `remark=${this.remark};`;

    const updateEnvBody = await updateEnv(this.cookie, this.eid, remarks);
    if (updateEnvBody.code !== 200) {
      throw new UserError('更新/上传备注出错，请重试', 241, 200);
    }

    return {
      message: '更新/上传备注成功',
    };
  }

  async delUserByEid() {
    await this.getUserInfoByEid();
    const body = await delEnv(this.eid);
    if (body.code !== 200) {
      throw new UserError(body.message || '删除账户错误，请重试', 240, body.code || 200);
    }
    this.#sendNotify('Ninja 运行通知', `用户 ${this.nickName}(${decodeURIComponent(this.pt_pin)}) 删号跑路了`);
    return {
      message: '账户已移除',
    };
  }

  static async getPoolInfo() {
    const count = await getEnvsCount();
    const allowCount = (process.env.ALLOW_NUM || 40) - count;
    return {
      marginCount: allowCount >= 0 ? allowCount : 0,
      allowAdd: Boolean(process.env.ALLOW_ADD) || true,
    };
  }

  static async getUsers() {
    const envs = await getEnvs();
    const result = envs.map(async (env) => {
      const user = new User({ cookie: env.value, remarks: env.remarks });
      await user.#getNickname(true);
      return {
        pt_pin: user.pt_pin,
        nickName: user.nickName,
        remark: user.remark || user.nickName,
      };
    });
    return Promise.all(result);
  }

  async #getNickname(nocheck) {
    const body = await api({
      url: `https://me-api.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder&channel=4&isHomewhite=0&sceneval=2&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-cn',
        Connection: 'keep-alive',
        Cookie: this.cookie,
        Referer: 'https://home.m.jd.com/myJd/newhome.action',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
        Host: 'me-api.jd.com',
      },
    }).json();
    if (!body.data?.userInfo && !nocheck) {
      throw new UserError('获取用户信息失败，请检查您的 cookie ！', 201, 200);
    }
    this.nickName = body.data?.userInfo.baseInfo.nickname || decodeURIComponent(this.pt_pin);
  }

  #formatSetCookies(headers, body) {
    return new Promise((resolve) => {
      let guid, lsid, ls_token;
      this.#s_token = body.s_token;
      guid = headers['set-cookie'][0];
      guid = guid.substring(guid.indexOf('=') + 1, guid.indexOf(';'));
      lsid = headers['set-cookie'][2];
      lsid = lsid.substring(lsid.indexOf('=') + 1, lsid.indexOf(';'));
      ls_token = headers['set-cookie'][3];
      ls_token = ls_token.substring(ls_token.indexOf('=') + 1, ls_token.indexOf(';'));
      this.cookies = `guid=${guid};lang=chs;lsid=${lsid};ls_token=${ls_token};`;
      resolve();
    });
  }

  #sendNotify(title, content) {
    const notify = process.env.NINJA_NOTIFY || true;
    if (!notify) {
      console.log('Ninja 通知已关闭\n' + title + '\n' + content + '\n' + '已跳过发送');
      return;
    }
    exec(`${notifyFile} "${title}" "${content}"`, (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
      } else {
        console.log(stdout);
      }
    });
  }
};

class UserError extends Error {
  constructor(message, status, statusCode) {
    super(message);
    this.name = 'UserError';
    this.status = status;
    this.statusCode = statusCode || 200;
  }
}
