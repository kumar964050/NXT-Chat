import { Router } from "express";

// // import all routes here
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

// //  auth middleware
import Authenticate from "../middlewares/authenticate";

const api = Router();

api.use("/auth", authRoutes); // Authentication routes
api.use("/users", Authenticate, userRoutes); // user routes

export default api;
