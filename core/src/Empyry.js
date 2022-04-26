import express from "express";
import Waymaker from "waymaker";
import semver from "semver";
import fs from "fs-extra";
import { absolutePath } from "swagger-ui-dist";

import logger from "./logger.js";
import apiRouter from "./api/router.js";
import { loadPlugins } from "./plugins/plugins.js";

const app = express();

app.use(express.json());

const waymaker = new Waymaker["default"]({
    matcher: Waymaker.matchers.SubdomainMatcher,
    match: { baseDomain: "localhost" },
});

app.use(waymaker.middleware);

// API
waymaker.register("api", apiRouter);

// Swagger UI
waymaker.register("swagger", express.static(absolutePath()));

// Plugins
(await loadPlugins()).forEach((plugin) => {
    const pluginVersionCorrect = semver.satisfies(
        fs.readJSONSync("../package.json").version,
        plugin.constructor.supportedVersions
    );

    if (!pluginVersionCorrect) {
        logger.error(
            `Plugin ${plugin.constructor.name} Requires Versions ${
                plugin.constructor.supportedVersions
            }\nRunning Version ${fs.readJSONSync("../package.json").version}`
        );

        return;
    }

    waymaker.register(plugin.constructor.name, plugin.middleware);
});

app.listen(9000, () => logger.info("api listening at http://localhost:9000"));
