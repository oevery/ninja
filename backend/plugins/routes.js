import fp from 'fastify-plugin';
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function fastifyRoutes(fastify, opts) {
  fastify.decorate('routes', new Array());

  fastify.addHook('onRoute', (routeOptions) => {
    const { url } = routeOptions;
    if (!fastify.routes.includes(url) && url !== '*') {
      fastify.routes.push(url);
    }
  });
}

export default fp(fastifyRoutes, {
  fastify: '3.x',
  name: 'fastify-routes',
});
