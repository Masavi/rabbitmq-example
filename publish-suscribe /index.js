const { publishMessageToQueue } = require('./publisher');
const { consumeQueue } = require('./consumer');

module.exports = {
  publishMessageToQueue,
  consumeQueue,
};
