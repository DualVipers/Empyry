import logger from "../../../logger.js";

export default (c, req, res) => {
    logger.debug(
        `Validation Failure\nPath: ${c.operation.path}\nMethod: ${
            c.operation.method
        }\nOperation: ${c.operation.operationId}\nErrors: ${JSON.stringify(
            c.validation.errors
        )}`
    );
    res.status(400).json({ err: c.validation.errors });
};
