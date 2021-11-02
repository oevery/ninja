import fp from 'fastify-plugin';
import { customAlphabet } from 'nanoid/async';
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function fastifyLowdb(fastify, opts) {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
  fastify.decorate('nanoid', nanoid);
}

export default fp(fastifyLowdb, {
  fastify: '3.x',
  name: 'fastify-nanoid',
});
