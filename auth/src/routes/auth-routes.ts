import { body } from "express-validator";
import { checkAuth } from "@adwesh/common";
import express from "express";

import { signUp, login, requestPasswordReset, resetPassword, generateNewTokens } from "../controllers/auth-controllers";

const router = express.Router();

router.post(
  "/sign-up",
  [
    body("username").trim().not().isEmpty().isLength({ min: 3 }),
    body("email").trim().normalizeEmail().isEmail(),
    body("password").trim().not().isEmpty().isLength({ min: 6 }),
  ],
  signUp
);

router.post(
  "/login",
  [
    body("email").trim().normalizeEmail().isEmail(),
    body("password").trim().not().isEmpty().isLength({ min: 6 }),
  ],
  login
);

router.post(
  "/request-reset-token",
  [
    body("email").trim().normalizeEmail().isEmail(),
  ],
  requestPasswordReset
);

router.post(
  "/reset-password/:resetToken",
  [
    body("password").trim().not().isEmpty().isLength({ min: 6 }),
    body("confirmPassword").trim().not().isEmpty().isLength({ min: 6 })
  ],
  resetPassword
);

router.use(checkAuth);
router.post('/refresh-token',[
  body('accessToken').trim().not().isEmpty()
], generateNewTokens);


export { router as authRoutes };
