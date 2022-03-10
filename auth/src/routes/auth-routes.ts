import { body } from "express-validator";
import express from "express";

import { signUp, login } from "../controllers/auth-controllers";

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

export { router as authRoutes };
