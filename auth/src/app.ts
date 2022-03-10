import { HttpError } from '@adwesh/common';
import express, { Request, Response, NextFunction } from 'express';

import { authRoutes } from './routes/auth-routes';

const app = express();

app.use(express.json());
//CORS
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, PUT, PATCH, POST, DELETE, GET');
    next();
  });

  app.use('/api/auth', authRoutes);

  app.use((req: Request, res: Response, next: NextFunction) => {
    throw new HttpError('This method / route does not exist!', 404);
  });

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(500).json({ message: error.message || 'An error occured, try again'})
  });

  export { app };