import { HttpError } from '@adwesh/common';
import mongoose from 'mongoose';

import { app } from './app';
import { initRedis } from './utils/init-redis';

const start = async () => {
  if (!process.env.ACCESS_TOKEN_KEY) {
    throw new HttpError('ACCESS_TOKEN_KEY must be defined', 400);
  }

  if (!process.env.REFRESH_TOKEN_KEY) {
    throw new HttpError('REFRESH_TOKEN_KEY must be defined', 400);
  }

  if (!process.env.MONGO_URI) {
    throw new HttpError('MONGO_URI must be defined', 400);
  }

  if (!process.env.REDIS_URL) {
    throw new HttpError('REDIS_URL must be defined', 400);
  }

  try {
    console.log(process.env.REDIS_URL);
    await mongoose.connect(process.env.MONGO_URI!);
    await initRedis.connect(process.env.REDIS_URL!);

    app.listen(5000);
    console.log('Connected to Auth Service, Listening on PORT: 5000');
    process.on('SIGINT', async () => await initRedis.client.quit());
    process.on('SIGTERM', async () => await initRedis.client.quit());
  } catch (error) {
    console.log(error);
    throw new HttpError('An error occured', 500);
  }
};

start();
