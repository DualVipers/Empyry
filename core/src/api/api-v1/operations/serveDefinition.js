import logger from "../../../logger.js";

export default (c, req, res) => {
    const definition = c.api.document;

    const url = "http://api.localhost:9000/v1";
    definition.servers = [{ url }];

    logger.debug("Serving Definition");

    return res.status(200).json(definition);
};
