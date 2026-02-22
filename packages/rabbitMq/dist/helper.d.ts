import { QueueMessage } from '@shopu/types-store/types';
export declare const queue: {
    publish(queueName: string, message: QueueMessage): Promise<boolean>;
    consume(queueName: string, callback: (message: QueueMessage) => Promise<void>, options?: {
        prefetch?: number;
    }): Promise<void>;
};
//# sourceMappingURL=helper.d.ts.map