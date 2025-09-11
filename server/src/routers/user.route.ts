import { Router } from "express";

import controller from "../controllers/user.controller";

const r = Router();

r.get("/", controller.getAllUsers); // get all active users
r.get("/me", controller.getMyProfile); // get my profile(logged in user)
r.get("/:id", controller.getUserById); // get user by id

export default r;
