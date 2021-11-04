import { readFile } from 'fs/promises';
const json = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));

// ninja info config
export const infoConfig = {
  title: 'Ninja',
  version: json.version,
  url: '',
  notice: {
    show: true,
    title: 'Ninja 提醒您',
    content: `<p>为了您的财产安全请关闭免密支付以及打开支付验密（京东-设置-支付设置-支付验密设置）。</p><p>建议京东账户绑定微信以保证提现能到账。</p><p>付费代挂都是坑比</p><p>Ninja 是一个开源项目，目前仅在<a href="https://github.com/MoonBegonia/ninja" target="_blank"> Github </a>和<a href="https://t.me/joinchat/sHKuteb_lfdjNmZl" target="_blank"> TG 频道</a>分发和更新。如果喜欢可以去点个 Star。</p>`,
  },
  login_notice: {
    cookie: '请在下方输入您的 cookie 登录。',
    wskey: '请在下方输入您的 wskey 登录。',
  },
};

// ninja container config
// export const containerConfig = {
//   limit: 40,
//   mode: {
//     default: 'smaller',
//     values: [
//       { value: 'larger', description: '新增账户优先加入数量多的容器' },
//       { value: 'smaller', description: '新增账户优先加入数量少的容器' },
//       { value: 'copy', description: '新增账户同时加入所有容器' },
//     ],
//   },
// };

// ninja user config
export const userConfig = {
  enable: true,
};

// ninja env config
export const envConfig = [
  {
    multiple: true,
    value: 'JD_COOKIE',
    description: '京东 cookie',
  },
  {
    multiple: true,
    value: 'JD_WSKEY',
    description: '京东 wskey',
  },
];

// ninja notify config
export const notifyConfig = {
  sync: true,
  type: {
    gobot: {
      enable: true,
      label: 'GOBOT',
      url: {
        value: '',
        label: 'GOBOT 地址',
        description: '推送到个人QQ: http://127.0.0.1/send_private_msg 群：http://127.0.0.1/send_group_msg ',
      },
      token: {
        value: '',
        label: 'GOBOT Token',
        description: '访问密钥',
      },
      qq: {
        value: '',
        label: 'QQ',
        description:
          '如果GOBOT_URL设置 /send_private_msg 则需要填入 user_id=个人QQ 相反如果是 /send_group_msg 则需要填入 group_id=QQ群',
      },
    },
    server_chan: {
      enable: true,
      label: 'Server 酱',
      key: {
        value: '',
        label: 'Server 酱 Key',
        description: 'Server 酱密钥',
      },
    },
    bark: {
      enable: true,
      label: 'Bark',
      push: {
        value: '',
        label: 'Bark Push',
        description: 'Bark App 的信息(IP/设备码，例如：https://api.day.app/XXXXXXXX)',
      },
      sound: {
        value: '',
        label: 'Bark 铃声',
        description: 'Bark App 推送铃声,铃声列表去APP查看复制填写',
      },
      group: {
        value: 'Ninja',
        label: 'Bark 群组',
        description: 'Bark 推送消息的分组, 默认为"Ninja"',
      },
    },
    tg_bot: {
      enable: true,
      label: 'TG BOT',
      url: {
        value: 'https://api.telegram.org',
        label: 'URL',
        description: 'Telegram api 地址，默认为官方地址',
      },
      token: {
        value: '',
        label: 'Token',
        description: 'TG Bot Token',
      },
      chat_id: {
        value: '',
        label: 'ChatId',
        description: '接收通知消息的 telegram 用户或群组的 id',
      },
      proxy_host: {
        value: '',
        label: 'Proxy Host',
        description: '代理地址，如果没有可以不填',
      },
      proxy_port: {
        value: '',
        label: 'Proxy Port',
        description: '代理端口，如果没有可以不填',
      },
      proxy_auth: {
        value: '',
        label: 'Proxy Auth',
        description: '代理认证，如果没有可以不填',
      },
    },
    ding_talk: {
      enable: true,
      label: '钉钉',
      token: {
        value: '',
        label: 'Token',
        description: '钉钉机器人 Token',
      },
      secret: {
        value: '',
        label: 'Secret',
        description: '钉钉机器人 Secret',
      },
    },
    qywx: {
      enable: true,
      label: '企业微信',
      key: {
        value: '',
        label: 'Key',
        description: '企业微信 Key',
      },
      am: {
        value: '',
        label: 'QYWX_AM',
        description: `此处填你企业微信应用消息的值(详见文档 https://work.weixin.qq.com/api/doc/90000/90135/90236)
      环境变量名 QYWX_AM依次填入 corpid,corpsecret,touser(注:多个成员ID使用|隔开),agentid,消息类型(选填,不填默认文本消息类型)`,
      },
    },
    igot: {
      enable: true,
      label: 'IGOT',
      key: {
        value: '',
        label: 'Push Key',
        description: 'IGOT Push Key',
      },
    },
    pushplus: {
      enable: true,
      label: 'Push Plus',
      token: {
        value: '',
        label: 'Token',
        description: 'Push Plus Token',
      },
      user: {
        value: '',
        label: 'User',
        description:
          '不提供PUSH_PLUS_USER则默认为一对一推送。一对多推送的“群组编码”（一对多推送下面->您的群组(如无则新建)->群组编码，如果您是创建群组人。也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送）',
      },
    },
  },
};

export const env = {
  single: true,
  value: '',
  description: '',
  placeholder: '',
};

export const container = {
  name: '',
  id: '',
  url: '',
  client_id: '',
  client_secret: '',
  token: '',
  limit: 40,
  expiration: 0,
};
