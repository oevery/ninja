/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
export default async function (fastify, opts) {
  fastify.get('/', opts, async (request, reply) => {
    const envs = await fastify.db.data.config.env;
    reply.send({ data: envs });
  });
}
