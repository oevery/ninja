import jwt from 'fastify-jwt';
import fp from 'fastify-plugin';

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function fastifyJwt(fastify, opts) {
  let secret = process.env.JWT_SECRET || fastify.db.data.config.jwt_secret;
  if (!secret) {
    secret = await fastify.nanoid();
  }
  fastify.db.data.config.jwt_secret = secret;
  await fastify.db.write();

  fastify.register(jwt, {
    formatUser: (user) => {
      return {
        id: user.id,
        role: fastify.db.chain.get('users').find({ id: user.id, pt_pin: process.env.ADMIN_PIN }).value()
          ? 'admin'
          : 'user',
      };
    },
    secret: secret,
    sign: {
      expiresIn: '25d',
    },
  });

  fastify.addHook('onRequest', async (request, reply) => {
    // skip options requests
    if (request.method === 'OPTIONS') {
      fastify.log.info(`[${request.id}] OPTIONS request skip jwt auth.`);
      return;
    }

    // get registered routes and check if the request path matches
    if (!new RegExp(fastify.routes.join('|')).test(request.url)) {
      fastify.log.debug(`[${request.id}] ${request.url} is not a registered route skip jwt auth.`);
      return;
    }

    // skip public routes
    const publicLists = ['^/api/info$', '^/api/status$', '^/api/login/'];
    const publicRegex = new RegExp(publicLists.join('|'));
    if (publicRegex.test(request.url)) {
      fastify.log.debug(`[${request.id}] ${request.url} is a public route skip jwt auth.`);
      return;
    }

    // check admin role
    const adminLists = ['^/api/users$', '^/api/admin.*?$'];
    const adminRegex = new RegExp(adminLists.join('|'));
    if (adminRegex.test(request.url) && request.user?.role !== 'admin') {
      fastify.log.debug(`[${request.id}] ${request.url} is an admin route skip need admin role.`);
      throw fastify.httpErrors.forbidden();
    }

    // jwt verify
    await request.jwtVerify();

    if (request.params.userId && request.user.id !== request.params.userId) {
      fastify.log.debug(`[${request.id}] ${request.url} userId dont consistency, throw error`);
      throw fastify.httpErrors.unauthorized();
    }
  });
}

export default fp(fastifyJwt, {
  fastify: '3.x',
  name: 'fastify-jwt',
  decorators: {
    fastify: ['db', 'nanoid', 'lodash', 'routes'],
  },
  dependencies: ['fastify-lowdb', 'fastify-nanoid', 'fastify-lodash', 'fastify-routes'],
});
