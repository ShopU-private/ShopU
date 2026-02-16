import amqp, { Channel, Connection } from 'amqplib';
import { envs } from '@shopu/config/config';

const RABBITMQ_URL = envs.RABBITMQ_URL;

if (!RABBITMQ_URL) {
  throw new Error('RABBITMQ_URL is required in environment variable');
}

const globalForRabbitMq = globalThis as unknown as {
  connection?: Connection;
  channel?: Channel;
}

let connection: Connection | null = null;
let channel: Channel | null = null;

export const connectionToRabbitMQ = async (): Promise<void> => {
  try {
    if (globalForRabbitMq.channel && globalForRabbitMq.connection) {
      channel = globalForRabbitMq.channel;
      connection = globalForRabbitMq.connection;
      return;
    }

    connection = (await amqp.connect(RABBITMQ_URL)) as unknown as Connection;
    channel = (await (connection as any).createChannel()) as Channel;

    console.log('RabbitMQ connected and Ready');

    connection.on('error', error => {
      console.error(`RabbitMQ connection error: ${error}`)
    });

    connection.on('closed', () => {
      console.error('Redis connection error');
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForRabbitMq.channel = channel;
      globalForRabbitMq.connection = connection;
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
      if (channel) await channel.close();
      if (connection) await (connection as any).close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      if (channel) await channel.close();
      if (connection) await (connection as any).close();
      process.exit(0);
    })
  } catch (error) {
    console.error(`Rabbit MQ connection error: ${error}`)
    throw new Error(String(error))
  }
}

export const getChannel = (): Channel => {
  if (!channel) {
    throw new Error('RabbitMQ is not initialized. call connectionToRabbitMQ() first.')
  }
  return channel;
};

export { type Connection, type Channel };