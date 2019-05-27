const restify = require('restify'),
  config = require('config'),
  corsMiddleware = require('restify-cors-middleware'),
  authorization = require('dbf-congnitoauthorizer'),
  workspaceAccessCheck = require('./middlewares/workspaceAccessChecker');

const WebhookHandler = require('./controllers/WebhookHandler');

const MongooseConnection = new require('dbf-dbmodels/MongoConnection');
let connection = new MongooseConnection();

const server = restify.createServer({
  name: "Integromat Connector",
  version: config.Host.version
}, function (req, res) {

});

const cors = corsMiddleware({
  allowHeaders: ['authorization', 'companyInfo']
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser({
  mapParams: true
}));
server.use(restify.plugins.bodyParser({
  mapParams: true
}));

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

server.listen(config.Host.port, () => {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/', (req, res) => { res.end(JSON.stringify({
  name: "Integromat Connector",
  version: config.Host.version }));
});

server.post('/dbf/api/:version/integromat/webhook/attach', WebhookHandler.attach)
server.del('/dbf/api/:version/integromat/webhook/:webhookId/detach', WebhookHandler.detach);
server.get('/dbf/api/:version/integromat/webhooks', authorization(), workspaceAccessCheck(), WebhookHandler.getWebhooks);
server.get('/dbf/api/:version/integromat/webhook/:webhookId', authorization(), workspaceAccessCheck(), WebhookHandler.getWebhooks);