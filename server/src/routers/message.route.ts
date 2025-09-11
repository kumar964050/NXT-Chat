import { Router } from "express";

import controller from "../controllers/message.controller";

const r = Router();

r.post("/", controller.addMsg); // add new msg
r.get("/", controller.getMsg); // get list of msgs

export default r;
