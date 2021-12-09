import 'fastify';
import { chain } from 'lodash';
import { Low } from 'lowdb';
import {
  container,
  env,
  envConfig,
  infoConfig,
  notifyConfig,
  userConfig,
} from '../config/index.js';

class CustomLow extends Low {
  public chain = chain();
}

declare module 'fastify' {
  interface FastifyInstance {
    AppConfig: Readonly<{
      info: typeof infoConfig;
      user: typeof userConfig;
      notify: typeof notifyConfig;
      env: typeof envConfig;
    }>;
    AppTemplate: Readonly<{
      container: typeof container;
      env: typeof env;
    }>;
    got: import('got').Got;
    lodash: import('lodash').LoDashStatic;
    db: CustomLow;
    nanoid: Promise<string>;
    utils: {
      getUserId: () => string;
      getNewToken: () => Promise<string>;
      generateDbData: (data: object) => Promise<object>;
      updateDbData: (data: object) => Promise<object>;
      getJdNickname: (cookie: string) => Promise<string>;
    };
  }
}
