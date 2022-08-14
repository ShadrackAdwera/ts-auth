import { createClient, RedisClientType } from 'redis';

class RedisClient {
  private _client?: RedisClientType;

  get client() {
    if (!this._client) {
      throw new Error('REDIS must be initialised');
    }
    return this._client;
  }

  connect(url: string): Promise<void> {
    this._client = createClient({ url });
    return this.client
      .connect()
      .then(() => {
        console.log('Connected to REDIS');
      })
      .catch((error) => console.log(error));
  }
}

export const initRedis = new RedisClient();
