import { HttpError } from '@adwesh/common';
import mongoose from 'mongoose';

import { app } from './app';

const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new HttpError('JWT must be defined', 400);
    }

    if(!process.env.MONGO_URI) {
        throw new HttpError('MONGO_URI must be defined', 400);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI!);
        app.listen(5000);
    } catch (error) {
        console.log(error);
        throw new HttpError('An error occured', 500);
    }
}

start();