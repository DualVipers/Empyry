import { createLogger } from "bunyan";
import { join } from "path";
import { fileURLToPath } from "url";

import paths from "./paths.js";

const __dirname = fileURLToPath(import.meta.url);

const outputLevel = process.env.NODE_ENV == "production" ? "info" : "debug";

const logStreams = [];

logStreams.push({ stream: process.stdout, level: outputLevel });

if (process.env.NODE_ENV == "production") {
    logStreams.push({
        path: join(paths.log, `./${new Date(Date.now()).toISOString()}.log`),
        level: "trace",
    });
} else {
    logStreams.push({
        path: join(__dirname, "../../testing.log"),
        level: "trace",
    });
}

const logger = createLogger({
    name: "Empyry",
    streams: logStreams,
});

export default logger;
