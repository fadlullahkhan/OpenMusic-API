import amqp from 'amqplib';

const ProducerServices = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(function () {
      connection.close();
    }, 1000);
  },
};

export default ProducerServices;