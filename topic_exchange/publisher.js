require('dotenv').config();
const amqp = require('amqplib');

const publishMessageToTopicExchange = async (exchange, routingKey, message) => {
  // Connect to AMQPCloud or AMQP Server via URL
  let connection;

  try {
    connection = await amqp.connect(process.env.AMQP_URL);
  } catch (error) {
    return error;
  }

  const channel = await connection.createChannel();

  // Set durable to 'true' so exchange can survive a broker restart
  channel.assertExchange(exchange, 'topic', { durable: false });

  // Send a message to the given queue
  const isSent = channel.publish(exchange, routingKey, Buffer.from(message));

  isSent
    ? console.log(`\n ✅ Message sent to ${exchange} topic exchange:\n`, message)
    : console.log(`\n 🚫 Error sending message to ${exchange} topic exchange:\n`, message);

  // Close TCP connection and exit process after sending to queue
  return setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

const exchange = 'topic_test';
const routingKey = 'anonymous.info';
const messageObject = {
  id: (Math.random() * 10000).toString().slice(0, 4),
  email: 'mauriciosaavedra2005@gmail.com',
  amount: 199.50,
  date: Date.now(),
};

const message = JSON.stringify(messageObject);

publishMessageToTopicExchange(exchange, routingKey, message);

module.exports = {
  publishMessageToTopicExchange,
};
