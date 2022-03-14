import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserDoc {
   id: string;
   email: string;
}

interface JwtPayloadProps extends JwtPayload {
    userId: string;
    email: string;
  }


export const generateAccessTokens = (user: UserDoc) => {
    return jwt.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_KEY!, { audience: user.id, expiresIn: '1m' });
}

export const generateRefreshTokens = (user: UserDoc) => {
    return jwt.sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_KEY!, { audience: user.id, expiresIn: '1y' });
}

export const decodeRefreshToken = (token:string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_KEY!) as JwtPayloadProps;
}