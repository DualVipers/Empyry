export default (c, req, res) => {
    const valid = c.api.validateResponse(c.response, c.operation);
    if (valid.errors) {
        // response validation failed
        return res.status(502).json({ status: 502, err: valid.errors });
    }
    return c.response;
};
