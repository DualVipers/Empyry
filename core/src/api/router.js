import { Router } from "express";

import v1Router from "./api-v1/router.js";

const apiRouter = Router();

apiRouter.use((req, res, next) => {
    res.set("Content-Type", "application/json");
    res.set("Access-Control-Allow-Origin", "*");
    res.set(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, PUT, PATCH, OPTIONS"
    );
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    next();
});

apiRouter.get("/", (req, res) => {
    res.status(200).json({ versions: { 1: { version: "1.0.0-alpha.0" } } });
});

apiRouter.use("/v1", v1Router);

export default apiRouter;
