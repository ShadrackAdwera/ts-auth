import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

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
        username, email, password: hashedPassword
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