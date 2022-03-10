import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

interface UserDoc extends Document {
    username: string;
    email: string;
    password: string;
    version: number;
}

export const generateAccessTokens = (user: UserDoc) => {
    return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_KEY!, { audience: user.id, expiresIn: '5m' });
}