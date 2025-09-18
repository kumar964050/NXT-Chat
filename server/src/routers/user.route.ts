import { Router } from "express";

import controller from "../controllers/user.controller";

const r = Router();

r.get("/", controller.getAllUsers); // get all active users
r.get("/me", controller.getMyProfile); // get my profile(logged in user)
r.get("/:id", controller.getUserById); // get user by id
r.put("/:id", controller.updateUserDetails); // get user by id
r.delete("/:id", controller.deleteAccount); // get user by id
r.patch("/:id/change-password", controller.ChangePassword); // change password
r.patch("/:id/profile-image", controller.uploadProfileImage); // get user by id
r.delete("/:id/profile-image", controller.removeProfileImage); // get user by id

export default r;
