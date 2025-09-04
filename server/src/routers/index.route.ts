import { Router } from "express";

// // import all routes here
import authRoutes from "./auth.route";
// import customerRoutes from "./customer.route";
// import LoanRoutes from "./loan.route";
// import RepaymentRoutes from "./repayment.route";

// //  auth middleware
// import Authenticate from "../middlewares/authenticate";

const api = Router();

// // Authentication routes
api.use("/auth", authRoutes);
// // Customer routes
// api.use("/customer", Authenticate, customerRoutes);
// // Customer routes
// api.use("/loan", Authenticate, LoanRoutes);
// // Repayment Routs
// api.use("/repayment", Authenticate, RepaymentRoutes);

export default api;
