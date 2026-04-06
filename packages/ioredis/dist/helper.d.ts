export declare const cache: {
    /**
     * @param token -> takes the token value of the cached data
     * @returns -> returns the cached data or null in case of any failure
     */
    get<T = string>(token: string): Promise<T | null>;
    /**
     * @param key -> takes the key to the data going to be cached
     * @param value -> takes the data in the string for caching
     * @param ttl -> takes time to live in seconds
     * @returns -> true if the data cached or false if not
     */
    set(key: string, value: unknown, ttl?: number): Promise<boolean>;
    /**
     * @param key -> takes the data of the cached data
     * @returns -> true if data deleted and false if not
     */
    delete(key: string): Promise<boolean>;
    /**
     * @param keys
     * @returns
     */
    deleteMany(keys: string[]): Promise<number>;
    exists(key: string): Promise<boolean>;
    expire(key: string, seconds: number): Promise<boolean>;
    ttl(key: string): Promise<number>;
    getAndDelete<T = string>(key: string): Promise<T | null>;
    incrementBy(key: string, by?: number): Promise<number>;
    decrementBy(key: string, by?: number): Promise<number>;
};
//# sourceMappingURL=helper.d.ts.map