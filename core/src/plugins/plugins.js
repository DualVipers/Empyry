import { PluginManager } from "live-plugin-manager";

import interfaceBuilder from "./interfaceBuilder.js";
import { Plugin } from "../database.js";
import pluginPath from "./pluginPath.js";
import logger from "../logger.js";

export const loadPlugin = async (plugin) => {
    logger.debug(`Loading ${plugin.name} from ${plugin.type}`);

    switch (plugin.type) {
        case "npm": {
            const manager = new PluginManager({
                npmRegistryUrl: plugin.location,
                pluginsPath: pluginPath,
            });

            await manager.installFromNpm(plugin.name, plugin.version);

            const PluginClass = manager.require(plugin.name);

            logger.info(`Loaded ${plugin.name}`);

            return new PluginClass(interfaceBuilder(PluginClass.name));
        }

        case "path": {
            const manager = new PluginManager({ pluginsPath: pluginPath });

            await manager.installFromPath(plugin.location);

            const PluginClass = manager.require(plugin.name);

            logger.info(`Loaded ${plugin.name}`);

            return new PluginClass(interfaceBuilder(PluginClass.name));
        }

        case "github": {
            const manager = new PluginManager({ pluginsPath: pluginPath });

            await manager.installFromGithub(plugin.location);

            const PluginClass = manager.require(plugin.name);

            logger.info(`Loaded ${plugin.name}`);

            return new PluginClass(interfaceBuilder(PluginClass.name));
        }

        default: {
            logger.error(`Could not find plugin type: ${plugin.type}`);

            throw Error(`Could not find plugin type: ${plugin.type}`);
        }
    }
};

export const loadPlugins = async () => {
    logger.info("Loading Plugins...");

    const plugins = await Plugin.query();

    logger.debug(`Found ${plugins.length} Plugins`);

    /**
     * @type Promise<import("@empyry/types").EmpyryPlugin>[]
     */
    const pluginProcessers = plugins.map(async (plugin) => {
        return loadPlugin(plugin);
    });

    const initiatedPlugins = await Promise.all(pluginProcessers);

    logger.info("Finished Loading Plugins.");

    return initiatedPlugins;
};

export const addPlugin = async (plugin) => {
    logger.debug(`Adding Plugin ${JSON.stringify(plugin)}`);

    /**
     * @type import("@empyry/types").EmpyryPlugin
     */
    await loadPlugin(plugin);

    return await Plugin.query()
        .insert({
            name: plugin.name,
            type: plugin.type,
            location: plugin.location,
            version: plugin.version,
        })
        .select(
            "id",
            "name",
            "type",
            "location",
            "version",
            "created_at",
            "updated_at"
        );
};
