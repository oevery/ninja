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

  fastify.post('/env', opts, async (request, reply) => {
    const { name, value } = request.body;
    const env = fastify.utils.generateDbData({ name, value });
    await fastify.db.chain.get('users').find({ id: request.user.id }).get('envs').assign(env).value();
  });

  fastify.put('/env/:id', opts, async (request, reply) => {
    const { value } = request.body;
    const env = fastify.utils.updateDbData({ value });
    await fastify.db.chain.get('users').find({ id: request.user.id }).get('envs').find({ id: request.params.id }).mergeWith(env).value();
    await fastify.db.write();
    const result = await fastify.db.chain.get('users').find({ id: request.user.id }).get('envs').find({ id: request.params.id }).value();
    reply.send({data: result, message: '变量修改成功'});
  })

  fastify.delete('/env/:id', opts, async (request, reply) => {
    await fastify.db.chain.get('users').find({ id: request.user.id }).get('envs').remove({ id: request.params.id }).value();
    await fastify.db.write();
    reply.send({ message: '变量删除成功' });
  })
}
