'use strict';

const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('@koa/router');
const body = require('koa-body');
const serve = require('koa-static');
const User = require('./user');

// Create express instance
const app = new Koa();
const router = new Router();

const handler = async (ctx, next) => {
  try {
    ctx.body = {
      code: undefined,
      data: undefined,
      message: '',
    };
    await next();
    ctx.body.code = ctx.body.code || ctx.status;
    if (ctx.body.data?.message) {
      ctx.body.message = ctx.body.data.message;
      ctx.body.data.message = undefined;
    }
  } catch (err) {
    console.log(err);
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      code: err.status || err.statusCode || 500,
      message: err.message,
    };
  }
};

app.use(serve('static'));
app.use(cors());
app.use(handler);
app.use(router.routes()).use(router.allowedMethods());

router.get('/api/status', (ctx) => {
  ctx.body = {
    code: 200,
    message: 'Ninja is already.',
  };
});

router.get('/api/info', async (ctx) => {
  const data = await User.getPoolInfo();
  ctx.body.data = data;
});

router.get('/api/qrcode', async (ctx) => {
  const user = new User({});
  await user.getQRConfig();
  ctx.body.data = {
    token: user.token,
    okl_token: user.okl_token,
    cookies: user.cookies,
    QRCode: user.QRCode,
  };
});

router.post('/api/check', body(), async (ctx) => {
  const body = ctx.request.body;
  const user = new User(body);
  const data = await user.checkQRLogin();
  ctx.body.data = data;
});

router.post('/api/cklogin', body(), async (ctx) => {
  const body = ctx.request.body;
  const user = new User(body);
  const data = await user.CKLogin();
  ctx.body.data = data;
});

router.get('/api/userinfo', async (ctx) => {
  const query = ctx.query;
  const eid = query.eid;
  const user = new User({ eid });
  const data = await user.getUserInfoByEid();
  ctx.body.data = data;
});

router.post('/api/delaccount', body(), async (ctx) => {
  const body = ctx.request.body;
  const eid = body.eid;
  const user = new User({ eid });
  const data = await user.delUserByEid();
  ctx.body.data = data;
});

app.listen(5701);
