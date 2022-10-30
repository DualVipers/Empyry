import type { Request, Response } from "express";

/**
 * The outline for an Empyry plugin
 *
 * @public
 */
export class EmpyryPlugin {
    /**
     * The name of the package manager this plugin supports
     *
     * WARNING: This should never change.  It is used for the database and routing.
     *
     * @type {string}
     *
     * @static
     * @public
     */
    static name: string;

    /**
     * A SemVer of the supported Empyry version
     *
     * @type {string}
     *
     * @static
     * @public
     */
    static supportedVersions: string;

    /**
     * Created an instance of the plugin
     *
     * @param {EmpyryInterface} empyryInterface - The interface for the plugin to interact with Empryry
     *
     * @public
     */
    constructor(empyryInterface: EmpyryInterface);

    /**
     * The middleware for routing
     *
     * @type {Function}
     *
     * @public
     */
    middleware: (req: Request, res: Response) => void;

    /**
     * Clean a version of a Package
     *
     * @type {Function}
     *
     * @param {string} name - The name of the Package to clean
     * @param {version} name - The version of the Package to clean
     *
     * @public
     */
    cleanVersion: (name: string, version: string) => void;
}

/**
 * The interface for plugins to interact with Empyry
 *
 * @public
 */
export type EmpyryInterface = {
    /**
     * The cache directory for the plugin
     *
     * @type {string}
     *
     * @public
     */
    cacheDir: string;

    /**
     * Gets all Packages that pertain to this plugin for a User or Guest
     *
     * @param {Authentication} authentication - The Authentication for the User.  Leave undefined for Guests
     *
     * @returns {Promise<Package[]>}
     * @public
     */
    getPackages(authentication: Authentication?): Promise<Package[]>;

    /**
     * Gets all info on the requested Packages
     *
     * @param {string} name - The name of the Package
     * @param {Authentication} authentication - The Authentication for the User. Leave undefined for Guests
     *
     * @returns {Promise<Package[]>}
     * @public
     */
    getPackage(name: string, authentication: Authentication?): Promise<Package>;

    /**
     * Gets all Versions of the requested Package that pertain to this plugin
     *
     * @param {string} name - The name of the Package
     * @param {Authentication} authentication - The Authentication for the User. Leave undefined for Guests
     *
     * @returns {Promise<PackageVersion[]>}
     * @public
     */
    getVersions(
        name: string,
        authentication: Authentication?
    ): Promise<PackageVersion[]>;

    /**
     * Gets all info on the requested Version of the requested Package
     *
     * @param {string} name - The name of the Package
     * @param {string} version - The SemVer Version of the Package
     * @param {Authentication} authentication - The Authentication for the User. Leave undefined for Guests
     *
     * @returns {Promise<PackageVersion>}
     * @public
     */
    getVersion(
        name: string,
        version: string,
        authentication: Authentication?
    ): Promise<PackageVersion>;

    /**
     * Get the raw data of the Package
     *
     * @param {string} name - The name of the Package
     * @param {string} version - The SemVer Version of the Package
     * @param {Authentication} authentication - The Authentication for the User. Leave undefined for Guests
     *
     * @returns {Promise<Buffer>}
     * @public
     */
    getVersionData(
        name: string,
        version: string,
        authentication: Authentication?
    ): Promise<Buffer>;

    /**
     * Save a PackageVersion to Empyry
     *
     * If the Package does not exist, it will be created.
     *
     * @param {string} name - The name of the Package
     * @param {string} version - The SemVer of the Package
     * @param {Buffer} data - The Package file to save
     * @param {Authentication} authentication - The Authentication for the User saving a PackageVersion
     *
     * @returns {Promise<void>}
     * @public
     */
    savePackage(
        name: string,
        version: string,
        data: Buffer,
        authentication: Authentication
    ): Promise<void>;

    /**
     * Read a file for your plugin
     *
     * WARNING: Do not use this unless you have to, your plugin will have to clean these files on its own
     *
     * @param {string} path - The directory to read (in reference to the root of your package's control)
     *
     * @returns {Promise<Buffer>}
     * @public
     */
    readFile(path: string): Promise<Buffer>;

    /**
     * Save an extra file
     *
     * WARNING: Do not use this unless you have to, your plugin will have to clean these files on its own
     *
     * @param {string} path - The directory to save (in reference to the root of your package's control)
     * @param {Buffer} data - The file to save
     *
     * @returns {Promise<void>}
     * @public
     */
    saveFile(path: string, data: Buffer): Promise<void>;

    /**
     * Delete a file for the plugin
     *
     * WARNING: Do not use this unless you have to, your plugin will have to clean these files on its own
     *
     * @param {string} path - The directory to read (in reference to the root of your package's control)
     *
     * @returns {Promise<Buffer>}
     * @public
     */
    deleteFile(path: string): Promise<Buffer>;

    /**
     * Authenticates a supplied Email/Password combo
     *
     * WARNING: Please use Tokens if possible for increased security
     *
     * @param {string} email - The Email to authenticate
     * @param {string} password - The Password to authenticate
     *
     * @returns {Promise<Authentication?>}
     * @public
     */
    authEmail(email: string, password: string): Promise<Authentication?>;

    /**
     * Authenticates a supplied Username/Password combo
     *
     * WARNING: Please use Tokens if possible for increased security
     *
     * @param {string} username - The Username to authenticate
     * @param {string} password - The Password to authenticate
     *
     * @returns {Promise<Authentication?>}
     * @public
     */
    authPass(username: string, password: string): Promise<Authentication?>;

    /**
     * Generate a Token for a specific user
     *
     * The recommended flow is to verify with {@link EmpyryInterface#authEmail} or {@link EmpyryInterface#authPass} then generate and send a token
     *
     * @param {string} auth - The authentication to generate a Token for
     * @param {number?} token - The length of the Token (Default: 20 Chars)
     * @param {number?} expire - The length in seconds that the Token lasts for (Default: 30 Days)
     *
     * @returns {Promise<sting?>} A Token to authenticate the user
     * @public
     */
    generateAuthToken(
        auth: Authentication,
        length: number?,
        expire: number?
    ): Promise<string?>;

    /**
     * Authenticates a supplied Token
     *
     * @param {string} token - The Token to authenticate
     *
     * @returns {Promise<Authentication?>}
     * @public
     */
    authToken(token: string): Promise<Authentication?>;
};

/**
 * A Package stored in Empyry.
 *
 * @public
 */
export type Package = {
    id: number;
    name: string;
    description?: string;
    source?: string;
    home?: string;
    license?: string;
    created_at: string;
    updated_at: string;
};

/**
 * A Version of a Package stored in Empyry.
 *
 * @public
 */
export type PackageVersion = {
    id: number;
    version: string;
    digest?: string;
    created_at: string;
    updated_at: string;
};

/**
 * An Authentication Object to be used in Empyry.
 *
 * @public
 */
export type Authentication = {
    user_id: number;
};
