import logger from "../../../logger.js";

export default (c, req, res) => {
    logger.debug(
        `Auth Fail: ${c.operation.path}\nMethod: ${c.operation.method}\nOperation: ${c.operation.operationId}`
    );
    return res.status(401).json({ err: "Please authenticate first" });
};
