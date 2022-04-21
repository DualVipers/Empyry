import express from "express";
import Waymaker from "waymaker";

import logger from "./logger.js";
import apiRouter from "./api/router.js";

const app = express();

const waymaker = new Waymaker["default"]({
    matcher: Waymaker.matchers.SubdomainMatcher,
    match: { baseDomain: "localhost" },
});

app.use(express.json());

waymaker.register("api", apiRouter);

app.use(waymaker.middleware);

app.listen(9000, () => logger.info("api listening at http://localhost:9000"));
