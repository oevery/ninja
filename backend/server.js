import fastify from 'fastify';
import appService from './app.js';

const app = fastify({ logger: true, level: 'trace' });

// Register your application as a normal plugin.
app.register(appService);

app.listen(process.eventNames.FASTIFY_PORT || 5701, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
