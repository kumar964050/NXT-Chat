import { NextFunction, RequestHandler, Router } from "express";

import controller from "../controllers/message.controller";

const r = Router();

r.post("/", controller.addMsg); // add new msg
r.post("/file", controller.uploadFileMsg); // get list of msgs
r.get("/", controller.getMsg); // get list of msgs

export default r;
