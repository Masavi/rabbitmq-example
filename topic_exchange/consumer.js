/* eslint-disable no-console */
require('dotenv').config();
const amqp = require('amqplib');

const consumeQueue = async (queue, exchange, pattern) => {
  // Connect to AMQPCloud or AMQP Server via URL
  const connection = await amqp.connect(process.env.AMQP_URL);
  const channel = await connection.createChannel();

  // Set durable to 'true' so exchange can survive a broker restart
  await channel.assertExchange(exchange, 'topic', { durable: false });

  // Create a queue with given name, if one doesn't exist already
  await channel.assertQueue(queue, { exclusive: true });

  channel.bindQueue(queue, exchange, pattern);

  console.log(` 🔎 Listening for messages in queue '${queue}'\n To exit press CTRL+C\n`);

  // Message consumption
  channel.consume(queue, (message) => {
    console.log(' 🚀 Message received: ', message.fields, message.content.toString());
  }, {
    noAck: true,
  });
};

const queue = 'mamma_mia';
const exchange = 'topic_test';
const pattern = '*.info';

consumeQueue(queue, exchange, pattern);

module.exports = {
  consumeQueue,
};
