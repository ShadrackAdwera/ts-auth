import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import brypto from 'crypto';

import { User } from '../models/User';
import { generateAccessTokens } from '../utils/generatetokens';

const signUp = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    const { username, email, password } = req.body;

    let foundUser;
    let hashedPassword;
    let accessToken;

    try {
        foundUser = await User.findOne({email}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(foundUser) {
        return next(new HttpError('This user exists, login instead', 400));
    }

    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    const newUser = new User({
        username, email, password: hashedPassword, resetToken: undefined, tokenExpiration: undefined
    });
    try {
        await newUser.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    try {
        accessToken = generateAccessTokens(newUser);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(201).json({message: 'Login Successful', user: { id: newUser.id, email: newUser.email, token: accessToken }});
}

const login = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    const { email, password } = req.body;

    let foundUser;
    let isPassword;
    let accessToken;

    try {
        foundUser = await User.findOne({email}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!foundUser) {
        return next(new HttpError('This accout don\'t exist! Login instead', 400));
    }

    try {
        isPassword = await bcrypt.compare(password, foundUser.password);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!isPassword) {
        return next(new HttpError('Invalid email or password', 401));
    }

    try {
        accessToken = generateAccessTokens(foundUser);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(200).json({message: 'Login Successful', user: { id: foundUser.id, email: foundUser.email, token: accessToken }});

 }

 const requestPasswordReset = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid email', 422));
    }

     const { email } = req.body;
     let foundUser;

     try {
         foundUser = await User.findOne({ email }).exec();
     } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
     }
     if(!foundUser) {
        return next(new HttpError('Invalid email', 404));
     }

     const resetTkn = brypto.randomBytes(64).toString('hex');
     const tokenExpDate = new Date(new Date().getTime() + 3600000);

     foundUser.resetToken = resetTkn;
     foundUser.tokenExpiration = tokenExpDate;

     try {
         await foundUser.save();
     } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
     }
     console.log(`http://localhost:3000/reset-password/${resetTkn}`);

     //send email with reset link ${frontend_url}/resetToken
     res.status(200).json({ message: 'Check your email for a reset password link' })

  }

  const resetPassword = async(req: Request, res: Response, next: NextFunction) => {
      const { password, confirmPassword } = req.body;
      const { resetToken } = req.params;

      let hashedPassword;
      let foundUser;
       //check if passwords match
    if(password !== confirmPassword) {
        return next(new HttpError('The passwords do not match', 422));
    }

      try {
          foundUser = await User.findOne({ resetToken, tokenExpiration: { $gt: new Date() } })
      } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
      }

      if(!foundUser) {
        return next(new HttpError('Invalid request', 403));
      }

      try {
          hashedPassword = await bcrypt.hash(password, 12);
      } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
      }
      foundUser.password = hashedPassword;
      foundUser.tokenExpiration = undefined;
      foundUser.resetToken = undefined;

      try {
          await foundUser.save();
      } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
      }
      // invalidate any refresh tokens / access tokens
      res.status(200).json({ message: 'Your password has been successfully reset' })

   }

 export { signUp, login, requestPasswordReset, resetPassword };