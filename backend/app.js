import AutoLoad from 'fastify-autoload';
import cors from 'fastify-cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
export default async function (fastify, opts) {
  fastify.setErrorHandler(async (error, request, reply) => {
    const code = error.code || error.statusCode || 500;
    reply.code(code).send({ code, message: error.message, err_code: error.err_code });
    fastify.log.error(error.message);
  });

  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ code: 404, message: '你来到了一片荒漠' });
  });

  opts = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            code: {
              type: 'integer',
              default: 200,
            },
            message: {
              type: 'string',
            },
            data: {},
          },
        },
      },
    },
  };

  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({ prefix: '/api' }, opts),
  });

  // cors
  if (process.env.FASTIFY_CORS === 'true') {
    fastify.register(cors, function (instance) {
      return (req, callback) => {
        let corsOptions;
        const origin = req.headers.origin;
        // do not include CORS headers for requests from localhost
        const regex = new RegExp(`localhost:${process.env.FASTIFY_PORT}|127.0.0.1:${process.env.FASTIFY_PORT}`);
        if (regex.test(origin)) {
          corsOptions = { origin: false };
        } else {
          corsOptions = { origin: true };
        }
        corsOptions = { methods: ['GET', 'PUT', 'POST', 'DELETE'], maxAge: 3600 };
        callback(null, corsOptions); // callback expects two parameters: error and options
      };
    });
  }
}
