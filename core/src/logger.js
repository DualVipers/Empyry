import { createLogger } from "bunyan";
import { join } from "path";
import envPaths from "env-paths";

const paths = envPaths("Empyry", {
    suffix: "",
});

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
        path: join(__filename, "../testing.log"),
        level: "trace",
    });
}

const logger = createLogger({
    name: "Empyry",
    streams: logStreams,
});

const { fatal, warn, error, info, debug, trace } = logger;

export { fatal, warn, error, info, debug, trace };
