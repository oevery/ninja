import fp from 'fastify-plugin';
import { JSONFile, Low } from 'lowdb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function fastifyLowdb(fastify, opts) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const db = new Low(new JSONFile(join(__dirname, '../db/database.json')));
  await db.read();
  const initData = {
    config: fastify.AppConfig,
    container: {},
    users: [],
  };
  db.data = db.data || initData;
  await db.write();
  db.chain = fastify.lodash.chain(db.data);
  fastify.decorate('db', db);
  fastify.addHook('onClose', async () => {
    fastify.log.debug('Closing lowdb plugin');
    await db.write();
  });
}

export default fp(fastifyLowdb, {
  fastify: '3.x',
  name: 'fastify-lowdb',
  decorators: {
    fastify: ['AppConfig', 'lodash'],
  },
  dependencies: ['fastify-app-config', 'fastify-lodash'],
});
