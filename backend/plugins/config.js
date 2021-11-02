import fp from 'fastify-plugin';
import { container, env, envConfig, infoConfig, notifyConfig, userConfig } from '../config/index.js';

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function fastifyConfig(fastify, opts) {
  fastify.decorate('AppConfig', {
    info: infoConfig,
    user: userConfig,
    notify: notifyConfig,
    env: envConfig,
  });
  fastify.decorate('AppTemplate', {
    container,
    env,
  });
}

export default fp(fastifyConfig, {
  fastify: '3.x',
  name: 'fastify-app-config',
});
