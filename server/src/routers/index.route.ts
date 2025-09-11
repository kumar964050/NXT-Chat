import { Router } from "express";

// // import all routes here
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import msgRoutes from "./message.route";

// //  auth middleware
import Authenticate from "../middlewares/authenticate";

const api = Router();

api.use("/auth", authRoutes); // Authentication routes
api.use("/users", Authenticate, userRoutes); // user routes
api.use("/messages", Authenticate, msgRoutes); // msgs routes

export default api;
