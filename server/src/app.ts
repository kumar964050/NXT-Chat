import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import ErrorHandler from "./middlewares/ErrorHandler";
import apiRoutes from "./routers/index.route";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

// API Routes
app.use("/api", apiRoutes);

app.use(ErrorHandler); // global error handler

export default app;
