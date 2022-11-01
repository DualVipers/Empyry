const express = require("express");
const tar = require("tar");
const fs = require("fs-extra");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { join, basename } = require("path");
const { parse, stringify } = require("yaml");
const authHeaderParse = require("auth-header").parse;

const semverRegex =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * @type {import("@empyry/types").EmpyryPlugin}
 */
module.exports = class HelmPlugin {
    static name = "helm";

    static supportedVersions = "0.0.1";

    /**@type {import("@empyry/types").EmpyryInterface}*/
    empyryInterface;

    constructor(
        /**@type {import("@empyry/types").EmpyryInterface}*/ empyryInterface
    ) {
        this.empyryInterface = empyryInterface;

        const router = express.Router();

        // Header Authentication
        router.use(async (req, res, next) => {
            if (!req.get("authorization")) {
                return next();
            }

            const auth = authHeaderParse(req.get("authorization"));

            if (auth.scheme === "Basic") {
                var [username, password] = Buffer(auth.token, "base64")
                    .toString()
                    .split(":", 2);

                req.auth = await empyryInterface.authPass(username, password);
            } else if (auth.scheme === "Bearer") {
                req.auth = await empyryInterface.authToken(auth.token);
            }

            next();
        });

        // Generate Index File
        router.get("/index.yaml", async (req, res) => {
            const indexFile = {
                apiVersion: "v1",
                generated: new Date(Date.now()),
            };

            const packages = await empyryInterface.getPackages(req.auth);

            if (packages.length > 0) {
                indexFile.entries = {};
            }

            await Promise.all(
                packages.map(async (packageData) => {
                    const name = packageData.name;
                    const packageYaml = [];

                    const versions = await empyryInterface.getVersions(
                        name,
                        req.auth
                    );

                    versions.forEach((version) => {
                        packageYaml.push({
                            created: new Date(version.created_at),
                            description: packageData.description
                                ? packageData.description
                                : undefined,
                            digest: version.digest,
                            home: packageData.home
                                ? packageData.home
                                : undefined,
                            name: name,
                            sources: [packageData.source],
                            urls: [
                                `${req.protocol}://${req.headers.host}/charts/${name}-${version.version}.tgz`,
                            ],
                            version: version.version,
                        });
                    });

                    indexFile.entries[name] = packageYaml;
                })
            );

            res.set("Content-Type", "text/yaml");
            res.status(200).send(stringify(indexFile));
        });

        // Get Chart
        router.get("/charts/:name-:version.tgz", async (req, res) => {
            const matchedVersion = req.params.version.match(semverRegex);

            if (!matchedVersion) {
                return res.sendStatus(400);
            }

            try {
                const chartBuffer = await empyryInterface.getVersionData(
                    req.params.name,
                    req.params.version,
                    req.auth
                );

                res.set("Content-Type", "application/gzip");
                res.status(200).send(chartBuffer);
            } catch {
                res.sendStatus(404);
            }
        });

        // Get Prov
        router.get("/charts/:name-:version.tgz.prov", async (req, res) => {
            const matchedVersion = req.params.version.match(semverRegex);

            if (!matchedVersion) {
                return res.sendStatus(400);
            }

            try {
                const chartProv = await empyryInterface.readFile(
                    join(
                        "prov",
                        `${req.params.name}-${req.params.version}.tgz.prov`
                    )
                );

                res.set("Content-Type", "application/gzip");
                res.status(200).send(chartProv);
            } catch {
                res.sendStatus(404);
            }
        });

        // Save Chart
        router.post(
            "/api/charts",
            express.raw({
                type: "application/x-www-form-urlencoded",
                limit: "50mb",
            }),
            upload.fields([
                { name: "chart", maxCount: 1 },
                { name: "prov", maxCount: 1 },
            ]),
            async (req, res) => {
                if (!req.auth) {
                    return res.status(401).json({ err: "No User Auth" });
                }

                let chartFile;
                let provFile;

                if (req.files) {
                    const files = req.files;

                    chartFile = files["chart"][0].buffer;

                    if (files["prov"]) {
                        provFile = files["prov"][0].buffer;

                        if (!provFile) {
                            return res.sendStatus(400);
                        }
                    }

                    if (!chartFile) {
                        return res.sendStatus(400);
                    }
                } else {
                    chartFile = req.body;
                }

                const tempID = Date.now().toString();
                const tempDir = join(empyryInterface.cacheDir, tempID);
                const tempPath = join(
                    empyryInterface.cacheDir,
                    `${tempID}.tgz`
                );
                fs.ensureDirSync(tempDir);

                fs.writeFileSync(tempPath, chartFile);

                await tar.x({
                    keep: true,
                    file: tempPath,
                    strip: 1,
                    cwd: join(empyryInterface.cacheDir, tempID),
                    filter: (path) =>
                        basename(path) == "Chart.yaml" ||
                        basename(path) == "Chart.yml",
                });

                const chartYaml = parse(
                    fs
                        .readFileSync(
                            join(empyryInterface.cacheDir, tempID, "Chart.yaml")
                        )
                        .toString()
                );

                try {
                    await empyryInterface.savePackage(
                        chartYaml.name,
                        chartYaml.version,
                        chartFile,
                        req.auth
                    );
                } catch {
                    fs.emptyDirSync(tempDir);
                    fs.rmdirSync(tempDir);
                    fs.rmSync(tempPath);

                    return res.sendStatus(401);
                }

                if (provFile) {
                    let name = provFile
                        .toString()
                        .substring(provFile.toString().indexOf("\nname: ") + 7);

                    name = name.substring(0, name.toString().indexOf("\n"));

                    let version = provFile
                        .toString()
                        .substring(
                            provFile.toString().indexOf("\nversion: ") + 10
                        );

                    version = version.substring(
                        0,
                        version.toString().indexOf("\n")
                    );

                    await empyryInterface.saveFile(
                        join("prov", `${name}-${version}.tgz.prov`),
                        provFile
                    );
                }

                fs.emptyDirSync(tempDir);
                fs.rmdirSync(tempDir);
                fs.rmSync(tempPath);

                res.sendStatus(200);
            }
        );

        // Save Prov
        router.post(
            "/api/prov",
            express.raw({
                type: "application/x-www-form-urlencoded",
                limit: "50mb",
            }),
            async (req, res) => {
                if (!req.auth) {
                    return res.status(401).json({ err: "No User Auth" });
                }

                const prov = req.body;

                let name = prov
                    .toString()
                    .substring(prov.toString().indexOf("\nname: ") + 7);

                name = name.substring(0, name.toString().indexOf("\n"));

                let version = prov
                    .toString()
                    .substring(prov.toString().indexOf("\nversion: ") + 10);

                version = version.substring(
                    0,
                    version.toString().indexOf("\n")
                );

                if (!(await empyryInterface.canSavePackage(name, req.auth))) {
                    return res.sendStatus(401);
                }

                await empyryInterface.saveFile(
                    join("prov", `${name}-${version}.tgz.prov`),
                    prov
                );

                res.status(200).send(null);
            }
        );

        this.middleware = router;
    }

    middleware;

    cleanVersion = (name, version) => {
        try {
            this.empyryInterface.deleteFile(
                join("prov", `${name}-${version}.tgz.prov`)
            );
        } catch {
            return;
        }
    };
};
