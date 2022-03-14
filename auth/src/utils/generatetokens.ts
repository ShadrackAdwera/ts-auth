import jwt from 'jsonwebtoken';

interface UserDoc {
   id: string;
   email: string;
}


export const generateAccessTokens = (user: UserDoc) => {
    return jwt.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_KEY!, { audience: user.id, expiresIn: '1m' });
}

export const generateRefreshTokens = (user: UserDoc) => {
    return jwt.sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_KEY!, { audience: user.id, expiresIn: '1y' });
}