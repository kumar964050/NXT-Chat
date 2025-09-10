import { Router } from "express";

import controller from "../controllers/user.controller";

const r = Router();

r.get("/me", controller.getMyProfile); // Register a new user

export default r;
