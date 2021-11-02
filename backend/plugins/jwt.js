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
    formatUser: async (user) => {
      return {
        id: user.id,
        role: (await fastify.db.chain.get('users').find({ id: user.id, pt_pin: process.env.ADMIN_PIN }).value())
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
      return;
    }

    // get registered routes and check if the request path matches
    if (!new RegExp(fastify.routes.join('|')).test(request.url)) {
      return;
    }

    // skip public routes
    const publicLists = ['^/api/info$', '^/api/status$', '^/api/login/'];
    const publicRegex = new RegExp(publicLists.join('|'));
    if (publicRegex.test(request.url)) {
      return;
    }

    // check admin role
    const adminLists = ['^/api/users$', '^/api/admin.*?$'];
    const adminRegex = new RegExp(adminLists.join('|'));
    if (adminRegex.test(request.url) && request.user?.role !== 'admin') {
      throw fastify.httpErrors.forbidden();
    }

    // jwt verify
    // await request.jwtVerify();
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
