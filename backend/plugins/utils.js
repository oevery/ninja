import fp from 'fastify-plugin';

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
function fastifyAppUtils(fastify, opts, done) {
  /**
   * get qinglong container new jwt token and save it to lowdb
   */
  async function getNewToken() {
    const { name, id, url, client_id, client_secret } = fastify.db.chain.get('container').value();
    if (!url) {
      throw fastify.httpErrors.createError(500, 'container url is empty, get new token failed', {
        err_code: 'CONTAINER_EMPTY_URL',
      });
    }
    const { data } = await fastify
      .got('open/auth/token', {
        prefixUrl: url,
        searchParams: {
          client_id: client_id,
          client_secret: client_secret,
        },
      })
      .json();
    const token = data.token;
    const expiration = data.expiration;
    fastify.db.chain.get('container').assign({ token, expiration }).value();
    await fastify.db.write();
    return token;
  }

  /**
   * assign id and created_at date to db data object
   * @param {object} data data to generate
   * @return {object} generated data
   */
  async function generateDbData(data) {
    return Object.assign(data, {
      id: await fastify.nanoid(),
      created_at: new Date(),
    });
  }

  /**
   * assign updated_at date to db data object
   * @param {object} data data to update
   * @return {object} updated data
   */
  async function updateDbData(data) {
    return fastify.lodash.merge(data, {
      updated_at: new Date(),
    });
  }

  /**
   * get jd account nickname
   * @param {string} cookie cookie - pt_key=xxx;pt_pin=xxx;
   * @return {string} nickname or undefined
   */
  async function getJdNickname(cookie) {
    const { data } = await fastify
      .got({
        url: `https://me-api.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder&channel=4&isHomewhite=0&sceneval=2&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
        headers: {
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'zh-cn',
          Connection: 'keep-alive',
          Cookie: cookie,
          Referer: 'https://home.m.jd.com/myJd/newhome.action',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
          Host: 'me-api.jd.com',
        },
      })
      .json();
    return data.userInfo?.baseInfo.nickname;
  }

  fastify.decorate('utils', {
    getNewToken,
    generateDbData,
    updateDbData,
    getJdNickname,
  });
  done();
}

export default fp(fastifyAppUtils, {
  fastify: '3.x',
  name: 'fastify-app-utils',
  decorators: {
    fastify: ['db', 'got', 'nanoid'],
  },
  dependencies: ['fastify-got', 'fastify-lowdb', 'fastify-nanoid'],
});
