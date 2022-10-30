import path, { join } from "path";
import fs from "fs-extra";

import { Package, Token, User } from "../database.js";
import logger from "../logger.js";
import paths from "../paths.js";
import digest from "../data/package/digest.js";
import load from "../data/package/load.js";
import save from "../data/package/save.js";
import readFile from "../data/readFile.js";
import saveFile from "../data/saveFile.js";
import { verifyPass } from "../password.js";
import { generateToken } from "../token.js";

export default (platformName) => {
    /**
     * @type {import("@empyry/types").EmpyryInterface}
     */
    return {
        cacheDir: path.join(paths.cache, platformName),

        getPackages: async (authentication) => {
            logger.debug(
                `${platformName} Requested Packages For User ${authentication.user_id}`
            );

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

        getPackage: async (packageName, authentication) => {
            logger.debug(
                `${platformName} Requested Package ${packageName} For User ${authentication.user_id}`
            );

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

        getVersions: async (packageName, authentication) => {
            logger.debug(
                `${platformName} Requested PackageVersions For ${packageName} For User ${authentication.user_id}`
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

        getVersion: async (packageName, version, authentication) => {
            logger.debug(
                `${platformName} Requested Version ${version} for Package ${packageName} For User ${authentication.user_id}`
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

        getVersionData: async (packageName, version, authentication) => {
            logger.debug(
                `${platformName} Requested Version Data For v${version} Of ${packageName} For User ${authentication.user_id}`
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

        savePackage: async (packageName, version, data, authentication) => {
            logger.debug(
                `${platformName} Requested To Save v${version} Of ${packageName} For User ${authentication.user_id}`
            );

            if (!authentication.user_id) {
                logger.error(
                    `${platformName} Saving v${version} Of ${packageName} Requires Authentication`
                );

                throw Error(
                    `${platformName} Saving v${version} Of ${packageName} Requires Authentication`
                );
            }

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
                    `${platformName} Is Creating Package ${packageName} For User ${authentication.user_id}`
                );

                requestedPackage = await Package.query().insert({
                    name: packageName,
                    platform: platformName,
                });

                await requestedPackage.$relatedQuery("roles").insert({
                    user_id: authentication.user_id,
                });
            } else if (requestedPackage.platform != platformName) {
                logger.error(
                    `${platformName} Is Creating Trying To Create PackageVersion for ${packageName} But That Package Is For ${requestedPackage.platformName}`
                );

                throw Error(
                    `Package ${requestedPackage.name} is not for platform ${platformName}.  Package is for platform ${requestedPackage.platform}`
                );
            }

            const roles = await requestedPackage
                .$relatedQuery("roles")
                .where("user_id", authentication.user_id)
                .select("id", "user_id");

            if (roles.length < 1) {
                logger.error(
                    `${platformName} User ${authentication.user_id} Can Not Save v${version} Of ${packageName}`
                );

                throw new Error(
                    `${platformName} User ${authentication.user_id} Can Not Save v${version} Of ${packageName}`
                );
            }

            await save(data, packageName, version);

            await requestedPackage.$relatedQuery("versions").insert({
                version,
                digest: await digest(packageName, version),
            });

            logger.debug(`${platformName} Saved v${version} Of ${packageName}`);
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

        authEmail: async (email, password) => {
            logger.debug(
                `${platformName} Requested To Authenticate ${email} Using Password`
            );

            const foundUser = await User.query()
                .findOne({ email })
                .select("id", "username", "password_hash");

            logger.debug(
                `Found User: ${JSON.stringify(foundUser)}\nFor Email: ${email}`
            );

            if (!foundUser) {
                return;
            }

            if (!(await verifyPass(foundUser.password_hash, password))) {
                return { user_id: foundUser.id };
            }
        },

        authPass: async (username, password) => {
            logger.debug(
                `${platformName} Requested To Authenticate ${username} Using Password`
            );

            const foundUser = await User.query()
                .findOne({ username })
                .select("id", "username", "password_hash");

            logger.debug(
                `Found User: ${JSON.stringify(
                    foundUser
                )}\nFor Username: ${username}`
            );

            if (!foundUser) {
                return;
            }

            if (!(await verifyPass(foundUser.password_hash, password))) {
                return { user_id: foundUser.id };
            }
        },

        generateAuthToken: async (auth, length, expire) => {
            logger.debug(
                `${platformName} Requested To Generate Token for ${auth.user_id}`
            );

            const foundUser = await User.query()
                .findById(auth.user_id)
                .select("id", "username", "password_hash");

            logger.debug(
                `Found User: ${JSON.stringify(foundUser)}\nFor: ${auth.user_id}`
            );

            if (!foundUser) {
                return;
            }

            const generatedToken = generateToken(length ?? 20);

            const createdToken = await foundUser
                .$relatedQuery("tokens")
                .insert({
                    token: generatedToken,
                    expire:
                        expire ??
                        Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
                })
                .select("id");

            logger.debug(`Added Token: ${JSON.stringify(createdToken)}`);
        },

        authToken: async (authToken) => {
            logger.debug(
                `${platformName} Requested To Authenticate Token ${authToken}`
            );

            const token = await Token.query()
                .findOne("token", authToken)
                .select("user_id");

            if (!token) {
                return;
            }

            return { user_id: token.user_id };
        },
    };
};
