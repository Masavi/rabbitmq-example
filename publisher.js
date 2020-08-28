require('dotenv').config();
const amqp = require('amqplib');

const publishMessageToQueue = async (message, queue) => {
  // Connect to AMQPCloud or AMQP Server via URL
  const connection = await amqp.connect(process.env.AMQP_URL);
  const channel = await connection.createChannel();

  // Create a queue with given name, if one doesn't exist already
  await channel.assertQueue(queue, { durable: false });

  // Send a message to the given queue
  const isSent = channel.sendToQueue(queue, Buffer.from(message));

  isSent
    ? console.log('\n ✅ Message sent: ', message)
    : console.log('\n 🚫 Error sending message: ', message);

  // Close TCP connection and exit process after sending to queue
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

// Mensaje
const messageObject = {
  id: (Math.random() * 10000).toString().slice(0, 4),
  email: 'mauriciosaavedra2005@gmail.com',
  amount: 199.50,
  date: Date.now(),
};

const message = JSON.stringify(messageObject);
const queue = 'demoRabbit';

publishMessageToQueue(message, queue);

module.exports = {
  publishMessageToQueue,
};
