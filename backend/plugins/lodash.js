import fp from 'fastify-plugin';
import lodash from 'lodash';

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function fastifyLodash(fastify, opts) {
  fastify.decorate('lodash', lodash);
}

export default fp(fastifyLodash, {
  fastify: '3.x',
  name: 'fastify-lodash',
});
