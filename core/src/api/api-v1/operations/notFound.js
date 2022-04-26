import logger from "../../../logger.js";

export default (c, req, res) => {
    if (req.method == "OPTIONS") {
        return res.status(200).json(null);
    }

    logger.debug(`Could not find path: ${req.path}`);

    res.status(404).json({ err: "not found" });
};
