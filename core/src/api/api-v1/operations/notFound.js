import logger from "../../../logger.js";

export default (c, req, res) => {
    logger.debug(`Could not find path: ${req.path}`);

    res.status(404).json({ err: "not found" });
};
