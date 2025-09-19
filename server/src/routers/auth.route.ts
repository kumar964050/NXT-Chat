import { Router } from "express";

import controller from "../controllers/auth.controller";

const r = Router();

r.post("/register", controller.register); // Register a new user
r.post("/login", controller.login); // Login  a user
r.post("/forgot-password", controller.forgotPassword); // forgot password
r.patch("/reset-password", controller.resetPassword); // reset password
r.all("/verify-email", controller.verifyEmailAddress); // verify email address

export default r;
