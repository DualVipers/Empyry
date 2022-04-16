import { Router } from "express";

import v1Router from "./api-v1/router.js";

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
    res.status(200).json({ versions: { 1: { version: "1.0.0-alpha.0" } } });
});

apiRouter.use("/v1", v1Router);

export default apiRouter;
