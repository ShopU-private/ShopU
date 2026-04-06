export declare const pubsub: {
    publisher(channel: string, message: string): Promise<number>;
    subscriber(channels: string | string[], callback: (channel: string, message: string) => void): Promise<void>;
};
//# sourceMappingURL=pubsub.d.ts.map