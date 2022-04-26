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
     * Gets all Packages that pertain to this plugin
     *
     * @returns {Promise<Package[]>}
     * @public
     */
    getPackages(): Promise<Package[]>;

    /**
     * Gets all info on the requested Packages
     *
     * @param {string} name - The name of the Package
     *
     * @returns {Promise<Package[]>}
     * @public
     */
    getPackage(name: string): Promise<Package>;

    /**
     * Gets all Versions of the requested Package that pertain to this plugin
     *
     * @param {string} name - The name of the Package
     *
     * @returns {Promise<PackageVersion[]>}
     * @public
     */
    getVersions(name: string): Promise<PackageVersion[]>;

    /**
     * Gets all info on the requested Version of the requested Package
     *
     * @param {string} name - The name of the Package
     * @param {string} version - The SemVer Version of the Package
     *
     * @returns {Promise<PackageVersion>}
     * @public
     */
    getVersion(name: string, version: string): Promise<PackageVersion>;

    /**
     * Get the raw data of the Package
     *
     * @param {string} name - The name of the Package
     * @param {string} version - The SemVer Version of the Package
     *
     * @returns {Promise<Buffer>}
     * @public
     */
    getVersionData(name: string, version: string): Promise<Buffer>;

    /**
     * Save a PackageVersion to Empyry
     *
     * If the Package does not exist, it will be created.
     *
     * @param {string} name - The name of the Package
     * @param {string} version - The SemVer of the Package
     * @param {Buffer} data - The Package file to save
     *
     * @returns {Promise<void>}
     * @public
     */
    savePackage(name: string, version: string, data: Buffer): Promise<void>;

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
