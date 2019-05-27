const connection = require('dbf-dbmodels/Models/IntegromatWebhook').IntegromatWebhook;

module.exports.Create = async (data) => {
  return await connection(data).save();
};

module.exports.GetOne = async (context) => {
  return await connection.findOne(context);
}

module.exports.GetMany = async (context) => {
  return await connection.find(context);
}

module.exports.UpdateOne = async (context, data) => {
  return await connection.findOneAndUpdate(context, data);
}

module.exports.RemoveOne = async (context) => {
  return await connection.deleteOne(context);
}