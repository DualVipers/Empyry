import { join } from "path";

import logger from "../logger.js";
import paths from "../paths.js";

logger.debug(`Saving Plugins At ${join(paths.data, "Plugins")}`);

export default join(paths.data, "Plugins");
