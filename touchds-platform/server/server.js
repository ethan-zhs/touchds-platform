const Koa = require('koa');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const router = require('./router');
const yargs = require('yargs')
const log = require('fancy-log')
const chalk = require('chalk')
const session = require('koa-session');

const argv = yargs
    .alias('port', 'p')
    .default('port', 8999)
    .argv;

const app = new Koa();

app.keys = ['itouchtv@datav'];

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('Cache-Control', 'no-cache');
})

app.use(bodyParser());

app.use(session({
    maxAge: 86400000,
}, app))

app.use(cors({
    origin: function(ctx) {
      if (ctx.url === '/test') {
        return false;
      }
      return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(router.routes());

app.listen(argv.port);

log(chalk.green('API Server is running on: http://localhost:%s'), argv.port);
