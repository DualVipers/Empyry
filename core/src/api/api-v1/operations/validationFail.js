export default (c, req, res) =>
    res.status(400).json({ err: c.validation.errors });
