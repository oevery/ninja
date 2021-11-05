/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
export default async function (fastify, opts) {
  fastify.get('/', opts, async (request, reply) => {
    const users = await fastify.db.chain.get('users').value();
    reply.send({ data: users });
  });

  fastify.get('/:userId', opts, async (request, reply) => {
    const user = await fastify.db.chain.get('users').find({ id: request.user.id }).value();
    if (!user) {
      throw fastify.httpErrors.createError(404, '查无此人', { err_code: 'USER_NOT_FOUND' });
    }
    reply.send({ data: user });
  });

  fastify.delete('/:userId', opts, async (request, reply) => {
    await fastify.db.chain.get('users').remove({ id: request.user.id }).value();
    await fastify.db.write();
    reply.send({ message: '用户已删除' });
  });

  fastify.post('/:userId/envs', opts, async (request, reply) => {
    const { name, value } = request.body;
    const env = await fastify.utils.generateDbData({ name, value });
    const id = env.id;
    await fastify.db.chain.get('users').find({ id: request.user.id }).get('envs').push(env).commit();
    await fastify.db.write();
    const result = await fastify.db.chain.get('users').find({ id: request.user.id }).get('envs').find({ id }).value();
    if (!result) {
      throw new fastify.httpErrors.createError(500, '添加环境变量失败', {
        err_code: 'USER_ADD_ENV_FAILED',
      });
    }
    reply.send({ data: result, message: '变量添加成功' });
  });

  fastify.put('/:userId/envs/:id', opts, async (request, reply) => {
    const { value } = request.body;
    const env = fastify.utils.updateDbData({ value });
    const result = await fastify.db.chain
      .get('users')
      .find({ id: request.user.id })
      .get('envs')
      .find({ id: request.params.id })
      .mergeWith(env)
      .commit();
    await fastify.db.write();
    reply.send({ data: result, message: '变量修改成功' });
  });

  fastify.delete('/:userId/envs/:id', opts, async (request, reply) => {
    await fastify.db.chain
      .get('users')
      .find({ id: request.user.id })
      .get('envs')
      .remove({ id: request.params.id })
      .value();
    await fastify.db.write();
    reply.send({ message: '变量删除成功' });
  });
}
