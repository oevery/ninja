import fp from 'fastify-plugin';
import got from 'got';

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function fastifyGot(fastify, opts) {
  const client = got.extend({ retry: { limit: 0 } });
  const qinglong = client.extend({
    retry: { limit: 1 },
    hooks: {
      afterResponse: [
        async (response, retryWithMergedOptions) => {
          if (response.statusCode === 401) {
            const token = await fastify.getNewToken();
            const updateOptions = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            qinglong.defaults.options.merge(updatedOptions);
            return retryWithMergedOptions(updateOptions);
          }
          return response;
        },
      ],
    },
    mutableDefaults: true,
  });
  fastify.decorate('got', client);
  fastify.decorate('gotClient', { qinglong });
}

export default fp(fastifyGot, {
  fastify: '3.x',
  name: 'fastify-got',
});
