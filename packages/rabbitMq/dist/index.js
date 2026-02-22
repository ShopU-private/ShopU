import amqp from 'amqplib';
import { envs } from '@shopu/config/config';
const RABBITMQ_URL = envs.RABBITMQ_URL;
if (!RABBITMQ_URL) {
    throw new Error('RABBITMQ_URL is required in environment variable');
}
const globalForRabbitMq = globalThis;
let connection = null;
let channel = null;
export const connectionToRabbitMQ = async () => {
    try {
        if (globalForRabbitMq.channel && globalForRabbitMq.connection) {
            channel = globalForRabbitMq.channel;
            connection = globalForRabbitMq.connection;
            return;
        }
        connection = (await amqp.connect(RABBITMQ_URL));
        channel = (await connection.createChannel());
        console.log('RabbitMQ connected and Ready');
        connection.on('error', error => {
            console.error(`RabbitMQ connection error: ${error}`);
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
            if (channel)
                await channel.close();
            if (connection)
                await connection.close();
            process.exit(0);
        });
        process.on('SIGTERM', async () => {
            if (channel)
                await channel.close();
            if (connection)
                await connection.close();
            process.exit(0);
        });
    }
    catch (error) {
        console.error(`Rabbit MQ connection error: ${error}`);
        throw new Error(String(error));
    }
};
export const getChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ is not initialized. call connectionToRabbitMQ() first.');
    }
    return channel;
};
