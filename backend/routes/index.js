/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
export default async function (fastify, opts) {
  fastify.get('/status', opts, function (request, reply) {
    const enable = fastify.db.data.config.user.enable || fastify.Appconfig.user.enable;
    const available =
      (fastify.db.data.container.limit || fastify.AppTemplate.container.limit) - fastify.db.data.users.length;
    reply.send({ data: { enable, available } });
  });

  fastify.get('/info', opts, async function (request, reply) {
    reply.send({ data: fastify.db.data.config.info });
  });

  fastify.post('/login/cookie', opts, async (request, reply) => {
    const { pt_pin, pt_key } = request.body;
    const cookie = `pt_key=${pt_key};pt_pin=${pt_pin};`;

    // get jing dong account nickname
    const nickname = await fastify.utils.getJdNickname(cookie);
    if (!nickname) {
      throw new fastify.httpErrors.createError(500, '账户解析失败，请检查后重试', {
        err_code: 'ACCOUNT_INVALID',
      });
    }

    const user = await fastify.db.chain.get('users').find({ pt_pin }).value();
    const allowNewUser = fastify.db.data.config.user.enable || fastify.Appconfig.user.enable;

    if (!user && !allowNewUser) {
      throw new fastify.httpErrors.createError(500, '管理员已关闭新用户注册', {
        err_code: 'ACCOUNT_DISABLED',
      });
    }
    // if first login register account
    if (!user) {
      const env = await fastify.utils.generateDbData({ name: 'JD_COOKIE', value: cookie });
      const newUser = await fastify.utils.generateDbData({
        pt_pin,
        nickname,
        envs: [env],
      });
      await fastify.db.chain.get('users').push(newUser).value();
      await fastify.db.write();
      fastify.log.info(`User: ${newUser.pt_pin} generated`);
      const token = await reply.jwtSign({ id: newUser.id });
      reply.send({ data: { id: newUser.id, token }, message: '注册成功，即将跳转到主页' });
    } else {
      // update cookie
      await fastify.db.chain
        .get('users')
        .find({ pt_pin })
        .get('envs')
        .find((env) => env.value.includes(user.pt_pin))
        .mergeWith({ value: cookie, updated_at: new Date() })
        .value();
      // update nickname
      const newUserInfo = fastify.utils.updateDbData({ nickname });
      await fastify.db.chain.get('users').find({ pt_pin }).mergeWith(newUserInfo).value();
      await fastify.db.write();
      const token = await reply.jwtSign({ id: user.id });
      reply.send({ data: { id: user.id, token }, message: '登录成功，即将跳转到主页' });
    }
  });
}
