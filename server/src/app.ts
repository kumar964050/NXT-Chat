import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import ErrorHandler from "./middlewares/ErrorHandler";
import apiRoutes from "./routers/index.route";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// API Routes
app.use("/api", apiRoutes);

app.use(ErrorHandler); // global error handler

export default app;
