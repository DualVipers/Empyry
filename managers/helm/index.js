const express = require("express");
const tar = require("tar");
const fs = require("fs-extra");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { join, basename } = require("path");
const { parse, stringify } = require("yaml");

const semverRegex =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * @type {import("@empyry/types").EmpyryPlugin}
 */
module.exports = class HelmPlugin {
    static name = "helm";

    static supportedVersions = "0.0.1-beta.0";

    /**@type {import("@empyry/types").EmpyryInterface}*/
    empyryInterface;

    constructor(
        /**@type {import("@empyry/types").EmpyryInterface}*/ empyryInterface
    ) {
        this.empyryInterface = empyryInterface;

        const router = express.Router();

        // Generate Index File
        router.get("/index.yaml", async (req, res) => {
            const indexFile = {
                apiVersion: "v1",
                generated: new Date(Date.now()),
            };

            const packages = await empyryInterface.getPackages();

            if (packages.length > 0) {
                indexFile.entries = {};
            }

            await Promise.all(
                packages.map(async (packageData) => {
                    const name = packageData.name;
                    const packageYaml = [];

                    const versions = await empyryInterface.getVersions(name);

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
                return res.status(400).send(null);
            }

            try {
                const chartBuffer = await empyryInterface.getVersionData(
                    req.params.name,
                    req.params.version
                );

                res.set("Content-Type", "application/gzip");
                res.status(200).send(chartBuffer);
            } catch {
                res.status(404).send(null);
            }
        });

        // Get Prov
        router.get("/charts/:name-:version.tgz.prov", async (req, res) => {
            const matchedVersion = req.params.version.match(semverRegex);

            if (!matchedVersion) {
                return res.status(400).send(null);
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
                res.status(404).send(null);
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
                if (req.files) {
                    const files = req.files;

                    let chartFile;
                    let provFile;

                    chartFile = files["chart"][0].buffer;
                    provFile = files["prov"][0].buffer;

                    if (!chartFile || !provFile) {
                        return res.status(400).send();
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
                                join(
                                    empyryInterface.cacheDir,
                                    tempID,
                                    "Chart.yaml"
                                )
                            )
                            .toString()
                    );

                    await empyryInterface.savePackage(
                        chartYaml.name,
                        chartYaml.version,
                        chartFile
                    );

                    fs.emptyDirSync(tempDir);
                    fs.rmdirSync(tempDir);
                    fs.rmSync(tempPath);

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
                } else {
                    const chartZipped = req.body;

                    const tempID = Date.now().toString();
                    const tempDir = join(empyryInterface.cacheDir, tempID);
                    const tempPath = join(
                        empyryInterface.cacheDir,
                        `${tempID}.tgz`
                    );
                    fs.ensureDirSync(tempDir);

                    fs.writeFileSync(tempPath, chartZipped);

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
                                join(
                                    empyryInterface.cacheDir,
                                    tempID,
                                    "Chart.yaml"
                                )
                            )
                            .toString()
                    );

                    await empyryInterface.savePackage(
                        chartYaml.name,
                        chartYaml.version,
                        chartZipped
                    );

                    fs.emptyDirSync(tempDir);
                    fs.rmdirSync(tempDir);
                    fs.rmSync(tempPath);
                }

                res.status(200).send(null);
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
