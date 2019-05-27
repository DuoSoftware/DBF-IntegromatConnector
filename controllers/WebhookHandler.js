const Utils = require('../utils'),
  WebhookWorker = require('../workers/webhookWorker');

module.exports.attach = async (req, res, next) => {
  let payload = req.body;

  let validateParamResponse = Utils.validateParams(payload, ["name", "url", "workspaceId", "projectId"]);
  if (!validateParamResponse.status) {
    res.status(400);
    res.send("Required parameters empty or not found");
    return;
  }

  let webhookObj = {
    id: `${Utils.toCamelCase(payload.name)}-${Utils.getRandomNumber()}`,
    webhookName: payload.name,
    webhookUrl: payload.url,
    tenant: payload.workspaceId,
    company: payload.projectId,
    payloadInterface: payload.payloadInterface,
  }

  try {
    let webhook = await WebhookWorker.Create(webhookObj);
    res.send({id: webhook.id});
  } catch (error) {
    res.status(500);
    res.send(`Error getting while saving the webhook`);
  }
}

module.exports.detach = async (req, res, next) => {
  let _webhookId = req.params.webhookId;

  try {
    let webhook = await WebhookWorker.RemoveOne({workflowId: _webhookId});
    res.send();
  } catch (error) {
    res.status(500);
    res.send(`Error getting while detaching the webhook`);
  }
}

module.exports.getWebhooks = async (req, res, next) => {
  let authUser = req.user;

  try {
    let webhooks = await WebhookWorker.GetMany({
      tenant: authUser.workspaceId, 
      company: authUser.projectId, 
    });
    
    if (webhooks) {
      res.status(200);
      res.send(Utils.success(`Webhooks fetched`, webhooks, 200)); 
    } else {
      res.status(500);
      res.send(Utils.error(`Error getting while fetching the webhooks`));
    }
  } catch (error) {
    res.status(500);
    res.send(Utils.error(error.message, undefined));
  }
}

module.exports.getWebhook = async (req, res, next) => {
  let authUser = req.user,
    webhookId = req.params.webhookId;

  try {
    let webhook = await WebhookWorker.GetOne({
      tenant: authUser.workspaceId, 
      company: authUser.projectId,
      id: webhookId
    });
    
    if (webhook) {
      res.status(200);
      res.send(Utils.success(`Webhooks fetched`, webhook, 200)); 
    } else {
      res.status(500);
      res.send(Utils.error(`Error getting while fetching the webhooks`));
    }
  } catch (error) {
    res.status(500);
    res.send(Utils.error(error.message, undefined));
  }
}
