/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
export default async function (fastify, opts) {
  fastify.get('/', opts, async (request, reply) => {
    const users = await fastify.db.chain.get('users').value();
    reply.send({ data: users });
  });

  fastify.get('/:id', opts, async (request, reply) => {
    const user = await fastify.db.chain.get('users').find({ id: request.params.id }).value();
    reply.send({ data: user });
  });

  fastify.delete('/:id', opts, async (request, reply) => {
    await fastify.db.chain.get('users').remove({ id: request.params.id }).value();
    await fastify.db.write();
    reply.send({ data: 'ok' });
  });
}
