/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
export default async function (fastify, opts) {
  fastify.get('/status', opts, (request, reply) => {
    const enable =
      fastify.db.data.config.user.enable || fastify.Appconfig.user.enable;
    const available =
      (fastify.db.data.container.limit || fastify.AppTemplate.container.limit) -
      fastify.db.data.users.length;
    reply.send({ data: { enable, available } });
  });

  fastify.get('/info', opts, async (request, reply) => {
    reply.send({ data: fastify.db.data.config.info });
  });

  fastify.post('/login/cookie', opts, async (request, reply) => {
    const { pt_pin, pt_key } = request.body;
    const cookie = `pt_key=${pt_key};pt_pin=${pt_pin};`;

    // get jing dong account nickname
    const nickname = await fastify.utils.getJdNickname(cookie);
    if (!nickname) {
      throw new fastify.httpErrors.createError(
        500,
        '账户解析失败，请检查后重试',
        {
          err_code: 'ACCOUNT_INVALID',
        }
      );
    }

    let user = await fastify.db.chain.get('users').find({ pt_pin }).value();
    const newUser = !user;
    const allowNewUser =
      fastify.db.data.config.user.enable || fastify.Appconfig.user.enable;
    if (!user && !allowNewUser) {
      throw new fastify.httpErrors.createError(500, '管理员已关闭新用户注册', {
        err_code: 'ACCOUNT_DISABLED',
      });
    }
    // if first login register account
    if (newUser) {
      user = await fastify.utils.generateDbData({
        pt_pin,
        nickname,
        envs: [],
      });
    } else {
      // update nickname
      const newUserInfo = fastify.utils.updateDbData({ nickname });
      await fastify.lodash.mergeWith(user, newUserInfo);
    }
    // update cookie
    const hasCookie = await fastify.lodash
      .chain(user)
      .get('envs')
      .find((env) => env.value.includes(user.pt_pin))
      .value();
    if (hasCookie) {
      await fastify.lodash
        .chain(user)
        .get('envs')
        .find((env) => env.value.includes(user.pt_pin))
        .mergeWith({ value: cookie, updated_at: new Date() })
        .value();
    } else {
      const env = await fastify.utils.generateDbData({
        name: 'JD_COOKIE',
        value: cookie,
      });
      await user.envs.unshift(env);
    }
    // save to db
    if (newUser) {
      await fastify.db.chain.get('users').push(user).value();
    } else {
      await fastify.db.chain.get('users').find({ pt_pin }).update(user).value();
    }
    await fastify.db.write();

    const token = await reply.jwtSign({ id: user.id });
    reply.send({
      data: { id: user.id, token },
      message: '登录成功，即将跳转到主页',
    });
  });
}
