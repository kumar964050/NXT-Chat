import { Router } from "express";

import controller from "../controllers/user.controller";

const r = Router();

r.get("/", controller.getAllUsers); // get all active users
r.get("/me", controller.getMyProfile); // get my profile(logged in user)
r.patch("/toggle-mute", controller.toggleMuteContact); // toggle mute contact
r.get("/:id", controller.getUserById); // get user by id
r.put("/:id", controller.updateUserDetails); // update user by id
r.delete("/:id", controller.deleteAccount); // delete user by id
r.patch("/:id/change-password", controller.ChangePassword); // change password
r.patch("/:id/profile-image", controller.uploadProfileImage); // update profile image
r.delete("/:id/profile-image", controller.removeProfileImage); // remove profile image

export default r;
