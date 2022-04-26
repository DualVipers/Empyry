import path, { join } from "path";
import fs from "fs-extra";

import { Package } from "../database.js";
import logger from "../logger.js";
import paths from "../paths.js";
import digest from "../data/package/digest.js";
import load from "../data/package/load.js";
import save from "../data/package/save.js";
import readFile from "../data/readFile.js";
import saveFile from "../data/saveFile.js";

export default (platformName) => {
    /**
     * @type {import("@empyry/types").EmpyryInterface}
     */
    return {
        cacheDir: path.join(paths.cache, platformName),

        getPackages: async () => {
            logger.debug(`${platformName} Requested Packages`);

            return await Package.query()
                .where("platform", platformName)
                .select(
                    "id",
                    "name",
                    "description",
                    "source",
                    "home",
                    "license",
                    "created_at",
                    "updated_at"
                );
        },

        getPackage: async (packageName) => {
            logger.debug(`${platformName} Requested Package ${packageName}`);

            return await Package.query()
                .where("platform", platformName)
                .where("name", packageName)
                .first()
                .select(
                    "id",
                    "name",
                    "description",
                    "source",
                    "home",
                    "license",
                    "created_at",
                    "updated_at"
                );
        },

        getVersions: async (packageName) => {
            logger.debug(
                `${platformName} Requested PackageVersions For ${packageName}`
            );

            const requestedPackage = await Package.query()
                .where("platform", platformName)
                .where("name", packageName)
                .first()
                .select(
                    "id",
                    "name",
                    "description",
                    "source",
                    "home",
                    "license",
                    "created_at",
                    "updated_at"
                );

            return await requestedPackage
                .$relatedQuery("versions")
                .select("id", "version", "digest", "created_at", "updated_at");
        },

        getVersion: async (packageName, version) => {
            logger.debug(
                `${platformName} Requested Version ${version} for Package ${packageName}`
            );

            const requestedPackage = await Package.query()
                .where("platform", platformName)
                .where("name", packageName)
                .first()
                .select(
                    "id",
                    "name",
                    "description",
                    "source",
                    "home",
                    "license",
                    "created_at",
                    "updated_at"
                );

            if (!requestedPackage) {
                logger.error(
                    `${platformName} Requested Version Of ${packageName} That Does Not Exist or It Does Not Have Access To`
                );
                throw Error(
                    `${platformName} Requested Version Of ${packageName} That Does Not Exist or It Does Not Have Access To`
                );
            }

            return await requestedPackage
                .$relatedQuery("versions")
                .where("version", version)
                .first()
                .select("id", "version", "digest", "created_at", "updated_at");
        },

        getVersionData: async (packageName, version) => {
            logger.debug(
                `${platformName} Requested Version Data For v${version} of ${packageName}`
            );

            const requestedPackage = await Package.query()
                .where("platform", platformName)
                .where("name", packageName)
                .first()
                .select("id");

            if (!requestedPackage) {
                logger.error(
                    `${platformName} Requested Version Data Of ${packageName} That Does Not Exist or It Does Not Have Access To`
                );
                throw Error(
                    `${platformName} Requested Version Data Of ${packageName} That Does Not Exist or It Does Not Have Access To`
                );
            }

            const requestedVersion = await requestedPackage
                .$relatedQuery("versions")
                .where("version", version)
                .first()
                .select("id");

            if (!requestedVersion) {
                logger.error(
                    `${platformName} Requested Version Data For v${version} of ${packageName} That Does Not Exist`
                );
                throw Error(
                    `${platformName} Requested Version Data For v${version} of ${packageName} That Does Not Exist`
                );
            }

            return await load(packageName, version);
        },

        savePackage: async (packageName, version, data) => {
            logger.debug(
                `${platformName} Requested To Save v${version} of ${packageName}`
            );

            let requestedPackage = await Package.query()
                .where("name", packageName)
                .first()
                .select(
                    "id",
                    "name",
                    "platform",
                    "description",
                    "source",
                    "home",
                    "license",
                    "created_at",
                    "updated_at"
                );

            if (!requestedPackage) {
                logger.info(
                    `${platformName} Is Creating Package ${packageName}`
                );

                requestedPackage = await Package.query().insert({
                    name: packageName,
                    platform: platformName,
                });
            } else if (requestedPackage.platform != platformName) {
                logger.error(
                    `${platformName} Is Creating Trying To Create PackageVersion for ${packageName} But That Package Is For ${requestedPackage.platformName}`
                );

                throw Error(
                    `Package ${requestedPackage.name} is not for platform ${platformName}.  Package is for platform ${requestedPackage.platform}`
                );
            }

            await save(data, packageName, version);

            await requestedPackage.$relatedQuery("versions").insert({
                version,
                digest: await digest(packageName, version),
            });

            logger.debug(`${platformName} Saved v${version} of ${packageName}`);
        },

        readFile: async (path) => {
            logger.debug(`${platformName} Requested To Read File ${path}`);

            return await readFile(join(paths.data, platformName, path));
        },

        saveFile: async (path, data) => {
            logger.debug(`${platformName} Requested To Save File ${path}`);

            return await saveFile(join(paths.data, platformName, path), data);
        },

        deleteFile: async (path) => {
            logger.debug(`${platformName} Requested To Delete File ${path}`);

            try {
                return await fs.rm(join(paths.data, platformName, path));
            } catch {
                logger.error(`${platformName} Could Not Delete File ${path}`);
                return;
            }
        },
    };
};
