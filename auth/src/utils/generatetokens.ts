import { HttpError } from '@adwesh/common';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { initRedis } from './init-redis';

interface UserDoc {
  id: string;
  email: string;
}

interface JwtPayloadProps extends JwtPayload {
  userId: string;
  email: string;
}

export const generateAccessTokens = (user: UserDoc) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.ACCESS_TOKEN_KEY!,
    { audience: user.id, expiresIn: '1m' }
  );
};

export const generateRefreshTokens = async (user: UserDoc) => {
  const { id, email } = user;
  const accessToken = jwt.sign(
    { userId: id, email: email },
    process.env.REFRESH_TOKEN_KEY!,
    { audience: id, expiresIn: '1y' }
  );
  try {
    await initRedis.client.set(id, accessToken, { EX: 31536000 });
    return accessToken;
  } catch (error) {
    throw new HttpError('An error occured', 500);
  }
};

export const decodeRefreshToken = async (token: string) => {
  const { userId, email } = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_KEY!
  ) as JwtPayloadProps;

  try {
    const result = await initRedis.client.get(userId);
    if (result === token) {
      // blacklists unauthorized access tokens - refresh tokens expire when you're past the expiration time in Redis
      return { userId, email };
    }
    throw new HttpError('Unauthorized request', 403);
  } catch (error) {
    throw new HttpError('An error occured', 500);
  }
};
