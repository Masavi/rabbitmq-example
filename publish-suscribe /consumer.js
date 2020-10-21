/* eslint-disable no-console */
require('dotenv').config();
const amqp = require('amqplib');

const consumeQueue = async (queue) => {
  // Connect to AMQPCloud or AMQP Server via URL
  const connection = await amqp.connect(process.env.AMQP_URL);
  const channel = await connection.createChannel();

  // Create a queue with given name, if one doesn't exist already
  await channel.assertQueue(queue, { durable: false });

  console.log(` 🔎 Listening for messages in queue '${queue}'\n To exit press CTRL+C\n`);

  // Message consumption
  channel.consume(queue, (message) => {
    console.log(' 🚀 Message received: ', message.content.toString());
  }, {
    noAck: true,
  });
};

const queue = 'demoRabbit';

consumeQueue(queue);

module.exports = {
  consumeQueue,
};
