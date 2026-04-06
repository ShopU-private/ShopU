import { getChannel } from './index.js';
export const queue = {
    async publish(queueName, message) {
        try {
            const channel = getChannel();
            await channel.assertQueue(queueName, { durable: true });
            const sent = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            return sent;
        }
        catch (error) {
            console.error(`RabbitMQ publish error: ${error}`);
            return false;
        }
    },
    async consume(queueName, callback, options) {
        try {
            const channel = getChannel();
            await channel.assertQueue(queueName, { durable: true });
            if (options?.prefetch) {
                channel.prefetch(options.prefetch);
            }
            channel.consume(queueName, async (msg) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString());
                        await callback(content);
                        // acknowledge the message after successfull processing
                        channel.ack(msg);
                    }
                    catch (error) {
                        console.error(`Error processing message: ${error}`);
                        // reject the message and don't requeue
                        channel.nack(msg, false, false);
                    }
                }
            }, { noAck: false });
        }
        catch (error) {
            console.error(`RabbitMQ consume error: ${error}`);
            throw error;
        }
    },
};
