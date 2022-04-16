import express from "express";
import Waymaker from "waymaker";

import apiRouter from "./api/router.js";

const app = express();

const waymaker = new Waymaker({
    matcher: Waymaker.matchers.SubdomainMatcher,
    match: { baseDomain: "localhost" },
});

app.use(express.json());

waymaker.register("api", apiRouter);

app.use(waymaker.middleware);

app.listen(9000, () => console.info("api listening at http://localhost:9000"));
