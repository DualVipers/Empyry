import getPackageByID from "./getPackageByID.js";
import getPackages from "./getPackages.js";
import getPackageVersionByVersion from "./getPackageVersionByVersion.js";
import getPackageVersions from "./getPackageVersions.js";
import getPluginByID from "./getPluginByID.js";
import getPlugins from "./getPlugins.js";
import getRoleByUser from "./getRoleByUser.js";
import getRoles from "./getRoles.js";
import getUserByID from "./getUserByID.js";
import getUsers from "./getUsers.js";
import notFound from "./notFound.js";
import postAuthTokenByID from "./postAuthTokenByID.js";
import postPlugins from "./postPlugins.js";
import postRole from "./postRole.js";
import postUsers from "./postUsers.js";
import putUserPassword from "./putUserPassword.js";
import serveDefinition from "./serveDefinition.js";
import unauthorizedHandler from "./unauthorizedHandler.js";
import validationFail from "./validationFail.js";

export default {
    getPackageByID,
    getPackages,
    getPackageVersionByVersion,
    getPackageVersions,
    getPluginByID,
    getPlugins,
    getRoleByUser,
    getRoles,
    getUserByID,
    getUsers,
    notFound,
    postAuthTokenByID,
    postPlugins,
    postRole,
    postUsers,
    putUserPassword,
    serveDefinition,
    unauthorizedHandler,
    validationFail,
};
