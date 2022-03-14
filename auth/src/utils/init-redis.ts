import { createClient, RedisClientType } from 'redis';

export class RedisClient {
    private _client?: RedisClientType;

    get client() {
        if(!this._client) {
            throw new Error('REDIS must be initialised');
        }
        return this._client;
    }

    connect(url: string) {
        this._client = createClient({ url });
        return new Promise<void>((resolve, reject)=>{
            this.client.on('connect', ()=>{
                console.log('Connected to REDIS');
                resolve();
            });
            this.client.on('error', (err)=>{
                reject(err);
            });
        });
    }

}